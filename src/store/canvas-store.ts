import { create } from 'zustand';
import { 
  Breakpoint, 
  ComponentDefinition, 
  ComponentInstance, 
  DesignTokens,
  WebElement 
} from '@/types';

export type Tool = 'select' | 'shape' | 'text' | 'brush' | 'eraser' | 'crop' | 'fill' | 'pencil' | 'gradient' | 'frame' | 'component';
export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'line' | 'arrow' | 'polygon';
export type SelectionType = 'rectangle' | 'ellipse' | 'lasso';
export type GradientType = 'linear' | 'radial';

export interface CurvePoint {
  x: number;
  y: number;
}

interface CanvasState {
  // Canvas instance
  canvas: any | null; // fabric.Canvas type
  setCanvas: (canvas: any | null) => void;

  // Tool state
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  activeShape: ShapeType;
  setActiveShape: (shape: ShapeType) => void;
  toolColor: string;
  setToolColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  brushOpacity: number;
  setBrushOpacity: (opacity: number) => void;
  brushHardness: number; // 0-100, 0 = soft, 100 = hard
  setBrushHardness: (hardness: number) => void;

  // Text formatting state
  textFontFamily: string;
  setTextFontFamily: (fontFamily: string) => void;
  textFontSize: number;
  setTextFontSize: (fontSize: number) => void;
  textAlignment: 'left' | 'center' | 'right';
  setTextAlignment: (alignment: 'left' | 'center' | 'right') => void;
  textShadowEnabled: boolean;
  setTextShadowEnabled: (enabled: boolean) => void;
  textShadowColor: string;
  setTextShadowColor: (color: string) => void;
  textShadowBlur: number;
  setTextShadowBlur: (blur: number) => void;
  textShadowOffsetX: number;
  setTextShadowOffsetX: (offset: number) => void;
  textShadowOffsetY: number;
  setTextShadowOffsetY: (offset: number) => void;

  // Crop state
  cropAspectRatio: string; // 'free', '1:1', '16:9', '9:16', '4:3', '3:2'
  setCropAspectRatio: (ratio: string) => void;

  // Polygon state
  polygonSides: number; // 3-12 sides
  setPolygonSides: (sides: number) => void;

  // Gradient state
  gradientType: GradientType;
  setGradientType: (type: GradientType) => void;
  gradientStartColor: string;
  setGradientStartColor: (color: string) => void;
  gradientEndColor: string;
  setGradientEndColor: (color: string) => void;

  // Selection state
  selectionType: SelectionType;
  setSelectionType: (type: SelectionType) => void;

  // Image adjustment state
  brightness: number; // -100 to +100
  setBrightness: (value: number) => void;
  contrast: number; // -100 to +100
  setContrast: (value: number) => void;
  saturation: number; // -100 to +100
  setSaturation: (value: number) => void;
  hueRotation: number; // 0-360 degrees
  setHueRotation: (value: number) => void;
  temperature: number; // -100 to +100 (cool to warm)
  setTemperature: (value: number) => void;
  exposure: number; // -2 to +2 EV stops
  setExposure: (value: number) => void;
  shadows: number; // -100 to +100
  setShadows: (value: number) => void;
  highlights: number; // -100 to +100
  setHighlights: (value: number) => void;
  blur: number; // 0 to 20 (Gaussian blur radius)
  setBlur: (value: number) => void;
  sharpen: number; // 0 to 100 (sharpening amount)
  setSharpen: (value: number) => void;
  vignette: number; // 0 to 100 (vignette amount)
  setVignette: (value: number) => void;
  filterStrength: number; // 0 to 100 (global filter intensity)
  setFilterStrength: (value: number) => void;
  showBeforeAfter: boolean; // Toggle between original and edited
  setShowBeforeAfter: (show: boolean) => void;
  showComparisonSlider: boolean; // Show interactive before/after slider
  setShowComparisonSlider: (show: boolean) => void;
  // Curves adjustment
  curvesRgb: CurvePoint[]; // RGB curve points
  curvesRed: CurvePoint[]; // Red channel curve points
  curvesGreen: CurvePoint[]; // Green channel curve points
  curvesBlue: CurvePoint[]; // Blue channel curve points
  setCurvesRgb: (points: CurvePoint[]) => void;
  setCurvesRed: (points: CurvePoint[]) => void;
  setCurvesGreen: (points: CurvePoint[]) => void;
  setCurvesBlue: (points: CurvePoint[]) => void;
  applyPreset: (preset: 'vintage' | 'bw' | 'none') => void;
  resetAdjustments: () => void;

