'use client';

import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { FabricCanvas } from '@/components/canvas/fabric-canvas';
import { CanvasToolbar } from '@/components/canvas/canvas-toolbar';
import { BreakpointToolbar } from '@/components/canvas/breakpoint-toolbar';
import { ComponentCreator } from '@/components/canvas/component-creator';
import { GenerationModal } from '@/components/generation/generation-modal';
import { LayersPanel } from '@/components/layers/layers-panel';
import { HistoryPanel } from '@/components/history/history-panel';
import { PropertiesPanel } from '@/components/properties/properties-panel';
import { AdjustmentsPanel } from '@/components/adjustments/adjustments-panel';
import { ComponentLibraryPanel } from '@/components/components/component-library-panel';
import { DesignTokensPanel } from '@/components/tokens/design-tokens-panel';
import { ResizeHandle } from '@/components/ui/resize-handle';
import { KeyboardShortcutsModal } from '@/components/keyboard-shortcuts-modal';
import { ExportModal } from '@/components/export/export-modal';
import { CodeExportModal } from '@/components/export/code-export-modal';
import { EditMenuButton } from '@/components/menu/edit-menu';
import { useCanvasStore } from '@/store/canvas-store';
import { addSampleContent } from '@/lib/canvas/demo-utils';
import Script from 'next/script';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

