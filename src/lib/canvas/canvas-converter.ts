/**
 * Canvas to WebElement Converter
 * Syncs Fabric.js canvas objects to WebElement tree structure
 */

import { WebElement, Breakpoint } from '@/types';

interface FabricObject {
  type?: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  angle?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  visible?: boolean;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  src?: string;
  shadow?: any;
  _objects?: FabricObject[];
  [key: string]: any;
}

export class CanvasConverter {
  // Currently not using breakpoint parameter
  constructor(_breakpoint?: Breakpoint) {
    // Reserved for future breakpoint-specific conversion
  }
  
  /**
   * Convert Fabric.js canvas to WebElement tree
   */
  convertCanvas(canvas: any): { root: WebElement; elements: Map<string, WebElement> } {
    const elements = new Map<string, WebElement>();
    const fabricObjects = canvas.getObjects();
    
    // Create root frame
    const root: WebElement = {
      id: 'root',
      name: 'Canvas',
      type: 'frame',
      parentId: undefined,
      children: [],
      layout: 'none',
      constraints: {
        horizontal: 'left',
        vertical: 'top',
      },
      x: { default: 0 },
      y: { default: 0 },
      width: { default: canvas.width || 1024 },
      height: { default: canvas.height || 768 },
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      blendMode: 'normal',
      fills: [],
      strokes: [],
      effects: [],
      customProperties: {},
    };
    
    elements.set(root.id, root);
    
    // Convert each Fabric object
    fabricObjects.forEach((obj: FabricObject, index: number) => {
      const element = this.convertObject(obj, 'root', index);
      if (element) {
        elements.set(element.id, element);
        root.children.push(element.id);
      }
    });
    
    return { root, elements };
  }
  
  /**
   * Convert a single Fabric object to WebElement
   */
  private convertObject(obj: FabricObject, parentId: string, index: number): WebElement | null {
    if (!obj.type) return null;
    
    const id = `element-${Date.now()}-${index}`;
    const width = (obj.width || 100) * (obj.scaleX || 1);
    const height = (obj.height || 100) * (obj.scaleY || 1);
    
    // Determine element type
    let elementType: WebElement['type'] = 'frame';
    if (obj.type === 'i-text' || obj.type === 'text') {
      elementType = 'text';
    } else if (obj.type === 'image') {
      elementType = 'image';
    } else if (obj.type === 'rect' || obj.type === 'circle' || obj.type === 'triangle') {
      elementType = 'shape';
    }
    
    const element: WebElement = {
      id,
      name: obj.type || 'Element',
      type: elementType,
      parentId: parentId,
      children: [],
      layout: 'none',
      constraints: {
        horizontal: 'left',
        vertical: 'top',
      },
      x: { default: Math.round(obj.left || 0) },
      y: { default: Math.round(obj.top || 0) },
      width: { default: Math.round(width) },
      height: { default: Math.round(height) },
      rotation: obj.angle || 0,
      opacity: obj.opacity ?? 1,
      visible: obj.visible ?? true,
      locked: false,
      blendMode: 'normal',
      fills: [],
      strokes: [],
      effects: [],
      customProperties: {},
    };
    
    // Fill (background)
    if (obj.fill && typeof obj.fill === 'string') {
      element.fills.push({
        type: 'solid',
        visible: true,
        color: obj.fill,
        opacity: 1,
      });
    }
    
    // Stroke (border)
    if (obj.stroke) {
      element.strokes.push({
        visible: true,
        color: obj.stroke,
        width: obj.strokeWidth || 1,
        opacity: 1,
        position: 'center',
      });
    }
    
    // Shadow effect
    if (obj.shadow) {
      const shadow = obj.shadow;
      element.effects.push({
        type: 'shadow',
        visible: true,
        color: shadow.color || '#000000',
        offsetX: shadow.offsetX || 0,
        offsetY: shadow.offsetY || 0,
        blur: shadow.blur || 0,
        spread: 0,
      });
    }
    
    // Text-specific properties
    if (elementType === 'text' && element.customProperties) {
      element.customProperties.textContent = obj.text || '';
      element.customProperties.fontFamily = obj.fontFamily || 'Arial';
      element.customProperties.fontSize = obj.fontSize || 16;
      element.customProperties.textColor = obj.fill || '#000000';
    }
    
    // Image-specific properties
    if (elementType === 'image' && obj.src && element.customProperties) {
      element.customProperties.imageUrl = obj.src;
    }
    
    // Group/container objects
    if (obj._objects && Array.isArray(obj._objects)) {
      element.layout = 'flex';
      element.autoLayout = {
        direction: 'row',
        gap: 0,
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        wrap: 'nowrap',
      };
      
      obj._objects.forEach((childObj: FabricObject, childIndex: number) => {
        const child = this.convertObject(childObj, id, childIndex);
        if (child) {
          element.children.push(child.id);
        }
      });
    }
    
    return element;
  }
  
  /**
   * Detect auto-layout properties from element positions
   */
  detectAutoLayout(elements: WebElement[]): {
    direction: 'row' | 'column';
    gap: number;
    alignItems: string;
    justifyContent: string;
  } | null {
    if (elements.length < 2) return null;
    
    // Get positions
    const positions = elements.map(el => ({
      left: el.customProperties?.left || 0,
      top: el.customProperties?.top || 0,
      width: typeof el.width === 'number' ? el.width : el.width.default,
      height: typeof el.height === 'number' ? el.height : el.height.default,
    }));
    
    // Check if aligned horizontally (same top)
    const topValues = positions.map(p => p.top);
    const horizontallyAligned = Math.max(...topValues) - Math.min(...topValues) < 10;
    
    // Check if aligned vertically (same left)
    const leftValues = positions.map(p => p.left);
    const verticallyAligned = Math.max(...leftValues) - Math.min(...leftValues) < 10;
    
    if (horizontallyAligned) {
      // Calculate average gap
      const sortedByLeft = [...positions].sort((a, b) => a.left - b.left);
      const gaps: number[] = [];
      for (let i = 1; i < sortedByLeft.length; i++) {
        const prev = sortedByLeft[i - 1];
        const curr = sortedByLeft[i];
        gaps.push(curr.left - (prev.left + prev.width));
      }
      const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
      
      return {
        direction: 'row',
        gap: Math.round(Math.max(0, avgGap)),
        alignItems: 'center',
        justifyContent: 'flex-start',
      };
    } else if (verticallyAligned) {
      // Calculate average gap
      const sortedByTop = [...positions].sort((a, b) => a.top - b.top);
      const gaps: number[] = [];
      for (let i = 1; i < sortedByTop.length; i++) {
        const prev = sortedByTop[i - 1];
        const curr = sortedByTop[i];
        gaps.push(curr.top - (prev.top + prev.height));
      }
      const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
      
      return {
        direction: 'column',
        gap: Math.round(Math.max(0, avgGap)),
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      };
    }
    
    return null;
  }
}