  // Zoom state
  zoom: number;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitToScreen: () => void;

  // Pan state
  isPanning: boolean;
  setIsPanning: (isPanning: boolean) => void;

  // Canvas dimensions
  canvasWidth: number;
  canvasHeight: number;
  setCanvasDimensions: (width: number, height: number) => void;

  // History
  history: string[];
  historyIndex: number;
  addToHistory: (state: string) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Project management
  currentProjectId: string | null;
  projectName: string;
  isProjectSaved: boolean;
  isSaving: boolean;
  lastSavedAt: Date | null;
  setCurrentProjectId: (id: string | null) => void;
  setProjectName: (name: string) => void;
  setIsProjectSaved: (saved: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  setLastSavedAt: (date: Date | null) => void;
  saveProject: () => Promise<void>;
  loadProject: (projectId: string) => Promise<void>;

  // Web Design Features
  // Breakpoint management
  currentBreakpoint: Breakpoint;
  setCurrentBreakpoint: (breakpoint: Breakpoint) => void;
  
  // Component system
  components: Map<string, ComponentDefinition>;
  componentInstances: Map<string, ComponentInstance>;
  createComponent: (name: string, category: string, rootElementId: string) => string;
  deleteComponent: (componentId: string) => void;
  createInstance: (componentId: string) => string;
  updateInstanceOverride: (instanceId: string, propertyName: string, value: any) => void;
  
  // Web elements (for new web-based canvas)
  webElements: Map<string, WebElement>;
  addWebElement: (element: WebElement) => void;
  updateWebElement: (id: string, updates: Partial<WebElement>) => void;
  deleteWebElement: (id: string) => void;
  
  // Design tokens
  designTokens: DesignTokens;
  addColorToken: (name: string, value: string, category?: string) => void;
  addTextStyleToken: (name: string, style: any) => void;
  updateDesignTokens: (tokens: Partial<DesignTokens>) => void;
  
  // Auto-layout
  isAutoLayoutEnabled: boolean;
  setAutoLayoutEnabled: (enabled: boolean) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  // Initial state
  canvas: null,
  zoom: 1,
  isPanning: false,
  canvasWidth: 1024,
  canvasHeight: 768,
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,
  activeTool: 'select',
  activeShape: 'rectangle',
  toolColor: '#3b82f6', // blue-500
  strokeWidth: 2,
  brushOpacity: 1.0,
  brushHardness: 50, // Default to medium hardness
  textFontFamily: 'Arial',
  textFontSize: 32,
  textAlignment: 'left',
  textShadowEnabled: false,
  textShadowColor: '#000000',
  textShadowBlur: 4,
  textShadowOffsetX: 2,
  textShadowOffsetY: 2,
  cropAspectRatio: 'free',
  polygonSides: 6, // Default to hexagon
  gradientType: 'linear',
  gradientStartColor: '#3b82f6', // blue-500
  gradientEndColor: '#8b5cf6', // purple-500
  selectionType: 'rectangle',
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hueRotation: 0,
  temperature: 0,
  exposure: 0,
  shadows: 0,
  highlights: 0,
  blur: 0,
  sharpen: 0,
  vignette: 0,
  filterStrength: 100, // Default to full strength
  showBeforeAfter: false,
  showComparisonSlider: false,
  // Default curves: linear (no adjustment)
  curvesRgb: [{ x: 0, y: 0 }, { x: 256, y: 256 }],
  curvesRed: [{ x: 0, y: 0 }, { x: 256, y: 256 }],
  curvesGreen: [{ x: 0, y: 0 }, { x: 256, y: 256 }],
  curvesBlue: [{ x: 0, y: 0 }, { x: 256, y: 256 }],

  // Canvas setter
  setCanvas: (canvas) => set({ canvas }),

  // Tool setters
  setActiveTool: (activeTool) => set({ activeTool }),
  setActiveShape: (activeShape) => set({ activeShape }),
  setToolColor: (toolColor) => set({ toolColor }),
  setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
  setBrushOpacity: (brushOpacity) => set({ brushOpacity }),
  setBrushHardness: (brushHardness) => set({ brushHardness }),
  setTextFontFamily: (textFontFamily) => set({ textFontFamily }),
  setTextFontSize: (textFontSize) => set({ textFontSize }),
  setTextAlignment: (textAlignment) => set({ textAlignment }),
  setTextShadowEnabled: (textShadowEnabled) => set({ textShadowEnabled }),
  setTextShadowColor: (textShadowColor) => set({ textShadowColor }),
  setTextShadowBlur: (textShadowBlur) => set({ textShadowBlur }),
  setTextShadowOffsetX: (textShadowOffsetX) => set({ textShadowOffsetX }),
  setTextShadowOffsetY: (textShadowOffsetY) => set({ textShadowOffsetY }),
  setCropAspectRatio: (cropAspectRatio) => set({ cropAspectRatio }),
  setPolygonSides: (polygonSides) => set({ polygonSides }),
  setGradientType: (gradientType) => set({ gradientType }),
  setGradientStartColor: (gradientStartColor) => set({ gradientStartColor }),
  setGradientEndColor: (gradientEndColor) => set({ gradientEndColor }),
  setSelectionType: (selectionType) => set({ selectionType }),
  setBrightness: (brightness) => set({ brightness }),
  setContrast: (contrast) => set({ contrast }),
  setSaturation: (saturation) => set({ saturation }),
  setHueRotation: (hueRotation) => set({ hueRotation }),
  setTemperature: (temperature) => set({ temperature }),
  setExposure: (exposure) => set({ exposure }),
  setShadows: (shadows) => set({ shadows }),
  setHighlights: (highlights) => set({ highlights }),
  setBlur: (blur) => set({ blur }),
  setSharpen: (sharpen) => set({ sharpen }),
  setVignette: (vignette) => set({ vignette }),
  setFilterStrength: (filterStrength) => set({ filterStrength }),
  setShowBeforeAfter: (showBeforeAfter) => set({ showBeforeAfter }),
  setShowComparisonSlider: (showComparisonSlider) => set({ showComparisonSlider }),
  setCurvesRgb: (curvesRgb) => set({ curvesRgb }),
  setCurvesRed: (curvesRed) => set({ curvesRed }),
  setCurvesGreen: (curvesGreen) => set({ curvesGreen }),
  setCurvesBlue: (curvesBlue) => set({ curvesBlue }),
  applyPreset: (preset) => {
    if (preset === 'vintage') {
      set({
        brightness: -10,
        contrast: 15,
        saturation: -20,
        temperature: 40,
        vignette: 30,
        sharpen: 0,
        blur: 0,
        hueRotation: 10,
      });
    } else if (preset === 'bw') {
      set({
        saturation: -100,
        contrast: 20,
        brightness: 0,
        temperature: 0,
        vignette: 0,
        sharpen: 10,
        blur: 0,
        hueRotation: 0,
      });
    } else {
      // Reset to defaults
      set({
        brightness: 0,
        contrast: 0,
        saturation: 0,
        hueRotation: 0,
        temperature: 0,
        blur: 0,
        sharpen: 0,
        vignette: 0,
      });
    }
  },
  resetAdjustments: () => set({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hueRotation: 0,
    temperature: 0,
    exposure: 0,
    shadows: 0,
    highlights: 0,
    blur: 0,
    sharpen: 0,
    vignette: 0,
    filterStrength: 100,
    showBeforeAfter: false,
    showComparisonSlider: false,
    curvesRgb: [{ x: 0, y: 0 }, { x: 256, y: 256 }],
    curvesRed: [{ x: 0, y: 0 }, { x: 256, y: 256 }],
    curvesGreen: [{ x: 0, y: 0 }, { x: 256, y: 256 }],
    curvesBlue: [{ x: 0, y: 0 }, { x: 256, y: 256 }],
  }),

  // Zoom functions
  setZoom: (zoom) => {
    const { canvas } = get();
    if (!canvas) return;

    const center = canvas.getCenter();
    canvas.zoomToPoint(
      { x: center.left, y: center.top },
      zoom
    );
    canvas.renderAll();
    set({ zoom });
  },

  zoomIn: () => {
    const { zoom, setZoom } = get();
    const newZoom = Math.min(zoom * 1.2, 5); // Max 500%
    setZoom(newZoom);
  },

  zoomOut: () => {
    const { zoom, setZoom } = get();
    const newZoom = Math.max(zoom / 1.2, 0.1); // Min 10%
    setZoom(newZoom);
  },

  fitToScreen: () => {
    const { canvas, canvasWidth, canvasHeight } = get();
    if (!canvas) return;

    const container = canvas.getElement().parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth - 64; // Padding
    const containerHeight = container.clientHeight - 64;

    const scaleX = containerWidth / canvasWidth;
    const scaleY = containerHeight / canvasHeight;
    const newZoom = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 100%

    // Center the canvas
    const center = canvas.getCenter();
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]); // Reset transform
    canvas.zoomToPoint(
      { x: center.left, y: center.top },
      newZoom
    );
    canvas.renderAll();