// Text Tool Options Component
function TextToolOptions() {
  const toolColor = useCanvasStore((state) => state.toolColor);
  const setToolColor = useCanvasStore((state) => state.setToolColor);
  const textFontFamily = useCanvasStore((state) => state.textFontFamily);
  const setTextFontFamily = useCanvasStore((state) => state.setTextFontFamily);
  const textFontSize = useCanvasStore((state) => state.textFontSize);
  const setTextFontSize = useCanvasStore((state) => state.setTextFontSize);
  const textAlignment = useCanvasStore((state) => state.textAlignment);
  const setTextAlignment = useCanvasStore((state) => state.setTextAlignment);
  const textShadowEnabled = useCanvasStore((state) => state.textShadowEnabled);
  const setTextShadowEnabled = useCanvasStore((state) => state.setTextShadowEnabled);
  const textShadowColor = useCanvasStore((state) => state.textShadowColor);
  const setTextShadowColor = useCanvasStore((state) => state.setTextShadowColor);
  const textShadowBlur = useCanvasStore((state) => state.textShadowBlur);
  const setTextShadowBlur = useCanvasStore((state) => state.setTextShadowBlur);
  const textShadowOffsetX = useCanvasStore((state) => state.textShadowOffsetX);
  const setTextShadowOffsetX = useCanvasStore((state) => state.setTextShadowOffsetX);
  const textShadowOffsetY = useCanvasStore((state) => state.textShadowOffsetY);
  const setTextShadowOffsetY = useCanvasStore((state) => state.setTextShadowOffsetY);

  const fonts = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
    'Comic Sans MS',
    'Impact',
    'Trebuchet MS',
  ];

  return (
    <div className="space-y-4">
      {/* Font Family */}
      <div>
        <label className="text-xs font-medium text-foreground mb-2 block">
          Font Family
        </label>
        <select
          value={textFontFamily}
          onChange={(e) => setTextFontFamily(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {fonts.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="text-xs font-medium text-foreground mb-2 block">
          Font Size: {textFontSize}px
        </label>
        <input
          type="range"
          min="8"
          max="120"
          value={textFontSize}
          onChange={(e) => setTextFontSize(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Small</span>
          <span>Large</span>
        </div>
      </div>

      {/* Text Color */}
      <div>
        <label className="text-xs font-medium text-foreground mb-2 block">
          Text Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={toolColor}
            onChange={(e) => setToolColor(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={toolColor}
            onChange={(e) => setToolColor(e.target.value)}
            className="w-24 px-2 text-xs bg-background border border-border rounded"
          />
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="text-xs font-medium text-foreground mb-2 block">
          Text Alignment
        </label>
        <div className="flex gap-1">
          <button
            onClick={() => setTextAlignment('left')}
            className={`flex-1 p-2 rounded border ${
              textAlignment === 'left'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:bg-accent'
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={() => setTextAlignment('center')}
            className={`flex-1 p-2 rounded border ${
              textAlignment === 'center'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:bg-accent'
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={() => setTextAlignment('right')}
            className={`flex-1 p-2 rounded border ${
              textAlignment === 'right'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:bg-accent'
            }`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4 mx-auto" />
          </button>
        </div>
      </div>

      {/* Text Shadow */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-foreground">
            Text Shadow
          </label>
          <input
            type="checkbox"
            checked={textShadowEnabled}
            onChange={(e) => setTextShadowEnabled(e.target.checked)}
            className="rounded"
          />
        </div>

        {textShadowEnabled && (
          <div className="space-y-3 pl-2 border-l-2 border-border">
            <div className="flex gap-2">
              <input
                type="color"
                value={textShadowColor}
                onChange={(e) => setTextShadowColor(e.target.value)}
                className="w-12 h-8 rounded cursor-pointer"
              />
              <input
                type="text"
                value={textShadowColor}
                onChange={(e) => setTextShadowColor(e.target.value)}
                className="flex-1 px-2 text-xs bg-background border border-border rounded"
                placeholder="Color"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Blur: {textShadowBlur}px
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={textShadowBlur}
                onChange={(e) => setTextShadowBlur(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Offset X: {textShadowOffsetX}px
              </label>
              <input
                type="range"
                min="-20"
                max="20"
                value={textShadowOffsetX}
                onChange={(e) => setTextShadowOffsetX(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Offset Y: {textShadowOffsetY}px
              </label>
              <input
                type="range"
                min="-20"
                max="20"
                value={textShadowOffsetY}
                onChange={(e) => setTextShadowOffsetY(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        Click on canvas to add text. Click existing text to edit.
      </div>
    </div>
  );
}

// Crop Tool Options Component
function CropToolOptions() {
  const cropAspectRatio = useCanvasStore((state) => state.cropAspectRatio);
  const setCropAspectRatio = useCanvasStore((state) => state.setCropAspectRatio);

  const aspectRatios = [
    { label: 'Free', value: 'free' },
    { label: '1:1 (Square)', value: '1:1' },
    { label: '16:9 (Widescreen)', value: '16:9' },
    { label: '9:16 (Portrait)', value: '9:16' },
    { label: '4:3 (Standard)', value: '4:3' },
    { label: '3:2 (Photo)', value: '3:2' },
  ];

  return (
    <div className="space-y-4">
      {/* Aspect Ratio Selector */}
      <div>
        <label className="text-xs font-medium text-foreground mb-2 block">
          Aspect Ratio
        </label>
        <select
          value={cropAspectRatio}
          onChange={(e) => setCropAspectRatio(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {aspectRatios.map((ratio) => (
            <option key={ratio.value} value={ratio.value}>
              {ratio.label}
            </option>
          ))}
        </select>
      </div>

      <div className="text-xs text-muted-foreground space-y-2">
        <p>• Click and drag to define crop area</p>
        <p>• Adjust handles to resize</p>
        <p>• Press <span className="font-semibold text-foreground">Enter</span> to apply crop</p>
        <p>• Press <span className="font-semibold text-foreground">Esc</span> to cancel</p>
      </div>
    </div>
  );
}

function GradientToolOptions() {
  const gradientType = useCanvasStore((state) => state.gradientType);
  const setGradientType = useCanvasStore((state) => state.setGradientType);
  const gradientStartColor = useCanvasStore((state) => state.gradientStartColor);
  const setGradientStartColor = useCanvasStore((state) => state.setGradientStartColor);
  const gradientEndColor = useCanvasStore((state) => state.gradientEndColor);
  const setGradientEndColor = useCanvasStore((state) => state.setGradientEndColor);

  return (
    <div className="space-y-4">
      {/* Gradient Type */}
      <div>
        <label className="text-xs font-medium text-foreground mb-2 block">
          Gradient Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setGradientType('linear')}
            className={`p-2 text-xs rounded border transition-colors ${
              gradientType === 'linear'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:bg-accent'
            }`}
          >
            Linear
          </button>
          <button
            onClick={() => setGradientType('radial')}
            className={`p-2 text-xs rounded border transition-colors ${
              gradientType === 'radial'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:bg-accent'
            }`}
          >
            Radial
          </button>
        </div>
      </div>

      {/* Start Color */}
      <div>
        <label className="text-xs font-medium text-foreground mb-2 block">
          Start Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={gradientStartColor}
            onChange={(e) => setGradientStartColor(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={gradientStartColor}
            onChange={(e) => setGradientStartColor(e.target.value)}
            className="w-24 px-2 text-xs bg-background border border-border rounded"
          />
        </div>
      </div>

      {/* End Color */}
      <div>
        <label className="text-xs font-medium text-foreground mb-2 block">
          End Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={gradientEndColor}
            onChange={(e) => setGradientEndColor(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={gradientEndColor}
            onChange={(e) => setGradientEndColor(e.target.value)}
            className="w-24 px-2 text-xs bg-background border border-border rounded"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="text-xs text-muted-foreground space-y-2">
        <p>• Click and drag to draw gradient</p>
        <p>• <span className="font-semibold text-foreground">Linear:</span> Drag direction sets gradient angle</p>
        <p>• <span className="font-semibold text-foreground">Radial:</span> Drag distance sets gradient radius</p>
      </div>
    </div>
  );
}

function SelectionToolOptions() {
  const selectionType = useCanvasStore((state) => state.selectionType);
  const setSelectionType = useCanvasStore((state) => state.setSelectionType);

  return (
    <div className="space-y-4">
      {/* Selection Type */}
      <div>
        <label className="text-xs font-medium text-foreground mb-2 block">
          Selection Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSelectionType('rectangle')}
            className={`p-2 text-xs rounded border transition-colors ${
              selectionType === 'rectangle'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:bg-accent'
            }`}
          >
            ⬜ Rectangle
          </button>
          <button
            onClick={() => setSelectionType('ellipse')}
            className={`p-2 text-xs rounded border transition-colors ${
              selectionType === 'ellipse'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:bg-accent'
            }`}
          >
            ⭕ Ellipse
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-xs text-muted-foreground space-y-2">
        <p>• Click and drag to create selection</p>
        <p>• Selection marquee will appear (marching ants)</p>
        <p>• Press <span className="font-semibold text-foreground">Delete</span> to delete selected area</p>
        <p>• Press <span className="font-semibold text-foreground">Esc</span> to clear selection</p>
      </div>
    </div>
  );
}

export default function EditorPage() {
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(280);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(320);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const [isComponentCreatorOpen, setIsComponentCreatorOpen] = useState(false);
  const [selectedElementForComponent, setSelectedElementForComponent] = useState<string>();
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCodeExportModalOpen, setIsCodeExportModalOpen] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState<'layers' | 'history' | 'properties' | 'adjustments' | 'components' | 'tokens'>('layers');
  const canvas = useCanvasStore((state) => state.canvas);
  const activeTool = useCanvasStore((state) => state.activeTool);
  const setActiveTool = useCanvasStore((state) => state.setActiveTool);
  const activeShape = useCanvasStore((state) => state.activeShape);
  const setActiveShape = useCanvasStore((state) => state.setActiveShape);
  const toolColor = useCanvasStore((state) => state.toolColor);
  const setToolColor = useCanvasStore((state) => state.setToolColor);
  const strokeWidth = useCanvasStore((state) => state.strokeWidth);
  const setStrokeWidth = useCanvasStore((state) => state.setStrokeWidth);
  const brushOpacity = useCanvasStore((state) => state.brushOpacity);
  const setBrushOpacity = useCanvasStore((state) => state.setBrushOpacity);
  const brushHardness = useCanvasStore((state) => state.brushHardness);
  const setBrushHardness = useCanvasStore((state) => state.setBrushHardness);
  const polygonSides = useCanvasStore((state) => state.polygonSides);
  const setPolygonSides = useCanvasStore((state) => state.setPolygonSides);
  const addToHistory = useCanvasStore((state) => state.addToHistory);
  const undo = useCanvasStore((state) => state.undo);
  const redo = useCanvasStore((state) => state.redo);
  const canUndo = useCanvasStore((state) => state.canUndo);
  const canRedo = useCanvasStore((state) => state.canRedo);
  const saveProject = useCanvasStore((state) => state.saveProject);
  const loadProject = useCanvasStore((state) => state.loadProject);
  const isSaving = useCanvasStore((state) => state.isSaving);
  const projectName = useCanvasStore((state) => state.projectName);
  const setCanvasDimensions = useCanvasStore((state) => state.setCanvasDimensions);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input/textarea
      const isTyping = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName);

      // '?' key for keyboard shortcuts modal
      if (e.key === '?' && !isTyping) {
        e.preventDefault();
        setIsShortcutsModalOpen(true);
      }

      // Cmd+S / Ctrl+S for save
      if ((e.metaKey || e.ctrlKey) && e.key === 's' && !isTyping) {
        e.preventDefault();
        saveProject();
      }

      // Cmd+E / Ctrl+E for export image
      if ((e.metaKey || e.ctrlKey) && e.key === 'e' && !e.shiftKey && !isTyping) {
        e.preventDefault();
        setIsExportModalOpen(true);
      }

      // Cmd+Shift+E / Ctrl+Shift+E for export code
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'e' && !isTyping) {
        e.preventDefault();
        setIsCodeExportModalOpen(true);
      }

      // Cmd+K / Ctrl+K for create component
      if ((e.metaKey || e.ctrlKey) && e.key === 'k' && !isTyping) {
        e.preventDefault();
        if (canvas) {
          const activeObject = canvas.getActiveObject();
          if (activeObject) {
            setSelectedElementForComponent(activeObject.id || 'selected');
            setIsComponentCreatorOpen(true);
          }
        }
      }

      // Cmd+G / Ctrl+G for AI generation
      if ((e.metaKey || e.ctrlKey) && e.key === 'g' && !isTyping) {
        e.preventDefault();
        setIsGenerationModalOpen(true);
      }

      // Cmd+Z / Ctrl+Z for undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey && !isTyping) {
        e.preventDefault();
        if (canUndo) {
          undo();
        }
      }

      // Cmd+Shift+Z / Ctrl+Shift+Z for redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey && !isTyping) {
        e.preventDefault();
        if (canRedo) {
          redo();
        }
      }

      // Cmd+T / Ctrl+T for transform mode (select active object)
      if ((e.metaKey || e.ctrlKey) && e.key === 't' && !isTyping) {
        e.preventDefault();
        // Switch to select tool and ensure active object is selected
        setActiveTool('select');
        // If there's an active object, make sure it's selected for transformation
        if (canvas) {
          const activeObject = canvas.getActiveObject();
          if (activeObject) {
            canvas.setActiveObject(activeObject);
            canvas.renderAll();
          }
        }
      }

      // Tool shortcuts (single keys, no modifier)
      if (!isTyping && !(e.metaKey || e.ctrlKey || e.altKey)) {
        // V - Move/Select tool
        if (e.key === 'v' || e.key === 'V') {
          e.preventDefault();
          setActiveTool('select');
        }
        // B - Brush tool
        else if (e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          setActiveTool('brush');
        }
        // E - Eraser tool
        else if (e.key === 'e' || e.key === 'E') {
          e.preventDefault();
          setActiveTool('eraser');
        }
        // P - Pencil tool
        else if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          setActiveTool('pencil');
        }
        // T - Text tool
        else if (e.key === 't' || e.key === 'T') {
          e.preventDefault();
          setActiveTool('text');
        }
        // C - Crop tool
        else if (e.key === 'c' || e.key === 'C') {
          e.preventDefault();
          setActiveTool('crop');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo, setActiveTool, canvas, saveProject]);

  // Load project from URL parameter or set canvas dimensions for new project
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('projectId');
    const width = urlParams.get('width');
    const height = urlParams.get('height');

    if (projectId && canvas) {
      // Load existing project
      loadProject(projectId);
    } else if (width && height && canvas) {
      // Set canvas dimensions for new project
      const w = parseInt(width);
      const h = parseInt(height);
      if (!isNaN(w) && !isNaN(h)) {
        setCanvasDimensions(w, h);
        // Update canvas size
        canvas.setWidth(w);
        canvas.setHeight(h);
        canvas.renderAll();
      }
    }
  }, [canvas, loadProject, setCanvasDimensions]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      // Only auto-save if there's a canvas and we're not already saving
      if (canvas && !isSaving) {
        saveProject();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [canvas, isSaving, saveProject]);

  // Handle resize for left sidebar
  const handleLeftResize = (delta: number) => {
    setLeftSidebarWidth((prev) => {
      const newWidth = prev + delta;
      // Clamp between 200px and 500px
      return Math.min(Math.max(newWidth, 200), 500);
    });
  };

  // Handle resize for right sidebar
  const handleRightResize = (delta: number) => {
    setRightSidebarWidth((prev) => {
      const newWidth = prev - delta; // Subtract because handle is on left side of right panel
      // Clamp between 250px and 600px
      return Math.min(Math.max(newWidth, 250), 600);
    });
  };

  const handleImageGenerated = (imageUrl: string) => {
    // Add the generated image to the canvas
    if (canvas) {
      // @ts-ignore - fabric types
      window.fabric.Image.fromURL(imageUrl, (img: any) => {
        // Scale image to fit canvas if needed
        const maxWidth = 800;
        const maxHeight = 600;
        if (img.width > maxWidth || img.height > maxHeight) {
          const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
          img.scale(scale);
        }

        // Center the image on canvas
        img.set({
          left: canvas.width / 2,
          top: canvas.height / 2,
          originX: 'center',
          originY: 'center',
          id: `image-${Date.now()}`,
          name: 'Generated Image',
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !canvas) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Create a URL for the uploaded file
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;

      // @ts-ignore - fabric types
      window.fabric.Image.fromURL(imageUrl, (img: any) => {
        // Scale image to fit canvas if needed
        const maxWidth = 800;
        const maxHeight = 600;
        if (img.width > maxWidth || img.height > maxHeight) {
          const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
          img.scale(scale);
        }

        // Center the image on canvas
        img.set({
          left: canvas.width / 2,
          top: canvas.height / 2,
          originX: 'center',
          originY: 'center',
          id: `image-${Date.now()}`,
          name: file.name,
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);

    // Reset input so the same file can be uploaded again
    event.target.value = '';
  };

  // Drag and drop handlers
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (!canvas) return;

    const files = Array.from(event.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith('image/'));

    if (!imageFile) {
      alert('Please drop a valid image file');
      return;
    }

    // Create a URL for the dropped file
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;

      // @ts-ignore - fabric types
      window.fabric.Image.fromURL(imageUrl, (img: any) => {
        // Scale image to fit canvas if needed
        const maxWidth = 800;
        const maxHeight = 600;
        if (img.width > maxWidth || img.height > maxHeight) {
          const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
          img.scale(scale);
        }

        // Center the image on canvas
        img.set({
          left: canvas.width / 2,
          top: canvas.height / 2,
          originX: 'center',
          originY: 'center',
          id: `image-${Date.now()}`,
          name: imageFile.name,
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();

        // Add to history
        addToHistory(JSON.stringify(canvas.toJSON()));
      });
    };
    reader.readAsDataURL(imageFile);
  };

  // Handle loading demo content
  const handleLoadDemo = () => {
    if (!canvas) return;
    addSampleContent(canvas);
    addToHistory(JSON.stringify(canvas.toJSON()));
  };

  return (
    <>
      <Script src="/load-fabric.js" strategy="beforeInteractive" />
      <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
        {/* Top Toolbar */}
        <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            PixelForge
          </h1>
          <nav className="flex items-center gap-2 text-sm">
            <button className="px-3 py-1.5 hover:bg-accent rounded">File</button>
            <EditMenuButton />
            <button className="px-3 py-1.5 hover:bg-accent rounded">View</button>
            <button className="px-3 py-1.5 hover:bg-accent rounded">AI</button>
            <button className="px-3 py-1.5 hover:bg-accent rounded">Help</button>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-3 py-1.5 hover:bg-accent rounded"
              title="Export Image (Cmd/Ctrl+E)"
            >
              Export Image
            </button>
            <button
              onClick={() => setIsCodeExportModalOpen(true)}
              className="px-3 py-1.5 hover:bg-accent rounded"
              title="Export to Code (Cmd/Ctrl+Shift+E)"
            >
              Export Code
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{projectName}</span>
          <ThemeToggle />
          <button
            onClick={saveProject}
            disabled={isSaving}
            className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        {!isLeftSidebarCollapsed && (
          <aside
            className="bg-surface flex-shrink-0"
            style={{ width: `${leftSidebarWidth}px` }}
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Tools</h2>
                <button
                  onClick={() => setIsLeftSidebarCollapsed(true)}
                  className="p-1 hover:bg-accent rounded"
                  aria-label="Collapse left panel"
                  title="Collapse panel"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
              </div>
              <div className="p-4 border-b border-border">
                <div className="grid grid-cols-2 gap-2">
                  {/* Tool buttons */}
                  <ToolButton
                    icon="✨"
                    label="Generate"
                    onClick={() => setIsGenerationModalOpen(true)}
                    tooltip="Generate AI image (Cmd/Ctrl+G)"
                  />
                  <ToolButton
                    icon="📁"
                    label="Upload"
                    onClick={() => document.getElementById('image-upload-input')?.click()}
                    tooltip="Upload image from file"
                  />
                <ToolButton
                  icon="👆"
                  label="Select"
                  active={activeTool === 'select'}
                  onClick={() => setActiveTool('select')}
                  tooltip="Select tool (V)"
                />
                <ToolButton
                  icon="✂️"
                  label="Crop"
                  active={activeTool === 'crop'}
                  onClick={() => setActiveTool('crop')}
                  tooltip="Crop tool (C)"
                />
                <ToolButton
                  icon="🖌️"
                  label="Brush"
                  active={activeTool === 'brush'}
                  onClick={() => setActiveTool('brush')}
                  tooltip="Brush tool (B)"
                />
                <ToolButton
                  icon="🧽"
                  label="Eraser"
                  active={activeTool === 'eraser'}
                  onClick={() => setActiveTool('eraser')}
                  tooltip="Eraser tool (E)"
                />
                <ToolButton
                  icon="✏️"
                  label="Pencil"
                  active={activeTool === 'pencil'}
                  onClick={() => setActiveTool('pencil')}
                  tooltip="Pencil tool (P)"
                />
                <ToolButton
                  icon="T"
                  label="Text"
                  active={activeTool === 'text'}
                  onClick={() => setActiveTool('text')}
                  tooltip="Text tool (T)"
                />
                <ToolButton
                  icon="🔲"
                  label="Shape"
                  active={activeTool === 'shape'}
                  onClick={() => setActiveTool('shape')}
                  tooltip="Shape tool (U)"
                />
                <ToolButton
                  icon="🎨"
                  label="Fill"
                  active={activeTool === 'fill'}
                  onClick={() => setActiveTool('fill')}
                  tooltip="Fill tool (G)"
                />
                <ToolButton
                  icon="🌈"
                  label="Gradient"
                  active={activeTool === 'gradient'}
                  onClick={() => setActiveTool('gradient')}
                  tooltip="Gradient tool"
                />
              </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Tool Options
              </h3>

              {activeTool === 'shape' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-foreground mb-2 block">
                      Shape Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setActiveShape('rectangle')}
                        className={`p-2 text-xs rounded border transition-colors ${
                          activeShape === 'rectangle'
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border hover:bg-accent'
                        }`}
                      >
                        Rectangle
                      </button>
                      <button
                        onClick={() => setActiveShape('circle')}
                        className={`p-2 text-xs rounded border transition-colors ${
                          activeShape === 'circle'
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border hover:bg-accent'
                        }`}
                      >
                        Circle
                      </button>
                      <button
                        onClick={() => setActiveShape('polygon')}
                        className={`p-2 text-xs rounded border transition-colors ${
                          activeShape === 'polygon'
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border hover:bg-accent'
                        }`}
                      >
                        Polygon
                      </button>
                      <button
                        onClick={() => setActiveShape('line')}
                        className={`p-2 text-xs rounded border transition-colors ${
                          activeShape === 'line'
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border hover:bg-accent'
                        }`}
                      >
                        Line
                      </button>
                      <button
                        onClick={() => setActiveShape('arrow')}
                        className={`p-2 text-xs rounded border transition-colors ${
                          activeShape === 'arrow'
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border hover:bg-accent'
                        }`}
                      >
                        Arrow
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground mb-2 block">
                      Fill Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={toolColor}
                        onChange={(e) => setToolColor(e.target.value)}
                        className="w-full h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={toolColor}
                        onChange={(e) => setToolColor(e.target.value)}
                        className="w-24 px-2 text-xs bg-background border border-border rounded"
                      />
                    </div>
                  </div>

                  {activeShape === 'polygon' && (
                    <div>
                      <label className="text-xs font-medium text-foreground mb-2 block">
                        Polygon Sides: {polygonSides}
                      </label>
                      <input
                        type="range"
                        min="3"
                        max="12"
                        value={polygonSides}
                        onChange={(e) => setPolygonSides(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Triangle (3)</span>
                        <span>Dodecagon (12)</span>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Click and drag on canvas to draw {activeShape}
                  </div>
                </div>
              ) : activeTool === 'brush' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-foreground mb-2 block">
                      Brush Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={toolColor}
                        onChange={(e) => setToolColor(e.target.value)}
                        className="w-full h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={toolColor}
                        onChange={(e) => setToolColor(e.target.value)}
                        className="w-24 px-2 text-xs bg-background border border-border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground mb-2 flex justify-between">
                      <span>Brush Size</span>
                      <span className="text-muted-foreground">{strokeWidth}px</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={strokeWidth}
                      onChange={(e) => setStrokeWidth(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Thin</span>
                      <span>Thick</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground mb-2 flex justify-between">
                      <span>Opacity</span>
                      <span className="text-muted-foreground">{Math.round(brushOpacity * 100)}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={brushOpacity}
                      onChange={(e) => setBrushOpacity(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Transparent</span>
                      <span>Opaque</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground mb-2 flex justify-between">
                      <span>Hardness</span>
                      <span className="text-muted-foreground">{brushHardness}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={brushHardness}
                      onChange={(e) => setBrushHardness(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Soft Edge</span>
                      <span>Hard Edge</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Click and drag to draw freehand
                  </div>
                </div>
              ) : activeTool === 'eraser' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-foreground mb-2 flex justify-between">
                      <span>Eraser Size</span>
                      <span className="text-muted-foreground">{strokeWidth}px</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={strokeWidth}
                      onChange={(e) => setStrokeWidth(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Small</span>
                      <span>Large</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Click and drag to erase content
                  </div>
                </div>
              ) : activeTool === 'pencil' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-foreground mb-2 block">
                      Pencil Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={toolColor}
                        onChange={(e) => setToolColor(e.target.value)}
                        className="w-full h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={toolColor}
                        onChange={(e) => setToolColor(e.target.value)}
                        className="w-24 px-2 text-xs bg-background border border-border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground mb-2 flex justify-between">
                      <span>Pencil Size</span>
                      <span className="text-muted-foreground">{strokeWidth}px</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={strokeWidth}
                      onChange={(e) => setStrokeWidth(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Fine</span>
                      <span>Thick</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground mb-2 flex justify-between">
                      <span>Opacity</span>
                      <span className="text-muted-foreground">{Math.round(brushOpacity * 100)}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={brushOpacity}
                      onChange={(e) => setBrushOpacity(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Transparent</span>
                      <span>Opaque</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Hard-edged precise lines for pixel art and technical drawing
                  </div>
                </div>
              ) : activeTool === 'text' ? (
                <TextToolOptions />
              ) : activeTool === 'crop' ? (
                <CropToolOptions />
              ) : activeTool === 'gradient' ? (
                <GradientToolOptions />
              ) : activeTool === 'select' ? (
                <SelectionToolOptions />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select a tool to see options
                </p>
              )}
            </div>
          </div>
        </aside>
        )}

        {/* Collapsed Left Sidebar Button */}
        {isLeftSidebarCollapsed && (
          <button
            onClick={() => setIsLeftSidebarCollapsed(false)}
            className="w-8 bg-surface border-r border-border flex items-center justify-center hover:bg-accent flex-shrink-0"
            aria-label="Expand left panel"
            title="Expand panel"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {/* Resize Handle for Left Sidebar */}
        {!isLeftSidebarCollapsed && (
          <ResizeHandle onResize={handleLeftResize} orientation="vertical" />
        )}

        {/* Center Canvas Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Canvas Toolbar */}
          <div className="border-b bg-background">
            <div className="flex items-center justify-between px-4 py-2">
              <CanvasToolbar 
                onExportCode={() => setIsCodeExportModalOpen(true)}
                onLoadDemo={handleLoadDemo}
              />
              <BreakpointToolbar />
            </div>
          </div>

          {/* Canvas */}
          <div
            className={`flex-1 overflow-auto relative ${
              isDragging ? 'ring-4 ring-primary ring-opacity-50 bg-primary/5' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FabricCanvas />
            {isDragging && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/10 backdrop-blur-sm pointer-events-none">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-primary"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-lg font-semibold text-primary">Drop image here</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Release to add to canvas
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="h-8 border-t border-border bg-surface/50 backdrop-blur-sm flex items-center justify-between px-4 text-xs text-muted-foreground flex-shrink-0">
            <div className="flex items-center gap-4">
              <span>1024 × 768 px</span>
              <span>•</span>
              <span>Position: 0, 0</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Layer 1 of 1</span>
            </div>
          </div>
        </main>

        {/* Resize Handle for Right Sidebar */}
        {!isRightSidebarCollapsed && (
          <ResizeHandle onResize={handleRightResize} orientation="vertical" />
        )}

        {/* Right Sidebar - Layers & History & Properties */}
        {!isRightSidebarCollapsed && (
          <aside
            className="bg-surface flex-shrink-0"
            style={{ width: `${rightSidebarWidth}px` }}
          >
            <div className="h-full flex flex-col">
              {/* Tabs Header */}
              <div className="border-b border-border">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveRightTab('layers')}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                        activeRightTab === 'layers'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      Layers
                    </button>
                    <button
                      onClick={() => setActiveRightTab('history')}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                        activeRightTab === 'history'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      History
                    </button>
                    <button
                      onClick={() => setActiveRightTab('properties')}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                        activeRightTab === 'properties'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      Properties
                    </button>
                    <button
                      onClick={() => setActiveRightTab('adjustments')}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                        activeRightTab === 'adjustments'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      Adjustments
                    </button>
                    <button
                      onClick={() => setActiveRightTab('components')}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                        activeRightTab === 'components'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      Components
                    </button>
                    <button
                      onClick={() => setActiveRightTab('tokens')}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                        activeRightTab === 'tokens'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      Tokens
                    </button>
                  </div>
                  <button
                    onClick={() => setIsRightSidebarCollapsed(true)}
                    className="p-1 hover:bg-accent rounded"
                    aria-label="Collapse right panel"
                    title="Collapse panel"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-hidden">
                {activeRightTab === 'layers' && <LayersPanel />}
                {activeRightTab === 'history' && <HistoryPanel />}
                {activeRightTab === 'properties' && <PropertiesPanel />}
                {activeRightTab === 'adjustments' && <AdjustmentsPanel />}
                {activeRightTab === 'components' && <ComponentLibraryPanel />}
                {activeRightTab === 'tokens' && <DesignTokensPanel />}
              </div>
            </div>
          </aside>
        )}

        {/* Collapsed Right Sidebar Button */}
        {isRightSidebarCollapsed && (
          <button
            onClick={() => setIsRightSidebarCollapsed(false)}
            className="w-8 bg-surface border-l border-border flex items-center justify-center hover:bg-accent flex-shrink-0"
            aria-label="Expand right panel"
            title="Expand panel"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
      </div>

      {/* Hidden file input for image upload */}
      <input
        id="image-upload-input"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Generation Modal */}
      <GenerationModal
        open={isGenerationModalOpen}
        onOpenChange={setIsGenerationModalOpen}
        onImageGenerated={handleImageGenerated}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        open={isShortcutsModalOpen}
        onOpenChange={setIsShortcutsModalOpen}
      />

      {/* Export Modal */}
      <ExportModal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        canvas={canvas}
      />

      {/* Code Export Modal */}
      <CodeExportModal
        isOpen={isCodeExportModalOpen}
        onClose={() => setIsCodeExportModalOpen(false)}
      />

      {/* Component Creator Modal */}
      <ComponentCreator
        open={isComponentCreatorOpen}
        onOpenChange={setIsComponentCreatorOpen}
        selectedElementId={selectedElementForComponent}
      />
    </div>
    </>
  );
}

// Helper component for tool buttons
function ToolButton({
  icon,
  label,
  onClick,
  active = false,
  tooltip,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
  active?: boolean;
  tooltip?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`p-3 flex flex-col items-center gap-1 rounded-lg transition-colors group ${
        active
          ? 'bg-primary/20 border-2 border-primary'
          : 'hover:bg-accent border-2 border-transparent'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className={`text-xs ${active ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>
        {label}
      </span>
    </button>
  );
}

