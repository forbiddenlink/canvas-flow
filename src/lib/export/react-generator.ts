/**
 * React Component Generator
 * Based on patterns from Builder.io and Craft.js
 * Generates React/Next.js components from WebElement tree
 */

import { WebElement, ComponentInstance } from '@/types';
import prettier from 'prettier';

export interface ReactGeneratorOptions {
  typescript?: boolean; // Generate TypeScript (.tsx)
  framework?: 'react' | 'next'; // Framework target
  styleFormat?: 'inline' | 'css-modules' | 'tailwind'; // Style approach
  indent?: number; // Indentation
  prettify?: boolean; // Format with Prettier
  includeTypes?: boolean; // Include TypeScript interfaces
  exportDefault?: boolean; // Use export default
}

export class ReactGenerator {
  private options: Required<ReactGeneratorOptions>;
  private elements: Map<string, WebElement>;
  private components: Map<string, ComponentInstance>;
  private imports: Set<string>;
  
  constructor(options: ReactGeneratorOptions = {}) {
    this.options = {
      typescript: options.typescript ?? true,
      framework: options.framework ?? 'react',
      styleFormat: options.styleFormat ?? 'css-modules',
      indent: options.indent ?? 2,
      prettify: options.prettify ?? true,
      includeTypes: options.includeTypes ?? true,
      exportDefault: options.exportDefault ?? true,
    };
    this.elements = new Map();
    this.components = new Map();
    this.imports = new Set();
  }
  
  /**
   * Generate React component from WebElement tree
   */
  async generate(
    rootElement: WebElement,
    elements: Map<string, WebElement>,
    componentName: string = 'Component'
  ): Promise<{ component: string; styles?: string }> {
    this.elements = elements;
    this.imports.clear();
    
    // Add base imports
    if (this.options.framework === 'next') {
      this.imports.add("import Image from 'next/image';");
    }
    
    // Generate component JSX
    const jsx = this.elementToJSX(rootElement);
    
    // Build component code
    let code = '';
    
    // Imports
    code += Array.from(this.imports).join('\n');
    if (this.imports.size > 0) code += '\n\n';
    
    // TypeScript interface for props
    if (this.options.typescript && this.options.includeTypes) {
      code += `interface ${componentName}Props {\n`;
      code += `  className?: string;\n`;
      code += `}\n\n`;
    }
    
    // Component
    const propsType = this.options.typescript ? `: ${componentName}Props` : '';
    code += `${this.options.exportDefault ? 'export default ' : 'export '}function ${componentName}({ className }${propsType}) {\n`;
    code += `  return (\n`;
    code += this.indentCode(jsx, 2);
    code += `\n  );\n`;
    code += `}\n`;
    
    // Format with Prettier
    if (this.options.prettify) {
      code = await prettier.format(code, {
        parser: this.options.typescript ? 'typescript' : 'babel',
        printWidth: 80,
        tabWidth: this.options.indent,
        semi: true,
        singleQuote: true,
      });
    }
    
    return { component: code };
  }
  
  /**
   * Convert WebElement to JSX
   */
  private elementToJSX(element: WebElement): string {
    const tag = this.getJSXTag(element);
    const props = this.getJSXProps(element);
    const children = this.getJSXChildren(element);
    
    // Self-closing tag
    if (!children) {
      return `<${tag}${props} />`;
    }
    
    // Single-line if short
    if (children.length < 50 && !children.includes('\n')) {
      return `<${tag}${props}>${children}</${tag}>`;
    }
    
    // Multi-line
    return `<${tag}${props}>\n${this.indentCode(children, 1)}\n</${tag}>`;
  }
  
  /**
   * Get JSX tag name for element
   */
  private getJSXTag(element: WebElement): string {
    // Component instance
    if (element.componentId) {
      const componentInstance = this.components.get(element.componentId);
      if (componentInstance) {
        // Component name would come from component definition, not instance
        // For now, use a generic name based on component ID
        const componentName = `Component${element.componentId.slice(0, 8)}`;
        return componentName;
      }
    }
    
    // Standard elements
    const tagMap: Record<string, string> = {
      frame: 'div',
      text: 'p',
      image: this.options.framework === 'next' ? 'Image' : 'img',
      button: 'button',
      input: 'input',
    };
    
    return tagMap[element.type] || 'div';
  }
  
  /**
   * Get JSX props string
   */
  private getJSXProps(element: WebElement): string {
    const props: string[] = [];
    
    // className
    const classNames = this.getClassNames(element);
    if (classNames) {
      props.push(`className="${classNames}"`);
    }
    
    // Image props
    if (element.type === 'image' && element.customProperties?.imageUrl) {
      const url = element.customProperties.imageUrl;
      props.push(`src="${url}"`);
      props.push(`alt="${element.name}"`);
      
      if (this.options.framework === 'next') {
        // Get dimensions from element
        const width = typeof element.width === 'number' ? element.width : element.width.default;
        const height = typeof element.height === 'number' ? element.height : element.height.default;
        props.push(`width={${width}}`);
        props.push(`height={${height}}`);
      }
    }
    
    // Button/Input props (check via custom properties since type doesn't include these)
    if (element.customProperties?.componentType === 'button') {
      props.push(`onClick={() => {}}`);
    }
    
    if (element.customProperties?.componentType === 'input' && element.customProperties?.placeholder) {
      props.push(`placeholder="${element.customProperties.placeholder}"`);
    }
    
    // Inline styles (if using inline style format)
    if (this.options.styleFormat === 'inline') {
      const styles = this.getInlineStyles(element);
      if (styles) {
        props.push(`style={${styles}}`);
      }
    }
    
    // Accessibility
    if (element.customProperties?.ariaLabel) {
      props.push(`aria-label="${element.customProperties.ariaLabel}"`);
    }
    
    return props.length > 0 ? ' ' + props.join(' ') : '';
  }
  
