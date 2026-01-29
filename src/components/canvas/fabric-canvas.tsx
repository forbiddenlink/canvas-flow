'use client';

import { useEffect, useRef, useState } from 'react';
import { useCanvasStore } from '@/store/canvas-store';
import { RotationIndicator } from './rotation-indicator';

// Declare fabric on window
declare global {
  interface Window {
    fabric: any;
  }
}

export function FabricCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotationIndicator, setRotationIndicator] = useState({
    visible: false,
    angle: 0,
    x: 0,
    y: 0,
  });
  const {
    canvas,
    setCanvas,
    setZoom,
    isPanning,
    setIsPanning,
    canvasWidth,
    canvasHeight,
    addToHistory,
    activeTool,
    activeShape,
    toolColor,
    strokeWidth,
    brushOpacity,
    textFontFamily,
    textFontSize,
    textAlignment,
    textShadowEnabled,
    textShadowColor,
    textShadowBlur,
    textShadowOffsetX,
    textShadowOffsetY,
    cropAspectRatio,
    polygonSides,
    brushHardness,
    gradientType,
    gradientStartColor,
    gradientEndColor,
  } = useCanvasStore();

  // Initialize canvas with Fabric.js
  useEffect(() => {
    if (!canvasRef.current) return;

    let fabricCanvas: any = null;

    // Wait for Fabric.js to load from CDN
    const initCanvas = () => {
      if (typeof window.fabric === 'undefined') {
        setTimeout(initCanvas, 100);
        return;
      }

      // Initialize Fabric.js canvas
      fabricCanvas = new window.fabric.Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selection: true,
    });

    // Set canvas in store
    setCanvas(fabricCanvas);

    // Add initial state to history
    addToHistory(JSON.stringify(fabricCanvas.toJSON()));

    // Enable panning with spacebar + drag or middle mouse button
    let lastPosX = 0;
    let lastPosY = 0;

    fabricCanvas.on('mouse:down', (opt: any) => {
      const evt = opt.e;

      // Middle mouse button or spacebar + left mouse
      if (evt.button === 1 || (evt.button === 0 && isPanning)) {
        fabricCanvas.selection = false;
        fabricCanvas.defaultCursor = 'grabbing';
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;

        fabricCanvas.on('mouse:move', (opt: any) => {
          const e = opt.e;
          const vpt = fabricCanvas.viewportTransform;
          if (!vpt) return;

          vpt[4] += e.clientX - lastPosX;
          vpt[5] += e.clientY - lastPosY;

          fabricCanvas.requestRenderAll();
          lastPosX = e.clientX;
          lastPosY = e.clientY;
        });
      }
    });

    fabricCanvas.on('mouse:up', () => {
      fabricCanvas.off('mouse:move');
      fabricCanvas.selection = true;
      fabricCanvas.defaultCursor = 'default';
    });

    // Mouse wheel zoom
    fabricCanvas.on('mouse:wheel', (opt: any) => {
      const delta = opt.e.deltaY;
      let newZoom = fabricCanvas.getZoom();
      newZoom *= 0.999 ** delta;

      // Limit zoom
      if (newZoom > 5) newZoom = 5;
      if (newZoom < 0.1) newZoom = 0.1;

      fabricCanvas.zoomToPoint(
        { x: opt.e.offsetX, y: opt.e.offsetY },
        newZoom
      );

      setZoom(newZoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    // Update history on modifications
    fabricCanvas.on('object:modified', () => {
      addToHistory(JSON.stringify(fabricCanvas.toJSON()));
    });

    fabricCanvas.on('object:added', () => {
      addToHistory(JSON.stringify(fabricCanvas.toJSON()));
    });

    fabricCanvas.on('object:removed', () => {
      addToHistory(JSON.stringify(fabricCanvas.toJSON()));
    });

    // Show rotation angle indicator during rotation
    fabricCanvas.on('object:rotating', (e: any) => {
      const obj = e.target;
      if (obj) {
        const angle = obj.angle || 0;
        const pointer = fabricCanvas.getPointer(e.e);
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (canvasRect) {
          setRotationIndicator({
            visible: true,
            angle: angle % 360,
            x: canvasRect.left + pointer.x,
            y: canvasRect.top + pointer.y,
          });
        }
      }
    });

    // Hide rotation indicator when rotation ends
    fabricCanvas.on('object:modified', () => {
      setRotationIndicator((prev) => ({ ...prev, visible: false }));
    });

    fabricCanvas.on('mouse:up', () => {
      setRotationIndicator((prev) => ({ ...prev, visible: false }));
    });
    };

    // Start initialization
    initCanvas();

    // Cleanup on unmount
    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }
      if (canvas) {
        setCanvas(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasWidth, canvasHeight]); // Re-initialize when dimensions change

  // Handle spacebar for panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsPanning(true);
        if (canvas) {
          canvas.defaultCursor = 'grab';
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPanning(false);
        if (canvas) {
          canvas.defaultCursor = 'default';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [canvas, setIsPanning]);

  // Handle shape drawing
  useEffect(() => {
    if (!canvas || typeof window.fabric === 'undefined') return;

    const fabric = window.fabric;
    let isDrawing = false;
    let currentShape: any = null;
    let startX = 0;
    let startY = 0;

    const handleMouseDown = (opt: any) => {
      if (activeTool !== 'shape' || isPanning) return;

      // Prevent default selection behavior when drawing shapes
      const evt = opt.e;
      if (evt) {
        evt.preventDefault();
        evt.stopPropagation();
      }

      const pointer = canvas.getPointer(opt.e);
      isDrawing = true;
      startX = pointer.x;
      startY = pointer.y;

      // Disable selection while drawing
      canvas.selection = false;

      // Create shape based on activeShape type
      if (activeShape === 'rectangle') {
        currentShape = new fabric.Rect({
          left: startX,
          top: startY,
          width: 0,
          height: 0,
          fill: toolColor,
          stroke: toolColor,
          strokeWidth: strokeWidth,
          opacity: 0.8,
          selectable: false, // Disable selection while drawing
        });
      } else if (activeShape === 'circle') {
        currentShape = new fabric.Circle({
          left: startX,
          top: startY,
          radius: 0,
          fill: toolColor,
          stroke: toolColor,
          strokeWidth: strokeWidth,
          opacity: 0.8,
          selectable: false, // Disable selection while drawing
        });
      } else if (activeShape === 'line') {
        currentShape = new fabric.Line([startX, startY, startX, startY], {
          stroke: toolColor,
          strokeWidth: strokeWidth,
          opacity: 0.8,
          selectable: false,
          fill: '', // Lines don't have fill
        });
      } else if (activeShape === 'arrow') {
        // For arrow, we'll use a group with a line and triangle
        const line = new fabric.Line([startX, startY, startX, startY], {
          stroke: toolColor,
          strokeWidth: strokeWidth,
        });

        // Create a small triangle for the arrowhead (will be positioned later)
        const arrowHead = new fabric.Triangle({
          left: startX,
          top: startY,
          width: strokeWidth * 3,
          height: strokeWidth * 3,
          fill: toolColor,
          angle: 0,
        });

        currentShape = new fabric.Group([line, arrowHead], {
          opacity: 0.8,
          selectable: false,
        });
      } else if (activeShape === 'polygon') {
        // Create a polygon based on polygonSides
        const points: { x: number; y: number }[] = [];
        const radius = 50; // Initial radius, will be updated on mouse move

        for (let i = 0; i < polygonSides; i++) {
          const angle = (i * 2 * Math.PI) / polygonSides - Math.PI / 2;
          points.push({
            x: startX + radius * Math.cos(angle),
            y: startY + radius * Math.sin(angle),
          });
        }

        currentShape = new fabric.Polygon(points, {
          left: startX,
          top: startY,
          fill: toolColor,
          stroke: toolColor,
          strokeWidth: strokeWidth,
          opacity: 0.8,
          selectable: false,
          originX: 'center',
          originY: 'center',
        });
      }

      if (currentShape) {
        canvas.add(currentShape);
        canvas.renderAll();
      }
    };

    const handleMouseMove = (opt: any) => {
      if (!isDrawing || !currentShape || activeTool !== 'shape') return;

      const pointer = canvas.getPointer(opt.e);

      if (activeShape === 'rectangle') {
        const width = pointer.x - startX;
        const height = pointer.y - startY;

        if (width < 0) {
          currentShape.set({ left: pointer.x });
        }
        if (height < 0) {
          currentShape.set({ top: pointer.y });
        }

        currentShape.set({
          width: Math.abs(width),
          height: Math.abs(height),
        });
      } else if (activeShape === 'circle') {
        const radius = Math.sqrt(
          Math.pow(pointer.x - startX, 2) + Math.pow(pointer.y - startY, 2)
        );
        currentShape.set({ radius });
      } else if (activeShape === 'line') {
        // Update line end point
        currentShape.set({
          x2: pointer.x,
          y2: pointer.y,
        });
      } else if (activeShape === 'arrow') {
        // For arrow, we need to update both line and arrowhead
        const items = currentShape.getObjects();
        const line = items[0];
        const arrowHead = items[1];

        // Update line endpoint
        line.set({
          x2: pointer.x,
          y2: pointer.y,
        });

        // Calculate angle for arrowhead
        const angle = Math.atan2(pointer.y - startY, pointer.x - startX) * 180 / Math.PI;

        // Position arrowhead at end of line
        arrowHead.set({
          left: pointer.x - startX,
          top: pointer.y - startY,
          angle: angle + 90, // +90 to point in direction of line
        });

        // Update group
        currentShape.addWithUpdate();
      } else if (activeShape === 'polygon') {
        // Update polygon radius based on distance from start point
        const radius = Math.sqrt(
          Math.pow(pointer.x - startX, 2) + Math.pow(pointer.y - startY, 2)
        );

        // Recalculate polygon points with new radius
        const points: { x: number; y: number }[] = [];
        for (let i = 0; i < polygonSides; i++) {
          const angle = (i * 2 * Math.PI) / polygonSides - Math.PI / 2;
          points.push({
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
          });
        }

        currentShape.set({ points });
      }

      canvas.renderAll();
    };

    const handleMouseUp = () => {
      if (!isDrawing || !currentShape || activeTool !== 'shape') return;

      isDrawing = false;

      // Re-enable selection
      canvas.selection = true;

      // Set final properties
      currentShape.set({
        id: `shape-${Date.now()}`,
        name: `${activeShape} ${Date.now()}`,
        opacity: 1,
        selectable: true,
        evented: true,
      });

      canvas.setActiveObject(currentShape);
      canvas.renderAll();
      currentShape = null;
    };

    // Attach event listeners
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvas, activeTool, activeShape, toolColor, strokeWidth, isPanning, polygonSides]);

  // Handle text tool
  useEffect(() => {
    if (!canvas || typeof window.fabric === 'undefined') return;
    if (activeTool !== 'text') return;

    const fabric = window.fabric;

    // Disable drawing mode for text tool
    canvas.isDrawingMode = false;
    canvas.selection = true;

    const handleMouseDown = (opt: any) => {
      if (activeTool !== 'text' || isPanning) return;

      // Check if clicking on an existing text object for editing
      const target = canvas.getActiveObject();
      if (target && target.type === 'i-text') {
        // Already on a text object, let Fabric handle editing
        return;
      }

      // Get click position
      const pointer = canvas.getPointer(opt.e);

      // Create text shadow object if enabled
      const shadow = textShadowEnabled ? {
        color: textShadowColor,
        blur: textShadowBlur,
        offsetX: textShadowOffsetX,
        offsetY: textShadowOffsetY,
      } : null;

      // Create new IText object (editable text)
      const text = new fabric.IText('Text', {
        left: pointer.x,
        top: pointer.y,
        fontFamily: textFontFamily,
        fontSize: textFontSize,
        fill: toolColor,
        textAlign: textAlignment,
        shadow: shadow,
        id: `text-${Date.now()}`,
        name: 'Text layer',
      });

      // Add to canvas
      canvas.add(text);
      canvas.setActiveObject(text);

      // Enter editing mode immediately
      text.enterEditing();
      text.selectAll();

      canvas.renderAll();
    };

    canvas.on('mouse:down', handleMouseDown);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
    };
  }, [canvas, activeTool, toolColor, isPanning, textFontFamily, textFontSize, textAlignment, textShadowEnabled, textShadowColor, textShadowBlur, textShadowOffsetX, textShadowOffsetY]);

  // Handle brush, eraser, and pencil tools
  useEffect(() => {
    if (!canvas || typeof window.fabric === 'undefined') return;

    const fabric = window.fabric;

    // Enable/disable drawing mode based on active tool
    if (activeTool === 'brush' || activeTool === 'eraser' || activeTool === 'pencil') {
      canvas.isDrawingMode = true;

      // For brush tool, use CircleBrush for soft/hard edge control
      if (activeTool === 'brush' && fabric.CircleBrush) {
        canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
      }
      // For pencil tool, use PencilBrush for hard edges
      else if (activeTool === 'pencil' && fabric.PencilBrush) {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      }

      // Configure the brush
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = strokeWidth;

        if (activeTool === 'brush') {
          // Regular brush with selected color, opacity, and hardness
          // Convert hex color to rgba with opacity
          const r = parseInt(toolColor.slice(1, 3), 16);
          const g = parseInt(toolColor.slice(3, 5), 16);
          const b = parseInt(toolColor.slice(5, 7), 16);
          canvas.freeDrawingBrush.color = `rgba(${r}, ${g}, ${b}, ${brushOpacity})`;

          // Apply hardness: 100 = hard (no blur), 0 = soft (maximum blur)
          // Shadow blur creates the soft edge effect
          const maxBlur = strokeWidth * 0.5; // Max blur is half the stroke width
          const blurAmount = maxBlur * ((100 - brushHardness) / 100);

          if (canvas.freeDrawingBrush.shadow) {
            canvas.freeDrawingBrush.shadow.blur = blurAmount;
          }
        } else if (activeTool === 'pencil') {
          // Pencil with selected color and opacity (always hard edge)
          const r = parseInt(toolColor.slice(1, 3), 16);
          const g = parseInt(toolColor.slice(3, 5), 16);
          const b = parseInt(toolColor.slice(5, 7), 16);
          canvas.freeDrawingBrush.color = `rgba(${r}, ${g}, ${b}, ${brushOpacity})`;
        } else if (activeTool === 'eraser') {
          // Eraser mode - use destination-out blend mode
          canvas.freeDrawingBrush.color = 'rgba(0,0,0,1)';
          // Set globalCompositeOperation for eraser effect
          const ctx = canvas.getContext();
          if (ctx) {
            canvas.freeDrawingBrush.globalCompositeOperation = 'destination-out';
          }
        }
      }

      // Track when drawing path is created to add to history
      const handlePathCreated = (e: any) => {
        // Reset composite operation after drawing
        if (canvas.freeDrawingBrush && activeTool === 'eraser') {
          canvas.freeDrawingBrush.globalCompositeOperation = 'source-over';
        }

        // Add name and id to path for layer management
        if (e.path) {
          e.path.set({
            id: `path-${Date.now()}`,
            name: activeTool === 'brush' ? `Brush stroke` : activeTool === 'pencil' ? `Pencil stroke` : `Eraser stroke`,
          });
        }
      };

      canvas.on('path:created', handlePathCreated);

      return () => {
        canvas.off('path:created', handlePathCreated);
      };
    } else {
      // Disable drawing mode for other tools
      canvas.isDrawingMode = false;
      return undefined;
    }
  }, [canvas, activeTool, toolColor, strokeWidth, brushOpacity, brushHardness]);

  // Handle crop tool
  useEffect(() => {
    if (!canvas || typeof window.fabric === 'undefined') return;

    if (activeTool !== 'crop') {
      // Clean up any existing crop rectangle when tool changes
      const cropRect = canvas.getObjects().find((obj: any) => obj.id === 'crop-rectangle');
      if (cropRect) {
        canvas.remove(cropRect);
        canvas.renderAll();
      }
      canvas.selection = true;
      return;
    }

    const fabric = window.fabric;

    // Disable selection and drawing mode
    canvas.isDrawingMode = false;
    canvas.selection = false;

    let cropRect: any = null;
    let isDrawingCrop = false;
    let startX = 0;
    let startY = 0;

    const handleMouseDown = (opt: any) => {
      if (activeTool !== 'crop' || isPanning) return;

      const pointer = canvas.getPointer(opt.e);
      isDrawingCrop = true;
      startX = pointer.x;
      startY = pointer.y;

      // Remove existing crop rectangle if any
      const existingCrop = canvas.getObjects().find((obj: any) => obj.id === 'crop-rectangle');
      if (existingCrop) {
        canvas.remove(existingCrop);
      }

      // Create crop rectangle overlay with semi-transparent dark overlay
      cropRect = new fabric.Rect({
        left: startX,
        top: startY,
        width: 0,
        height: 0,
        fill: 'transparent',
        stroke: '#3b82f6',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        opacity: 1,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        lockRotation: true,
        id: 'crop-rectangle',
        name: 'Crop Area',
      });

      canvas.add(cropRect);
      canvas.setActiveObject(cropRect);
      canvas.renderAll();
    };

    const handleMouseMove = (opt: any) => {
      if (!isDrawingCrop || !cropRect || activeTool !== 'crop') return;

      const pointer = canvas.getPointer(opt.e);

      let width = pointer.x - startX;
      let height = pointer.y - startY;

      // Apply aspect ratio constraint if needed
      if (cropAspectRatio !== 'free') {
        const ratios: { [key: string]: number } = {
          '1:1': 1,
          '16:9': 16 / 9,
          '9:16': 9 / 16,
          '4:3': 4 / 3,
          '3:2': 3 / 2,
        };

        const targetRatio = ratios[cropAspectRatio];
        if (targetRatio) {
          const absWidth = Math.abs(width);
          const absHeight = Math.abs(height);

          if (absWidth / absHeight > targetRatio) {
            // Width is too large, adjust it
            width = absHeight * targetRatio * Math.sign(width);
          } else {
            // Height is too large, adjust it
            height = absWidth / targetRatio * Math.sign(height);
          }
        }
      }

      // Handle negative dimensions
      if (width < 0) {
        cropRect.set({ left: startX + width });
      } else {
        cropRect.set({ left: startX });
      }

      if (height < 0) {
        cropRect.set({ top: startY + height });
      } else {
        cropRect.set({ top: startY });
      }

      cropRect.set({
        width: Math.abs(width),
        height: Math.abs(height),
      });

      canvas.renderAll();
    };

    const handleMouseUp = () => {
      isDrawingCrop = false;

      // Make the crop rectangle adjustable after drawing
      if (cropRect) {
        cropRect.set({
          selectable: true,
          hasControls: true,
          hasBorders: true,
        });
        canvas.setActiveObject(cropRect);
        canvas.renderAll();
      }
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvas, activeTool, isPanning, cropAspectRatio]);

  // Handle crop apply with Enter key and cancel with Escape
  useEffect(() => {
    if (!canvas || activeTool !== 'crop') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cancel crop with Escape
      if (e.key === 'Escape') {
        e.preventDefault();
        const cropRect = canvas.getObjects().find((obj: any) => obj.id === 'crop-rectangle');
        if (cropRect) {
          canvas.remove(cropRect);
          canvas.renderAll();
        }
        return;
      }

      // Apply crop with Enter
      if (e.key === 'Enter') {
        e.preventDefault();

        // Find the crop rectangle
        const cropRect = canvas.getObjects().find((obj: any) => obj.id === 'crop-rectangle');
        if (!cropRect) return;

        // Get crop bounds
        const cropLeft = cropRect.left || 0;
        const cropTop = cropRect.top || 0;
        const cropWidth = cropRect.width || 0;
        const cropHeight = cropRect.height || 0;

        if (cropWidth === 0 || cropHeight === 0) return;

        // Get all objects except the crop rectangle
        const objectsToCrop = canvas.getObjects().filter((obj: any) => obj.id !== 'crop-rectangle');

        // Remove objects that are completely outside the crop area
        objectsToCrop.forEach((obj: any) => {
          const objBounds = obj.getBoundingRect();

          // Check if object intersects with crop area
          const intersects = !(
            objBounds.left + objBounds.width < cropLeft ||
            objBounds.left > cropLeft + cropWidth ||
            objBounds.top + objBounds.height < cropTop ||
            objBounds.top > cropTop + cropHeight
          );

          if (!intersects) {
            // Object is outside crop area, remove it
            canvas.remove(obj);
          } else {
            // Adjust object position relative to new canvas origin
            obj.set({
              left: (obj.left || 0) - cropLeft,
              top: (obj.top || 0) - cropTop,
            });
            obj.setCoords();
          }
        });

        // Remove the crop rectangle
        canvas.remove(cropRect);

        // Update canvas dimensions to match crop
        canvas.setWidth(cropWidth);
        canvas.setHeight(cropHeight);

        // Reset viewport transform
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

        canvas.renderAll();

        // Add to history
        addToHistory(JSON.stringify(canvas.toJSON()));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas, activeTool, addToHistory]);

  // Handle gradient drawing
  useEffect(() => {
    if (!canvas || typeof window.fabric === 'undefined' || activeTool !== 'gradient') return;

    const fabric = window.fabric;
    let isDrawing = false;
    let gradientRect: any = null;
    let startX = 0;
    let startY = 0;

    // Disable selection when gradient tool is active
    canvas.selection = false;
    canvas.forEachObject((obj: any) => {
      obj.selectable = false;
    });

    const handleMouseDown = (opt: any) => {
      if (isPanning) return;

      const pointer = canvas.getPointer(opt.e);
      isDrawing = true;
      startX = pointer.x;
      startY = pointer.y;
    };

    const handleMouseMove = (opt: any) => {
      if (!isDrawing) return;

      const pointer = canvas.getPointer(opt.e);
      const endX = pointer.x;
      const endY = pointer.y;

      // Remove previous gradient preview
      if (gradientRect) {
        canvas.remove(gradientRect);
      }

      // Create gradient
      let gradient;
      if (gradientType === 'linear') {
        gradient = new fabric.Gradient({
          type: 'linear',
          coords: {
            x1: 0,
            y1: 0,
            x2: endX - startX,
            y2: endY - startY,
          },
          colorStops: [
            { offset: 0, color: gradientStartColor },
            { offset: 1, color: gradientEndColor },
          ],
        });
      } else {
        // Radial gradient
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        gradient = new fabric.Gradient({
          type: 'radial',
          coords: {
            x1: (endX - startX) / 2,
            y1: (endY - startY) / 2,
            x2: (endX - startX) / 2,
            y2: (endY - startY) / 2,
            r1: 0,
            r2: radius,
          },
          colorStops: [
            { offset: 0, color: gradientStartColor },
            { offset: 1, color: gradientEndColor },
          ],
        });
      }

      // Create rectangle with gradient
      gradientRect = new fabric.Rect({
        left: Math.min(startX, endX),
        top: Math.min(startY, endY),
        width: Math.abs(endX - startX),
        height: Math.abs(endY - startY),
        fill: gradient,
        selectable: true,
        hasControls: true,
      });

      canvas.add(gradientRect);
      canvas.renderAll();
    };

    const handleMouseUp = () => {
      if (!isDrawing) return;
      isDrawing = false;

      if (gradientRect && gradientRect.width > 5 && gradientRect.height > 5) {
        // Add to history
        setTimeout(() => {
          const canvasJSON = JSON.stringify(canvas.toJSON());
          addToHistory(canvasJSON);
        }, 100);
      } else if (gradientRect) {
        // Remove if too small
        canvas.remove(gradientRect);
      }

      gradientRect = null;
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);

      // Re-enable selection when leaving gradient tool
      canvas.selection = true;
      canvas.forEachObject((obj: any) => {
        obj.selectable = true;
      });
    };
  }, [canvas, activeTool, isPanning, gradientType, gradientStartColor, gradientEndColor, addToHistory]);

  return (
    <>
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center"
        style={{
          background:
            'repeating-conic-gradient(#f0f0f0 0% 25%, transparent 0% 50%) 50% / 20px 20px',
        }}
      >
        <div className="shadow-2xl">
          <canvas ref={canvasRef} />
        </div>
      </div>
      <RotationIndicator
        visible={rotationIndicator.visible}
        angle={rotationIndicator.angle}
        x={rotationIndicator.x}
        y={rotationIndicator.y}
      />
    </>
  );
}
