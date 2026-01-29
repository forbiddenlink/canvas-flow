"use client";

import { useState } from "react";
import { Component, Plus, Trash2, Copy, FolderOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCanvasStore } from "@/store/canvas-store";

const COMPONENT_CATEGORIES = [
  "All",
  "Buttons",
  "Cards",
  "Forms",
  "Navigation",
  "Layout",
  "Typography",
  "Icons",
  "Media",
  "Other",
];

export function ComponentLibraryPanel() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const components = useCanvasStore((state) => state.components);
  const createInstance = useCanvasStore((state) => state.createInstance);
  const deleteComponent = useCanvasStore((state) => state.deleteComponent);
  const canvas = useCanvasStore((state) => state.canvas);

  // Filter components
  const filteredComponents = Array.from(components.values()).filter((comp) => {
    const matchesCategory =
      selectedCategory === "All" || comp.category === selectedCategory;
    const matchesSearch =
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (comp.description &&
        comp.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleInsertComponent = (componentId: string) => {
    // Create an instance
    const instanceId = createInstance(componentId);
    
    // Add to canvas (this would integrate with actual canvas rendering)
    if (canvas) {
      // TODO: Implement actual canvas insertion
      console.log(`Inserting component instance: ${instanceId}`);
    }
  };

  const handleDeleteComponent = (componentId: string) => {
    if (confirm("Are you sure? This will delete the component but keep existing instances.")) {
      try {
        deleteComponent(componentId);
      } catch (error) {
        alert(error instanceof Error ? error.message : "Failed to delete component");
      }
    }
  };

  const handleDuplicateComponent = (componentId: string) => {
    const component = components.get(componentId);
    if (component) {
      // TODO: Implement duplication logic
      console.log(`Duplicating component: ${componentId}`);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2">
          <Component className="h-4 w-4 text-purple-500" />
          <h3 className="font-semibold text-sm">Components</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Search */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Categories */}
      <ScrollArea className="border-b">
        <div className="flex gap-1 p-2">
          {COMPONENT_CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="text-xs whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Component List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {filteredComponents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                No components found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {searchQuery
                  ? "Try a different search term"
                  : "Create your first component from a selection"}
              </p>
            </div>
          ) : (
            filteredComponents.map((component) => (
              <div
                key={component.id}
                className="group relative rounded-lg border p-3 hover:bg-accent transition-colors"
              >
                {/* Thumbnail */}
                <div className="mb-2 rounded bg-muted aspect-video flex items-center justify-center">
                  {component.thumbnail ? (
                    <img
                      src={component.thumbnail}
                      alt={component.name}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <Component className="h-8 w-8 text-muted-foreground/50" />
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <h4 className="text-sm font-medium leading-none">
                    {component.name}
                  </h4>
                  {component.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {component.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                      {component.category}
                    </span>
                    {component.variants.length > 1 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                        {component.variants.length} variants
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => handleInsertComponent(component.id)}
                    title="Insert instance"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => handleDuplicateComponent(component.id)}
                    title="Duplicate component"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleDeleteComponent(component.id)}
                    title="Delete component"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-3">
        <p className="text-xs text-muted-foreground text-center">
          Select an element and click{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">
            Cmd+K
          </kbd>{" "}
          to create a component
        </p>
      </div>
    </div>
  );
}
