/**
 * CSS Generator
 * Based on patterns from GrapesJS and Penpot
 * Generates responsive CSS from WebElement tree
 */

import { WebElement, Breakpoint, BREAKPOINT_WIDTHS, ResponsiveProperty } from '@/types';
import prettier from 'prettier';

export interface CSSGeneratorOptions {
  format?: 'inline' | 'classes' | 'css-modules'; // CSS format
  onlyMatched?: boolean; // Export only used styles
  minify?: boolean; // Minify output
  indent?: number; // Indentation spaces
  prettify?: boolean; // Format with Prettier
  includeResponsive?: boolean; // Include media queries
  mobileFirst?: boolean; // Mobile-first media queries
}

interface CSSRule {
  selector: string;
  properties: Record<string, string>;
  mediaQuery?: string;
}

export class CSSGenerator {
  private options: Required<CSSGeneratorOptions>;
  private elements: Map<string, WebElement>;
  private rules: CSSRule[];
  
  constructor(options: CSSGeneratorOptions = {}) {
    this.options = {
      format: options.format ?? 'classes',
      onlyMatched: options.onlyMatched ?? true,
      minify: options.minify ?? false,
      indent: options.indent ?? 2,
      prettify: options.prettify ?? true,
      includeResponsive: options.includeResponsive ?? true,
      mobileFirst: options.mobileFirst ?? true,
    };
    this.elements = new Map();
    this.rules = [];
  }
  
  /**
   * Generate CSS from WebElement tree
   */
  async generate(rootElement: WebElement, elements: Map<string, WebElement>): Promise<string> {
    this.elements = elements;
    this.rules = [];
    
    // Generate rules for all elements
    this.generateRulesForElement(rootElement);
    
    // Build CSS output
    const css = this.rulesToCSS();
    
    if (this.options.prettify && !this.options.minify) {
      return await prettier.format(css, {
        parser: 'css',
        printWidth: 80,
        tabWidth: this.options.indent,
      });
    }
    
    return css;
  }
  
  /**
   * Generate CSS rules for an element and its children
   */
  private generateRulesForElement(element: WebElement): void {
    const selector = this.getSelector(element);
    
    // Base styles
    const baseProperties = this.generateBaseStyles(element);
    if (Object.keys(baseProperties).length > 0) {
      this.rules.push({
        selector,
        properties: baseProperties,
      });
    }
    
    // Responsive styles
    if (this.options.includeResponsive) {
      this.generateResponsiveRules(element, selector);
    }
    
    // Recursively process children
    element.children.forEach(childId => {
      const child = this.elements.get(childId);
      if (child) {
        this.generateRulesForElement(child);
      }
    });
  }
  
  /**
   * Generate base (non-responsive) styles
   */
  private generateBaseStyles(element: WebElement): Record<string, string> {
    const props: Record<string, string> = {};
    
    // Layout
    if (element.layout !== 'none') {
      props.display = element.layout === 'flex' ? 'flex' : 'grid';
      
      if (element.autoLayout && element.layout === 'flex') {
        props['flex-direction'] = element.autoLayout.direction;
        props['gap'] = `${element.autoLayout.gap}px`;
        props['align-items'] = element.autoLayout.alignItems;
        props['justify-content'] = element.autoLayout.justifyContent;
        props['flex-wrap'] = element.autoLayout.wrap;
        
        const p = element.autoLayout.padding;
        props.padding = `${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`;
      }
    }
    
    // Position & Size (use default values from responsive properties)
    const width = this.getResponsiveValue(element.width);
    const height = this.getResponsiveValue(element.height);
    
    if (width !== 'auto') props.width = `${width}px`;
    if (height !== 'auto') props.height = `${height}px`;
    
    // Opacity
    if (element.opacity !== 1) {
      props.opacity = element.opacity.toString();
    }
    
    // Visibility
    if (!element.visible) {
      props.display = 'none';
    }
    
    // Fills (background)
    if (element.fills && element.fills.length > 0) {
      const fill = element.fills[0];
      if (fill.visible) {
        if (fill.type === 'solid' && fill.color) {
          props['background-color'] = fill.color;
        } else if (fill.type === 'gradient' && fill.gradient) {
          props['background-image'] = this.generateGradientCSS(fill.gradient);
        } else if (fill.type === 'image' && fill.imageUrl) {
          props['background-image'] = `url("${fill.imageUrl}")`;
          props['background-size'] = 'cover';
          props['background-position'] = 'center';
        }
      }
    }
    
    // Strokes (borders)
    if (element.strokes && element.strokes.length > 0) {
      const stroke = element.strokes[0];
      if (stroke.visible) {
        props.border = `${stroke.width}px solid ${stroke.color}`;
      }
    }
    
    // Effects (shadows, blur)
    if (element.effects && element.effects.length > 0) {
      const shadows = element.effects
        .filter(e => e.visible && (e.type === 'shadow' || e.type === 'inner-shadow'))
        .map(e => this.generateShadowCSS(e));
      
      if (shadows.length > 0) {
        props['box-shadow'] = shadows.join(', ');
      }
      
      const blur = element.effects.find(e => e.visible && e.type === 'blur');
      if (blur) {
        props.filter = `blur(${blur.blur}px)`;
      }
    }
    
    // Text styles
    if (element.type === 'text' && element.textStyleId) {
      // Text styles would be applied from design tokens
      props.color = element.customProperties?.textColor || '#000';
      if (element.customProperties?.fontSize) {
        props['font-size'] = `${element.customProperties.fontSize}px`;
      }
      if (element.customProperties?.fontFamily) {
        props['font-family'] = element.customProperties.fontFamily;
      }
    }
    
    // Rotation
    if (element.rotation !== 0) {
      props.transform = `rotate(${element.rotation}deg)`;
    }
    
    return props;
  }
  