    set({ zoom: newZoom });
  },

  // Pan functions
  setIsPanning: (isPanning) => set({ isPanning }),

  // Canvas dimensions
  setCanvasDimensions: (width, height) =>
    set({ canvasWidth: width, canvasHeight: height }),

  // History functions
  addToHistory: (state) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);

    // Keep max 50 history states
    if (newHistory.length > 50) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      canUndo: true,
      canRedo: false,
    });
  },

  undo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    const state = history[newIndex];

    canvas.loadFromJSON(state, () => {
      canvas.renderAll();
    });

    set({
      historyIndex: newIndex,
      canUndo: newIndex > 0,
      canRedo: true,
    });
  },

  redo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    const state = history[newIndex];

    canvas.loadFromJSON(state, () => {
      canvas.renderAll();
    });

    set({
      historyIndex: newIndex,
      canUndo: true,
      canRedo: newIndex < history.length - 1,
    });
  },

  clearHistory: () => {
    const { canvas } = get();
    if (!canvas) return;

    // Save current canvas state as the only history item
    const currentState = JSON.stringify(canvas.toJSON());

    set({
      history: [currentState],
      historyIndex: 0,
      canUndo: false,
      canRedo: false,
    });
  },

  // Project management
  currentProjectId: null,
  projectName: 'Untitled Project',
  isProjectSaved: true,
  isSaving: false,
  lastSavedAt: null,

  setCurrentProjectId: (id) => set({ currentProjectId: id }),
  setProjectName: (name) => set({ projectName: name, isProjectSaved: false }),
  setIsProjectSaved: (saved) => set({ isProjectSaved: saved }),
  setIsSaving: (saving) => set({ isSaving: saving }),
  setLastSavedAt: (date) => set({ lastSavedAt: date }),

  saveProject: async () => {
    const { canvas, currentProjectId, projectName, setIsSaving, setIsProjectSaved, setLastSavedAt, setCurrentProjectId } = get();

    if (!canvas) {
      console.error('No canvas to save');
      return;
    }

    setIsSaving(true);

    try {
      const canvasData = JSON.stringify(canvas.toJSON());

      // Generate thumbnail from canvas
      const thumbnailUrl = canvas.toDataURL({
        format: 'png',
        quality: 0.5,
        multiplier: 0.2, // 20% of original size for thumbnail
      });

      if (currentProjectId) {
        // Update existing project
        const response = await fetch(`/api/projects/${currentProjectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: projectName,
            canvasData,
            thumbnailUrl,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update project');
        }
      } else {
        // Create new project
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: projectName,
            canvasData,
            width: canvas.width,
            height: canvas.height,
            thumbnailUrl,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create project');
        }

        const data = await response.json();
        if (data.success && data.project) {
          setCurrentProjectId(data.project.id);
        }
      }

      setIsProjectSaved(true);
      setLastSavedAt(new Date());
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    } finally {
      setIsSaving(false);
    }
  },

  loadProject: async (projectId: string) => {
    const { canvas, setCurrentProjectId, setProjectName, setIsProjectSaved, setLastSavedAt, addToHistory } = get();

    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to load project');
      }

      const data = await response.json();
      if (!data.success || !data.project) {
        throw new Error('Invalid project data');
      }

      const project = data.project;

      if (canvas) {
        // Load canvas data
        const canvasData = JSON.parse(project.canvasData);
        canvas.loadFromJSON(canvasData, () => {
          canvas.renderAll();
          addToHistory(project.canvasData);
        });
      }

      setCurrentProjectId(project.id);
      setProjectName(project.name);
      setIsProjectSaved(true);
      setLastSavedAt(new Date(project.lastEditedAt));
    } catch (error) {
      console.error('Error loading project:', error);
      alert('Failed to load project. Please try again.');
    }
  },

  // Web Design Features Implementation
  currentBreakpoint: 'desktop',
  setCurrentBreakpoint: (breakpoint) => set({ currentBreakpoint: breakpoint }),

  components: new Map(),
  componentInstances: new Map(),
  
  createComponent: (name, category, rootElementId) => {
    const id = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const component: ComponentDefinition = {
      id,
      name,
      description: '',
      category,
      rootElementId,
      variants: [{
        id: 'default',
        name: 'Default',
        properties: {},
      }],
      properties: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    };
    
    set((state) => {
      const newComponents = new Map(state.components);
      newComponents.set(id, component);
      return { components: newComponents };
    });
    
    return id;
  },

  deleteComponent: (componentId) => {
    set((state) => {
      const newComponents = new Map(state.components);
      newComponents.delete(componentId);
      
      // Also delete all instances
      const newInstances = new Map(state.componentInstances);
      Array.from(newInstances.entries()).forEach(([instId, inst]) => {
        if (inst.componentId === componentId) {
          newInstances.delete(instId);
        }
      });
      
      return { components: newComponents, componentInstances: newInstances };
    });
  },

  createInstance: (componentId) => {
    const id = `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const instance: ComponentInstance = {
      id,
      componentId,
      overrides: {},
    };
    
    set((state) => {
      const newInstances = new Map(state.componentInstances);
      newInstances.set(id, instance);
      return { componentInstances: newInstances };
    });
    
    return id;
  },

  updateInstanceOverride: (instanceId, propertyName, value) => {
    set((state) => {
      const newInstances = new Map(state.componentInstances);
      const instance = newInstances.get(instanceId);
      if (instance) {
        instance.overrides[propertyName] = value;
        newInstances.set(instanceId, instance);
      }
      return { componentInstances: newInstances };
    });
  },

  webElements: new Map(),
  
  addWebElement: (element) => {
    set((state) => {
      const newElements = new Map(state.webElements);
      newElements.set(element.id, element);
      return { webElements: newElements };
    });
  },

  updateWebElement: (id, updates) => {
    set((state) => {
      const newElements = new Map(state.webElements);
      const element = newElements.get(id);
      if (element) {
        newElements.set(id, { ...element, ...updates });
      }
      return { webElements: newElements };
    });
  },

  deleteWebElement: (id) => {
    set((state) => {
      const newElements = new Map(state.webElements);
      newElements.delete(id);
      return { webElements: newElements };
    });
  },

  designTokens: {
    colors: [],
    textStyles: [],
    effects: [],
    spacing: {},
    borderRadius: {},
  },

  addColorToken: (name, value, category) => {
    const id = `color_${Date.now()}`;
    set((state) => ({
      designTokens: {
        ...state.designTokens,
        colors: [...state.designTokens.colors, { id, name, value, category }],
      },
    }));
  },

  addTextStyleToken: (name, style) => {
    const id = `text_${Date.now()}`;
    set((state) => ({
      designTokens: {
        ...state.designTokens,
        textStyles: [...state.designTokens.textStyles, { id, name, ...style }],
      },
    }));
  },

  updateDesignTokens: (tokens) => {
    set((state) => ({
      designTokens: { ...state.designTokens, ...tokens },
    }));
  },

  isAutoLayoutEnabled: false,
  setAutoLayoutEnabled: (enabled) => set({ isAutoLayoutEnabled: enabled }),
}));

