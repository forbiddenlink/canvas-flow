/**
 * Component Registry Service
 * Manages component definitions, instances, and their relationships
 */

import { ComponentDefinition, ComponentInstance, ComponentVariant, WebElement } from '@/types';

export class ComponentRegistry {
  private components: Map<string, ComponentDefinition> = new Map();
  private instances: Map<string, ComponentInstance> = new Map();
  private elements: Map<string, WebElement> = new Map();

  /**
   * Register a new component definition
   */
  registerComponent(component: ComponentDefinition): void {
    this.components.set(component.id, component);
  }

  /**
   * Get a component by ID
   */
  getComponent(id: string): ComponentDefinition | undefined {
    return this.components.get(id);
  }

  /**
   * Get all components
   */
  getAllComponents(): ComponentDefinition[] {
    return Array.from(this.components.values());
  }

  /**
   * Get components by category
   */
  getComponentsByCategory(category: string): ComponentDefinition[] {
    return this.getAllComponents().filter((c) => c.category === category);
  }

  /**
   * Delete a component
   */
  deleteComponent(id: string): boolean {
    // Check if any instances exist
    const hasInstances = Array.from(this.instances.values()).some(
      (inst) => inst.componentId === id
    );

    if (hasInstances) {
      throw new Error('Cannot delete component with existing instances');
    }

    return this.components.delete(id);
  }

  /**
   * Update component definition
   */
  updateComponent(id: string, updates: Partial<ComponentDefinition>): void {
    const component = this.components.get(id);
    if (!component) {
      throw new Error(`Component ${id} not found`);
    }

    const updated = {
      ...component,
      ...updates,
      updatedAt: new Date(),
    };

    this.components.set(id, updated);
  }

  /**
   * Add a variant to a component
   */
  addVariant(componentId: string, variant: ComponentVariant): void {
    const component = this.components.get(componentId);
    if (!component) {
      throw new Error(`Component ${componentId} not found`);
    }

    component.variants.push(variant);
    component.updatedAt = new Date();
    this.components.set(componentId, component);
  }

  /**
   * Create an instance of a component
   */
  createInstance(componentId: string, variantId?: string): ComponentInstance {
    const component = this.components.get(componentId);
    if (!component) {
      throw new Error(`Component ${componentId} not found`);
    }

    const instance: ComponentInstance = {
      id: `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      componentId,
      variantId: variantId || component.variants[0]?.id,
      overrides: {},
    };

    this.instances.set(instance.id, instance);
    return instance;
  }

  /**
   * Get an instance by ID
   */
  getInstance(id: string): ComponentInstance | undefined {
    return this.instances.get(id);
  }

  /**
   * Get all instances of a component
   */
  getComponentInstances(componentId: string): ComponentInstance[] {
    return Array.from(this.instances.values()).filter(
      (inst) => inst.componentId === componentId
    );
  }

  /**
   * Update instance overrides
   */
  updateInstanceOverride(
    instanceId: string,
    propertyName: string,
    value: any
  ): void {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }

    instance.overrides[propertyName] = value;
    this.instances.set(instanceId, instance);
  }

  /**
   * Delete an instance
   */
  deleteInstance(id: string): boolean {
    return this.instances.delete(id);
  }

  /**
   * Get the resolved properties for an instance (merges component defaults with overrides)
   */
  getResolvedInstanceProperties(instanceId: string): Record<string, any> {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }

    const component = this.components.get(instance.componentId);
    if (!component) {
      throw new Error(`Component ${instance.componentId} not found`);
    }

    // Get the selected variant
    const variant = component.variants.find((v) => v.id === instance.variantId);
    if (!variant) {
      throw new Error(`Variant ${instance.variantId} not found`);
    }

    // Start with variant properties
    const resolved = { ...variant.properties };

    // Apply component property defaults
    component.properties.forEach((prop) => {
      if (!(prop.name in resolved)) {
        resolved[prop.name] = prop.defaultValue;
      }
    });

    // Apply instance overrides
    Object.keys(instance.overrides).forEach((key) => {
      resolved[key] = instance.overrides[key];
    });

    return resolved;
  }

  /**
   * Clone a component tree (deep copy with new IDs)
   */
  cloneComponentTree(rootElementId: string): WebElement {
    const element = this.elements.get(rootElementId);
    if (!element) {
      throw new Error(`Element ${rootElementId} not found`);
    }

    const cloned = this.deepCloneElement(element);
    return cloned;
  }

  private deepCloneElement(element: WebElement): WebElement {
    const newId = `elem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const cloned: WebElement = {
      ...element,
      id: newId,
      children: element.children.map((childId) => {
        const child = this.elements.get(childId);
        if (child) {
          const clonedChild = this.deepCloneElement(child);
          this.elements.set(clonedChild.id, clonedChild);
          return clonedChild.id;
        }
        return childId;
      }),
    };

    return cloned;
  }

  /**
   * Register an element in the registry
   */
  registerElement(element: WebElement): void {
    this.elements.set(element.id, element);
  }

  /**
   * Get an element by ID
   */
  getElement(id: string): WebElement | undefined {
    return this.elements.get(id);
  }

  /**
   * Export component library to JSON
   */
  exportLibrary(): string {
    const data = {
      components: Array.from(this.components.values()),
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Import component library from JSON
   */
  importLibrary(json: string): void {
    try {
      const data = JSON.parse(json);
      
      if (!data.components || !Array.isArray(data.components)) {
        throw new Error('Invalid library format');
      }

      data.components.forEach((component: ComponentDefinition) => {
        this.registerComponent(component);
      });
    } catch (error) {
      throw new Error(`Failed to import library: ${error}`);
    }
  }

  /**
   * Clear all components and instances
   */
  clear(): void {
    this.components.clear();
    this.instances.clear();
    this.elements.clear();
  }
}

// Singleton instance
export const componentRegistry = new ComponentRegistry();
