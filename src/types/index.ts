/**
 * Global type definitions for PixelForge
 */

// Canvas Types
export interface CanvasLayer {
  id: string;
  name: string;
  type: "image" | "text" | "shape" | "group";
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: string;
  data: any; // Fabric.js object data
  thumbnail?: string;
}

export interface CanvasState {
  layers: CanvasLayer[];
  width: number;
  height: number;
  background: string;
}

// Generation Types
export interface GenerationParams {
  prompt: string;
  negativePrompt?: string;
  model: "flux-pro" | "flux-dev" | "sdxl" | "sd3";
  style?: string;
  aspectRatio: string;
  steps?: number;
  guidanceScale?: number;
  seed?: number;
  batchSize?: number;
}

export interface GenerationResult {
  id: string;
  imageUrl: string;
  prompt: string;
  model: string;
  parameters: GenerationParams;
  width: number;
  height: number;
  generationTime: number;
  cost: number;
}

// AI Operation Types
export type AiOperationType =
  | "upscale"
  | "background-removal"
  | "inpaint"
  | "outpaint"
  | "face-restore"
  | "style-transfer"
  | "auto-enhance";

export interface AiOperationParams {
  type: AiOperationType;
  inputUrl: string;
  options?: Record<string, any>;
}

export interface AiOperationResult {
  id: string;
  outputUrl: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress?: number;
  error?: string;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  thumbnailUrl?: string;
  canvasData: CanvasState;
  width: number;
  height: number;
  createdAt: Date;
  updatedAt: Date;
  lastEditedAt: Date;
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  subscriptionTier: "free" | "pro" | "enterprise";
  apiUsageLimit: number;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  defaultExportFormat: "png" | "jpeg" | "webp";
  autoSaveInterval: number;
  canvasBackground: "transparent" | "white" | "black";
}

// Template Types
export interface Template {
  id: string;
  name: string;
  description?: string;
  category: string;
  thumbnailUrl: string;
  canvasData: CanvasState;
  width: number;
  height: number;
  tags: string[];
  isFeatured: boolean;
}

// Export Types
export interface ExportOptions {
  format: "png" | "jpeg" | "webp" | "svg" | "avif";
  quality?: number;
  width?: number;
  height?: number;
  includeMetadata?: boolean;
  transparentBackground?: boolean;
  layerMode: "merged" | "current" | "all";
}

// Usage Tracking Types
export interface UsageStats {
  totalGenerations: number;
  totalProjects: number;
  storageUsed: number;
  creditsUsed: number;
  creditsRemaining: number;
}

// Web Design & Component System Types

export type Breakpoint = "mobile" | "tablet" | "desktop" | "wide";

export const BREAKPOINT_WIDTHS: Record<Breakpoint, number> = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

export interface ResponsiveProperty<T = any> {
  default: T;
  mobile?: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
}

export type ConstraintH = "left" | "right" | "leftright" | "center" | "scale";
export type ConstraintV = "top" | "bottom" | "topbottom" | "center" | "scale";

export interface Constraints {
  horizontal: ConstraintH;
  vertical: ConstraintV;
}

export type LayoutType = "none" | "flex" | "grid";
export type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";
export type FlexAlign = "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
export type FlexJustify = "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";

export interface AutoLayoutProps {
  direction: FlexDirection;
  gap: number;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  alignItems: FlexAlign;
  justifyContent: FlexJustify;
  wrap: FlexWrap;
}

export interface WebElement {
  id: string;
  type: "frame" | "text" | "shape" | "image" | "component" | "instance";
  name: string;
  
  // Layout
  layout: LayoutType;
  autoLayout?: AutoLayoutProps;
  constraints: Constraints;
  
  // Position & Size (responsive)
  x: ResponsiveProperty<number>;
  y: ResponsiveProperty<number>;
  width: ResponsiveProperty<number>;
  height: ResponsiveProperty<number>;
  rotation: number;
  
  // Visual Properties
  opacity: number;
  visible: boolean;
  locked: boolean;
  blendMode: string;
  
  // Component-specific
  componentId?: string; // If this is an instance
  overrides?: Record<string, any>;
  variantId?: string;
  
  // Hierarchy
  parentId?: string;
  children: string[];
  
  // Styling
  fills: Fill[];
  strokes: Stroke[];
  effects: Effect[];
  
  // Text-specific
  textContent?: string;
  textStyleId?: string;
  
  // Custom properties
  customProperties?: Record<string, any>;
}

export interface Fill {
  type: "solid" | "gradient" | "image";
  color?: string;
  gradient?: Gradient;
  imageUrl?: string;
  opacity: number;
  visible: boolean;
}

export interface Stroke {
  color: string;
  width: number;
  opacity: number;
  visible: boolean;
  position: "inside" | "outside" | "center";
}

export interface Effect {
  type: "shadow" | "blur" | "inner-shadow";
  color?: string;
  offsetX?: number;
  offsetY?: number;
  blur: number;
  spread?: number;
  visible: boolean;
}

export interface Gradient {
  type: "linear" | "radial";
  stops: GradientStop[];
  angle?: number; // For linear
}

export interface GradientStop {
  position: number; // 0-1
  color: string;
}

export interface ComponentDefinition {
  id: string;
  name: string;
  description?: string;
  category: string;
  
  // The root element ID that defines this component
  rootElementId: string;
  
  // Variants (e.g., button: default, hover, pressed)
  variants: ComponentVariant[];
  
  // Properties that can be customized per instance
  properties: ComponentProperty[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
  tags: string[];
}

export interface ComponentVariant {
  id: string;
  name: string;
  properties: Record<string, any>;
}

export interface ComponentProperty {
  name: string;
  type: "text" | "boolean" | "number" | "color" | "image" | "instance";
  defaultValue: any;
  options?: any[]; // For select-type properties
}

export interface ComponentInstance {
  id: string;
  componentId: string;
  variantId?: string;
  overrides: Record<string, any>; // Property name -> value
}

// Design Tokens

export interface ColorToken {
  id: string;
  name: string;
  value: string; // hex, rgb, hsl
  category?: string;
}

export interface TextStyleToken {
  id: string;
  name: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  category?: string;
}

export interface EffectToken {
  id: string;
  name: string;
  effect: Effect;
  category?: string;
}

export interface DesignTokens {
  colors: ColorToken[];
  textStyles: TextStyleToken[];
  effects: EffectToken[];
  spacing: Record<string, number>;
  borderRadius: Record<string, number>;
}

// Export Types (Extended)

export interface HTMLExportOptions {
  format: "html" | "react" | "vue";
  includeCSS: boolean;
  cssFramework?: "tailwind" | "custom" | "none";
  minify: boolean;
  useTokens: boolean; // Use design tokens/CSS variables
  exportBreakpoints: boolean;
  semanticHTML: boolean; // Use semantic tags (section, article, etc.)
}

export interface ExportResult {
  html?: string;
  css?: string;
  assets: { filename: string; content: string | Blob }[];
  tokens?: string; // JSON or CSS variables
}

// Canvas Store Extension Types

export interface ComponentRegistry {
  components: Map<string, ComponentDefinition>;
  instances: Map<string, ComponentInstance>;
}

export interface CanvasHistory {
  past: CanvasSnapshot[];
  future: CanvasSnapshot[];
  current: CanvasSnapshot;
}

export interface CanvasSnapshot {
  elements: Map<string, WebElement>;
  timestamp: number;
  description?: string;
}