  /**
   * Generate responsive CSS rules
   */
  private generateResponsiveRules(element: WebElement, selector: string): void {
    const breakpoints: Breakpoint[] = ['mobile', 'tablet', 'desktop', 'wide'];
    
    breakpoints.forEach(breakpoint => {
      const properties: Record<string, string> = {};
      
      // Check if element has responsive overrides for this breakpoint
      if (element.width && typeof element.width === 'object' && element.width[breakpoint]) {
        properties.width = `${element.width[breakpoint]}px`;
      }
      
      if (element.height && typeof element.height === 'object' && element.height[breakpoint]) {
        properties.height = `${element.height[breakpoint]}px`;
      }
      
      // Add rule if there are responsive properties
      if (Object.keys(properties).length > 0) {
        const mediaQuery = this.getMediaQuery(breakpoint);
        this.rules.push({
          selector,
          properties,
          mediaQuery,
        });
      }
    });
  }
  
  /**
   * Get media query for breakpoint
   */
  private getMediaQuery(breakpoint: Breakpoint): string {
    const width = BREAKPOINT_WIDTHS[breakpoint];
    
    if (this.options.mobileFirst) {
      return `(min-width: ${width}px)`;
    } else {
      return `(max-width: ${width - 1}px)`;
    }
  }
  
  /**
   * Get selector for element
   */
  private getSelector(element: WebElement): string {
    const className = `element-${element.type}`;
    return `.${className}`;
  }
  
  /**
   * Convert rules to CSS string
   */
  private rulesToCSS(): string {
    const grouped = this.groupRulesByMediaQuery();
    const output: string[] = [];
    
    // Base styles first
    if (grouped.base && grouped.base.length > 0) {
      output.push(this.formatRules(grouped.base));
    }
    
    // Media queries (sorted by breakpoint)
    const mediaQueries = Object.keys(grouped)
      .filter(key => key !== 'base')
      .sort((a, b) => this.compareMediaQueries(a, b));
    
    mediaQueries.forEach(mediaQuery => {
      const rules = grouped[mediaQuery];
      const formattedRules = this.formatRules(rules, 1);
      output.push(`@media ${mediaQuery} {\n${formattedRules}\n}`);
    });
    
    return output.join('\n\n');
  }
  
  /**
   * Group rules by media query
   */
  private groupRulesByMediaQuery(): Record<string, CSSRule[]> {
    return this.rules.reduce((acc, rule) => {
      const key = rule.mediaQuery || 'base';
      if (!acc[key]) acc[key] = [];
      acc[key].push(rule);
      return acc;
    }, {} as Record<string, CSSRule[]>);
  }
  
  /**
   * Format rules as CSS
   */
  private formatRules(rules: CSSRule[], indentLevel = 0): string {
    const indent = '  '.repeat(indentLevel);
    
    return rules.map(rule => {
      const props = Object.entries(rule.properties)
        .map(([key, value]) => `${indent}  ${key}: ${value};`)
        .join('\n');
      
      return `${indent}${rule.selector} {\n${props}\n${indent}}`;
    }).join('\n');
  }
  
  /**
   * Compare media queries for sorting (mobile-first order)
   */
  private compareMediaQueries(a: string, b: string): number {
    const getWidth = (mq: string) => {
      const match = mq.match(/(\d+)px/);
      return match ? parseInt(match[1]) : 0;
    };
    
    return getWidth(a) - getWidth(b);
  }
  
  /**
   * Get value from responsive property
   */
  private getResponsiveValue(prop: ResponsiveProperty<number> | number): number | 'auto' {
    if (typeof prop === 'number') return prop;
    return prop.default;
  }
  
  /**
   * Generate CSS gradient string
   */
  private generateGradientCSS(gradient: any): string {
    const stops = gradient.stops
      .map((stop: any) => `${stop.color} ${stop.position * 100}%`)
      .join(', ');
    
    if (gradient.type === 'linear') {
      const angle = gradient.angle || 0;
      return `linear-gradient(${angle}deg, ${stops})`;
    } else {
      return `radial-gradient(circle, ${stops})`;
    }
  }
  
  /**
   * Generate CSS box-shadow
   */
  private generateShadowCSS(effect: any): string {
    const { offsetX = 0, offsetY = 0, blur = 0, spread = 0, color = '#000' } = effect;
    const inset = effect.type === 'inner-shadow' ? 'inset ' : '';
    return `${inset}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`;
  }
}
