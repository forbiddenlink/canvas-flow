'use client';

import { useEffect, useState } from 'react';
import { useCanvasStore } from '@/store/canvas-store';
import { Layers, Square, Circle, Type, Image as ImageIcon } from 'lucide-react';

interface ObjectProperties {
  type: string;
  left: number;
  top: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  angle: number;
  opacity: number;
  visible: boolean;
  selectable: boolean;
}

export function PropertiesPanel() {
  const canvas = useCanvasStore((state) => state.canvas);
  const [properties, setProperties] = useState<ObjectProperties | null>(null);
  const [selectedObjectType, setSelectedObjectType] = useState<string>('');

  // Update properties when selection changes
  useEffect(() => {
    if (!canvas) return;

    const updateProperties = () => {
      const activeObject = canvas.getActiveObject();

      if (!activeObject) {
        setProperties(null);
        setSelectedObjectType('');
        return;
      }

      const props: ObjectProperties = {
        type: activeObject.type || 'object',
        left: Math.round(activeObject.left || 0),
        top: Math.round(activeObject.top || 0),
        width: Math.round((activeObject.width || 0) * (activeObject.scaleX || 1)),
        height: Math.round((activeObject.height || 0) * (activeObject.scaleY || 1)),
        scaleX: parseFloat((activeObject.scaleX || 1).toFixed(2)),
        scaleY: parseFloat((activeObject.scaleY || 1).toFixed(2)),
        angle: Math.round(activeObject.angle || 0),
        opacity: parseFloat((activeObject.opacity || 1).toFixed(2)),
        visible: activeObject.visible !== false,
        selectable: activeObject.selectable !== false,
      };

      setProperties(props);
      setSelectedObjectType(activeObject.type || 'object');
    };

    // Update on selection and modification
    updateProperties();

    canvas.on('selection:created', updateProperties);
    canvas.on('selection:updated', updateProperties);
    canvas.on('selection:cleared', updateProperties);
    canvas.on('object:modified', updateProperties);
    canvas.on('object:moving', updateProperties);
    canvas.on('object:scaling', updateProperties);
    canvas.on('object:rotating', updateProperties);

    return () => {
      canvas.off('selection:created', updateProperties);
      canvas.off('selection:updated', updateProperties);
      canvas.off('selection:cleared', updateProperties);
      canvas.off('object:modified', updateProperties);
      canvas.off('object:moving', updateProperties);
      canvas.off('object:scaling', updateProperties);
      canvas.off('object:rotating', updateProperties);
    };
  }, [canvas]);

  // Get icon for object type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rect':
        return <Square className="w-4 h-4" />;
      case 'circle':
        return <Circle className="w-4 h-4" />;
      case 'text':
      case 'i-text':
      case 'textbox':
        return <Type className="w-4 h-4" />;
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  // Get friendly name for object type
  const getTypeName = (type: string) => {
    switch (type) {
      case 'rect':
        return 'Rectangle';
      case 'circle':
        return 'Circle';
      case 'text':
      case 'i-text':
      case 'textbox':
        return 'Text';
      case 'image':
        return 'Image';
      case 'group':
        return 'Group';
      default:
        return 'Object';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Properties</h3>
        {properties && (
          <div className="flex items-center gap-2 mt-2">
            <div className="text-primary">{getTypeIcon(selectedObjectType)}</div>
            <p className="text-xs text-muted-foreground">
              {getTypeName(selectedObjectType)}
            </p>
          </div>
        )}
      </div>

      {/* Properties Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {!properties ? (
          <div className="text-center py-8">
            <Layers className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              Select a layer or object to view its properties
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Position */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Position
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">X</label>
                  <div className="text-sm font-mono bg-accent/50 px-2 py-1 rounded">
                    {properties.left}px
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Y</label>
                  <div className="text-sm font-mono bg-accent/50 px-2 py-1 rounded">
                    {properties.top}px
                  </div>
                </div>
              </div>
            </div>

            {/* Size */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Size
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">Width</label>
                  <div className="text-sm font-mono bg-accent/50 px-2 py-1 rounded">
                    {properties.width}px
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Height</label>
                  <div className="text-sm font-mono bg-accent/50 px-2 py-1 rounded">
                    {properties.height}px
                  </div>
                </div>
              </div>
            </div>

            {/* Transform */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Transform
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">Scale X</label>
                  <div className="text-sm font-mono bg-accent/50 px-2 py-1 rounded">
                    {properties.scaleX}×
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Scale Y</label>
                  <div className="text-sm font-mono bg-accent/50 px-2 py-1 rounded">
                    {properties.scaleY}×
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Rotation</label>
                <div className="text-sm font-mono bg-accent/50 px-2 py-1 rounded">
                  {properties.angle}°
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Appearance
              </h4>
              <div>
                <label className="text-xs text-muted-foreground">Opacity</label>
                <div className="text-sm font-mono bg-accent/50 px-2 py-1 rounded">
                  {Math.round(properties.opacity * 100)}%
                </div>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-muted-foreground">Visible</span>
                <span className={`text-sm font-medium ${properties.visible ? 'text-green-500' : 'text-red-500'}`}>
                  {properties.visible ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-muted-foreground">Selectable</span>
                <span className={`text-sm font-medium ${properties.selectable ? 'text-green-500' : 'text-red-500'}`}>
                  {properties.selectable ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer with tip */}
      <div className="p-3 border-t border-border bg-surface/50">
        <p className="text-xs text-muted-foreground">
          💡 Properties update in real-time as you edit
        </p>
      </div>
    </div>
  );
}
