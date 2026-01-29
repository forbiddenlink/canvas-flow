/**
 * HTML Generator
 * Based on patterns from GrapesJS and Penpot
 * Generates semantic HTML from WebElement tree
 */

import { WebElement } from '@/types';
import prettier from 'prettier';

export interface HTMLGeneratorOptions {
  cleanId?: boolean; // Remove auto-generated IDs
  semantic?: boolean; // Use semantic HTML tags
  withDataAttrs?: boolean; // Include data attributes
  indent?: number; // Indentation spaces (default: 2)
  prettify?: boolean; // Format with Prettier (default: true)
}

const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 
  'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

const SEMANTIC_MAP: Record<string, string> = {
  'header-frame': 'header',
  'footer-frame': 'footer',
  'nav-frame': 'nav',
  'main-frame': 'main',
  'section-frame': 'section',
  'article-frame': 'article',
  'aside-frame': 'aside',
};

export class HTMLGenerator {
  private options: Required<HTMLGeneratorOptions>;
  private elements: Map<string, WebElement>;
  
  constructor(options: HTMLGeneratorOptions = {}) {
    this.options = {
      cleanId: options.cleanId ?? true,
      semantic: options.semantic ?? true,
      withDataAttrs: options.withDataAttrs ?? false,
      indent: options.indent ?? 2,
      prettify: options.prettify ?? true,
    };
    this.elements = new Map();
  }
  
  /**
   * Generate HTML from a tree of WebElements
   */
  async generate(rootElement: WebElement, elements: Map<string, WebElement>): Promise<string> {
    this.elements = elements;
    const html = this.elementToHTML(rootElement, 0);
    
    if (this.options.prettify) {
      return await prettier.format(html, {
        parser: 'html',
        printWidth: 80,
        tabWidth: this.options.indent,
        htmlWhitespaceSensitivity: 'ignore',
      });
    }
    
    return html;
  }
  
  /**
   * Convert a single WebElement to HTML
   */
  private elementToHTML(element: WebElement, level: number): string {
    const indent = '  '.repeat(level);
    const tag = this.getTagName(element);
    const attrs = this.generateAttributes(element);
    const attrString = attrs.length > 0 ? ' ' + attrs.join(' ') : '';
    
    const isVoid = VOID_ELEMENTS.has(tag);
    
    // Handle void elements
    if (isVoid) {
      return `${indent}<${tag}${attrString}/>`;
    }
    
    // Handle text content
    if (element.type === 'text' && element.textContent) {
      return `${indent}<${tag}${attrString}>${this.escapeHTML(element.textContent)}</${tag}>`;
    }
    
    // Handle children
    const children = element.children
      .map(childId => {
        const child = this.elements.get(childId);
        return child ? this.elementToHTML(child, level + 1) : '';
      })
      .filter(Boolean)
      .join('\n');
    
    if (children) {
      return `${indent}<${tag}${attrString}>\n${children}\n${indent}</${tag}>`;
    }
    
    // Empty element
    return `${indent}<${tag}${attrString}></${tag}>`;
  }
  
  /**
   * Determine the appropriate HTML tag for an element
   */
  private getTagName(element: WebElement): string {
    // Use semantic mapping if enabled
    if (this.options.semantic && element.customProperties?.semanticTag) {
      return element.customProperties.semanticTag;
    }
    
    // Map frame types to semantic tags
    if (this.options.semantic && element.type === 'frame') {
      const mapped = SEMANTIC_MAP[element.name.toLowerCase()];
      if (mapped) return mapped;
    }
    
    // Type-based defaults
    switch (element.type) {
      case 'text':
        return 'p';
      case 'image':
        return 'img';
      case 'frame':
        return 'div';
      case 'component':
      case 'instance':
        return 'div';
      default:
        return 'div';
    }
  }
  
  /**
   * Generate HTML attributes for an element
   */
  private generateAttributes(element: WebElement): string[] {
    const attrs: string[] = [];
    
    // ID attribute
    if (!this.options.cleanId || element.customProperties?.persistentId) {
      const id = this.sanitizeId(element.name || element.id);
      if (id) {
        attrs.push(`id="${id}"`);
      }
    }
    
    // Class names
    const classes = this.generateClassNames(element);
    if (classes.length > 0) {
      attrs.push(`class="${classes.join(' ')}"`);
    }
    
    // Image-specific attributes
    if (element.type === 'image') {
      const src = element.customProperties?.src || '';
      attrs.push(`src="${src}"`);
      
      const alt = element.customProperties?.alt || element.name || '';
      attrs.push(`alt="${this.escapeHTML(alt)}"`);
    }
    
    // Data attributes (for debugging/dev tools)
    if (this.options.withDataAttrs) {
      attrs.push(`data-element-id="${element.id}"`);
      attrs.push(`data-element-type="${element.type}"`);
      
      if (element.componentId) {
        attrs.push(`data-component-id="${element.componentId}"`);
      }
    }
    
    // ARIA attributes
    if (element.customProperties?.ariaLabel) {
      attrs.push(`aria-label="${this.escapeHTML(element.customProperties.ariaLabel)}"`);
    }
    
    if (element.customProperties?.ariaRole) {
      attrs.push(`role="${element.customProperties.ariaRole}"`);
    }
    
    return attrs;
  }
  
  /**
   * Generate CSS class names for an element
   */
  private generateClassNames(element: WebElement): string[] {
    const classes: string[] = [];
    
    // Type-based class
    classes.push(`element-${element.type}`);
    
    // Layout class
    if (element.layout !== 'none') {
      classes.push(`layout-${element.layout}`);
    }
    
    // Auto-layout class
    if (element.autoLayout) {
      classes.push('auto-layout');
    }
    
    // Component class
    if (element.componentId) {
      classes.push(`component-instance`);
    }
    
    // Custom classes
    if (element.customProperties?.className) {
      classes.push(...element.customProperties.className.split(' '));
    }
    
    return classes;
  }
  
  /**
   * Sanitize ID for HTML
   */
  private sanitizeId(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/--+/g, '-');
  }
  
  /**
   * Escape HTML special characters
   */
  private escapeHTML(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, char => map[char]);
  }
}
