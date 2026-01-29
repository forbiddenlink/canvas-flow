"use client";

import { useState } from "react";
import { Component, Folder, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCanvasStore } from "@/store/canvas-store";
import { componentRegistry } from "@/lib/canvas/component-registry";

interface ComponentCreatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedElementId?: string;
}

const COMPONENT_CATEGORIES = [
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

export function ComponentCreator({
  open,
  onOpenChange,
  selectedElementId,
}: ComponentCreatorProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Other");
  const [error, setError] = useState("");
  const createComponent = useCanvasStore((state) => state.createComponent);

  const handleCreate = () => {
    if (!name.trim()) {
      setError("Component name is required");
      return;
    }

    if (!selectedElementId) {
      setError("Please select an element to create a component from");
      return;
    }

    try {
      // Create component in store
      const componentId = createComponent(name.trim(), category, selectedElementId);
      
      // Register in component registry
      const component = {
        id: componentId,
        name: name.trim(),
        category,
        rootElementId: selectedElementId,
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
      
      componentRegistry.registerComponent(component);

      // Reset form
      setName("");
      setCategory("Other");
      setError("");
      
      // Close dialog
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create component");
    }
  };

  const handleCancel = () => {
    setName("");
    setCategory("Other");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Component className="h-5 w-5 text-purple-500" />
            Create Component
          </DialogTitle>
          <DialogDescription>
            Convert the selected element into a reusable component. Components can be
            inserted multiple times and will sync changes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Component Name */}
          <div className="space-y-2">
            <Label htmlFor="component-name">Component Name *</Label>
            <Input
              id="component-name"
              placeholder="e.g., Primary Button, Hero Card"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value);
                setError("");
              }}
              autoFocus
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COMPONENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <div className="flex items-center gap-2">
                      <Folder className="h-3.5 w-3.5" />
                      {cat}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Info */}
          <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
            <p>
              💡 <strong>Tip:</strong> After creating the component, you can add
              variants (e.g., different button states) and customize properties.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim() || !selectedElementId}>
            <Component className="mr-2 h-4 w-4" />
            Create Component
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