  /**
   * Get JSX children
   */
  private getJSXChildren(element: WebElement): string | null {
    // Text element
    if (element.type === 'text' && element.customProperties?.textContent) {
      return this.escapeJSX(element.customProperties.textContent);
    }
    
    // Container with children
    if (element.children.length > 0) {
      return element.children
        .map(childId => {
          const child = this.elements.get(childId);
          return child ? this.elementToJSX(child) : '';
        })
        .filter(Boolean)
        .join('\n');
    }
    
    return null;
  }
  
  /**
   * Get className for element
   */
  private getClassNames(element: WebElement): string {
    if (this.options.styleFormat === 'tailwind') {
      return this.getTailwindClasses(element);
    }
    
    if (this.options.styleFormat === 'css-modules') {
      return `styles.element-${element.type}`;
    }
    
    return `element-${element.type}`;
  }
  
  /**
   * Generate Tailwind classes for element
   */
  private getTailwindClasses(element: WebElement): string {
    const classes: string[] = [];
    
    // Layout
    if (element.layout === 'flex' && element.autoLayout) {
      classes.push('flex');
      
      if (element.autoLayout.direction === 'column') {
        classes.push('flex-col');
      }
      
      // Alignment
      const alignMap: Record<string, string> = {
        'flex-start': 'items-start',
        'flex-end': 'items-end',
        center: 'items-center',
        stretch: 'items-stretch',
      };
      classes.push(alignMap[element.autoLayout.alignItems] || 'items-start');
      
      const justifyMap: Record<string, string> = {
        'flex-start': 'justify-start',
        'flex-end': 'justify-end',
        center: 'justify-center',
        'space-between': 'justify-between',
      };
      classes.push(justifyMap[element.autoLayout.justifyContent] || 'justify-start');
      
      // Gap
      if (element.autoLayout.gap > 0) {
        const gapClass = this.pixelsToTailwindSpacing(element.autoLayout.gap);
        classes.push(`gap-${gapClass}`);
      }
    }
    
    // Size
    const width = typeof element.width === 'number' ? element.width : element.width.default;
    const height = typeof element.height === 'number' ? element.height : element.height.default;
    
    if (typeof width === 'string' && width === 'auto') classes.push('w-auto');
    if (typeof height === 'string' && height === 'auto') classes.push('h-auto');
    
    // Background
    if (element.fills && element.fills.length > 0) {
      const fill = element.fills[0];
      if (fill.visible && fill.type === 'solid' && fill.color) {
        // Convert hex to Tailwind class (simplified)
        classes.push('bg-gray-100');
      }
    }
    
    // Text
    if (element.type === 'text') {
      if (element.customProperties?.fontSize) {
        const sizeClass = this.pixelsToTailwindText(element.customProperties.fontSize);
        classes.push(`text-${sizeClass}`);
      }
    }
    
    return classes.join(' ');
  }
  
  /**
   * Get inline styles object
   */
  private getInlineStyles(element: WebElement): string {
    const styles: Record<string, any> = {};
    
    // Layout
    if (element.layout === 'flex') {
      styles.display = 'flex';
      if (element.autoLayout) {
        styles.flexDirection = element.autoLayout.direction;
        styles.gap = `${element.autoLayout.gap}px`;
      }
    }
    
    // Size
    const width = typeof element.width === 'number' ? element.width : element.width.default;
    const height = typeof element.height === 'number' ? element.height : element.height.default;
    
    if (typeof width === 'number') styles.width = `${width}px`;
    if (typeof height === 'number') styles.height = `${height}px`;
    
    // Background
    if (element.fills && element.fills.length > 0) {
      const fill = element.fills[0];
      if (fill.visible && fill.type === 'solid' && fill.color) {
        styles.backgroundColor = fill.color;
      }
    }
    
    return JSON.stringify(styles);
  }
  
  /**
   * Convert pixels to Tailwind spacing class
   */
  private pixelsToTailwindSpacing(px: number): string {
    const spacing: Record<number, string> = {
      4: '1',
      8: '2',
      12: '3',
      16: '4',
      20: '5',
      24: '6',
      32: '8',
    };
    
    return spacing[px] || '4';
  }
  
  /**
   * Convert font size to Tailwind text class
   */
  private pixelsToTailwindText(px: number): string {
    if (px <= 12) return 'xs';
    if (px <= 14) return 'sm';
    if (px <= 16) return 'base';
    if (px <= 18) return 'lg';
    if (px <= 20) return 'xl';
    if (px <= 24) return '2xl';
    return '3xl';
  }
  
  /**
   * Escape JSX special characters
   */
  private escapeJSX(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/{/g, '&#123;')
      .replace(/}/g, '&#125;');
  }
  
  /**
   * Indent code
   */
  private indentCode(code: string, level: number): string {
    const indent = '  '.repeat(level);
    return code.split('\n').map(line => indent + line).join('\n');
  }
}
