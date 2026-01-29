'use client';

import { useEffect, useState, useCallback } from 'react';
import { useCanvasStore } from '@/store/canvas-store';
import { Eye, EyeOff, Lock, Unlock, Trash2, Search, X, FolderPlus, FolderMinus } from 'lucide-react';

interface LayerData {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: string;
  fabricObject: any;
  thumbnail?: string; // Data URL for layer thumbnail
}

export function LayersPanel() {
  const canvas = useCanvasStore((state) => state.canvas);
  const [layers, setLayers] = useState<LayerData[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Generate thumbnail for a fabric object
  const generateThumbnail = (obj: any): string | undefined => {
    if (!obj) return undefined;

    try {
      // Generate a 40x40 thumbnail
      const thumbnail = obj.toDataURL({
        format: 'png',
        quality: 0.8,
        multiplier: 40 / Math.max(obj.width * obj.scaleX, obj.height * obj.scaleY, 1),
      });
      return thumbnail;
    } catch (error) {
      console.error('Failed to generate thumbnail:', error);
      return undefined;
    }
  };

  // Sync layers from canvas objects
  const syncLayers = useCallback(() => {
    if (!canvas) return;

    const objects = canvas.getObjects();
    const layerData: LayerData[] = objects.map((obj: any, index: number) => ({
      id: obj.id || `layer-${index}`,
      name: obj.name || `Layer ${index + 1}`,
      type: obj.type || 'object',
      visible: obj.visible !== false,
      locked: obj.selectable === false,
      opacity: obj.opacity || 1,
      blendMode: obj.globalCompositeOperation || 'source-over',
      fabricObject: obj,
      thumbnail: generateThumbnail(obj),
    })).reverse(); // Reverse to show top layers first

    setLayers(layerData);

    // Update selected layer
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      setSelectedLayerId(activeObject.id || null);
    }
  }, [canvas]);

  // Initialize and listen to canvas events
  useEffect(() => {
    if (!canvas) return;

    syncLayers();

    // Listen to canvas changes
    const handleCanvasChange = () => syncLayers();

    canvas.on('object:added', handleCanvasChange);
    canvas.on('object:removed', handleCanvasChange);
    canvas.on('object:modified', handleCanvasChange);
    canvas.on('selection:created', handleCanvasChange);
    canvas.on('selection:updated', handleCanvasChange);
    canvas.on('selection:cleared', handleCanvasChange);

    return () => {
      canvas.off('object:added', handleCanvasChange);
      canvas.off('object:removed', handleCanvasChange);
      canvas.off('object:modified', handleCanvasChange);
      canvas.off('selection:created', handleCanvasChange);
      canvas.off('selection:updated', handleCanvasChange);
      canvas.off('selection:cleared', handleCanvasChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas]); // syncLayers is recreated on every render but only uses canvas state

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+D or Ctrl+D to duplicate layer
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        handleDuplicateLayer();
      }
      // Cmd+G or Ctrl+G to group layers
      if ((e.metaKey || e.ctrlKey) && e.key === 'g' && !e.shiftKey) {
        e.preventDefault();
        handleGroupLayers();
      }
      // Cmd+Shift+G or Ctrl+Shift+G to ungroup layers
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        handleUngroupLayers();
      }
      // Delete key to delete layer
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selected = layers.find((l) => l.id === selectedLayerId);
        if (selected) {
          e.preventDefault();
          handleDeleteLayer(selected);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLayerId, selectedLayerIds, layers]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleVisibility = (layer: LayerData) => {
    if (!canvas) return;

    const newVisible = !layer.visible;
    layer.fabricObject.set('visible', newVisible);
    canvas.renderAll();
    syncLayers();
  };

  const handleToggleLock = (layer: LayerData) => {
    if (!canvas) return;

    const newLocked = !layer.locked;
    layer.fabricObject.set('selectable', !newLocked);
    layer.fabricObject.set('evented', !newLocked);
    canvas.renderAll();
    syncLayers();
  };

  const handleSelectLayer = (layer: LayerData) => {
    if (!canvas || layer.locked) return;

    canvas.setActiveObject(layer.fabricObject);
    canvas.renderAll();
    setSelectedLayerId(layer.id);
  };

  const handleDeleteLayer = (layer: LayerData) => {
    if (!canvas) return;

    canvas.remove(layer.fabricObject);
    canvas.renderAll();
    syncLayers();
  };

  const handleOpacityChange = (layer: LayerData, opacity: number) => {
    if (!canvas) return;

    layer.fabricObject.set('opacity', opacity);
    canvas.renderAll();
    syncLayers();
  };

  const handleBlendModeChange = (layer: LayerData, blendMode: string) => {
    if (!canvas) return;

    layer.fabricObject.set('globalCompositeOperation', blendMode);
    canvas.renderAll();
    syncLayers();
  };

  const handleAddLayer = () => {
    if (!canvas) return;

    // @ts-ignore - fabric types
    const rect = new window.fabric.Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 200,
      fill: '#6366f1',
      stroke: '#4f46e5',
      strokeWidth: 2,
    });

    // Set custom properties after creation
    (rect as any).id = `layer-${Date.now()}`;
    (rect as any).name = `Layer ${layers.length + 1}`;

    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    syncLayers();
  };

  const handleDuplicateLayer = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.clone((cloned: any) => {
      cloned.set({
        left: activeObject.left + 20,
        top: activeObject.top + 20,
        id: `layer-${Date.now()}`,
        name: `${activeObject.name || 'Layer'} Copy`,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      syncLayers();
    });
  };

  const handleReorderLayers = (draggedId: string, targetId: string) => {
    if (!canvas || draggedId === targetId) return;

    const objects = canvas.getObjects();

    // Find indices (remember layers array is reversed from canvas objects)
    const draggedIndex = layers.findIndex(l => l.id === draggedId);
    const targetIndex = layers.findIndex(l => l.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Convert to canvas indices (reverse the layer indices)
    const draggedCanvasIndex = objects.length - 1 - draggedIndex;
    const targetCanvasIndex = objects.length - 1 - targetIndex;

    // Get the dragged object
    const draggedObject = objects[draggedCanvasIndex];

    // Move object to new position
    draggedObject.moveTo(targetCanvasIndex);

    canvas.renderAll();
    syncLayers();
  };

  const handleGroupLayers = () => {
    if (!canvas) return;

    // Get all selected objects or use multi-selection
    const activeSelection = canvas.getActiveObject();

    // If there's an ActiveSelection, we can group it
    if (activeSelection && activeSelection.type === 'activeSelection') {
      const group = activeSelection.toGroup();
      (group as any).id = `group-${Date.now()}`;
      (group as any).name = `Group ${layers.length + 1}`;
      canvas.setActiveObject(group);
      canvas.renderAll();
      syncLayers();
      return;
    }

    // If we have multiple selected layer IDs, create a group from them
    if (selectedLayerIds.length >= 2) {
      const objectsToGroup = selectedLayerIds
        .map(id => layers.find(l => l.id === id)?.fabricObject)
        .filter(Boolean);

      if (objectsToGroup.length >= 2) {
        // Create selection from objects
        // @ts-ignore - fabric types
        const selection = new window.fabric.ActiveSelection(objectsToGroup, {
          canvas: canvas,
        });
        canvas.setActiveObject(selection);
        const group = selection.toGroup();
        (group as any).id = `group-${Date.now()}`;
        (group as any).name = `Group ${layers.length + 1}`;
        canvas.setActiveObject(group);
        canvas.renderAll();
        syncLayers();
        setSelectedLayerIds([]);
      }
    }
  };

  const handleUngroupLayers = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'group') return;

    // Ungroup the active object
    (activeObject as any).toActiveSelection();
    canvas.requestRenderAll();
    syncLayers();
  };

  // Filter layers based on search query
  const filteredLayers = searchQuery.trim()
    ? layers.filter((layer) =>
        layer.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : layers;

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button className="flex-1 px-4 py-3 text-sm font-medium border-b-2 border-primary text-foreground">
          Layers
        </button>
        <button className="flex-1 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
          History
        </button>
        <button className="flex-1 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
          Properties
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-accent rounded transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-xs text-muted-foreground">
            Found {filteredLayers.length} of {layers.length} layers
          </p>
        )}
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto p-4">
        {layers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No layers yet. Add shapes or images to get started.
          </div>
        ) : filteredLayers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No layers match &quot;{searchQuery}&quot;
          </div>
        ) : (
          <div className="space-y-1">
            {filteredLayers.map((layer) => (
              <LayerItem
                key={layer.id}
                layer={layer}
                isSelected={layer.id === selectedLayerId}
                isDragging={layer.id === draggedLayerId}
                onSelect={() => handleSelectLayer(layer)}
                onToggleVisibility={() => handleToggleVisibility(layer)}
                onToggleLock={() => handleToggleLock(layer)}
                onOpacityChange={(opacity) => handleOpacityChange(layer, opacity)}
                onBlendModeChange={(blendMode) => handleBlendModeChange(layer, blendMode)}
                onDragStart={() => setDraggedLayerId(layer.id)}
                onDragEnd={() => setDraggedLayerId(null)}
                onDrop={(targetId) => handleReorderLayers(draggedLayerId!, targetId)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Layer Controls */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2 mb-2">
          <button
            onClick={handleAddLayer}
            className="flex-1 px-3 py-2 text-sm hover:bg-accent rounded transition-colors"
            title="Add Layer"
          >
            + Add
          </button>
          <button
            onClick={handleDuplicateLayer}
            className="px-3 py-2 hover:bg-accent rounded transition-colors"
            title="Duplicate Layer (Cmd+D)"
          >
            ⎘
          </button>
          <button
            onClick={() => {
              const selected = layers.find((l) => l.id === selectedLayerId);
              if (selected) handleDeleteLayer(selected);
            }}
            className="px-3 py-2 hover:bg-accent rounded transition-colors text-destructive"
            title="Delete Layer (Del)"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleGroupLayers}
            className="flex-1 px-3 py-2 text-sm hover:bg-accent rounded transition-colors flex items-center justify-center gap-2"
            title="Group Layers (Cmd+G)"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Group</span>
          </button>
          <button
            onClick={handleUngroupLayers}
            className="flex-1 px-3 py-2 text-sm hover:bg-accent rounded transition-colors flex items-center justify-center gap-2"
            title="Ungroup Layers (Cmd+Shift+G)"
          >
            <FolderMinus className="w-4 h-4" />
            <span>Ungroup</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function LayerItem({
  layer,
  isSelected,
  isDragging,
  onSelect,
  onToggleVisibility,
  onToggleLock,
  onOpacityChange,
  onBlendModeChange,
  onDragStart,
  onDragEnd,
  onDrop,
}: {
  layer: LayerData;
  isSelected: boolean;
  isDragging: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onOpacityChange: (opacity: number) => void;
  onBlendModeChange: (blendMode: string) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrop: (targetId: string) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', layer.id);
    onDragStart();
  };

  const handleDragEnd = () => {
    onDragEnd();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(layer.id);
  };

  return (
    <div className="space-y-2">
      <div
        draggable={true}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex items-center gap-2 p-2 rounded transition-colors cursor-move group ${
          isSelected
            ? 'bg-primary/20 border border-primary'
            : 'hover:bg-accent border border-transparent'
        } ${isDragging ? 'opacity-50' : ''} ${isDragOver ? 'border-primary border-dashed' : ''}`}
        onClick={onSelect}
      >
        {/* Thumbnail */}
        <div className="w-10 h-10 bg-accent rounded flex items-center justify-center text-xs text-muted-foreground overflow-hidden flex-shrink-0">
          {layer.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={layer.thumbnail}
              alt={layer.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="capitalize">{layer.type[0]}</span>
          )}
        </div>

        {/* Layer Name */}
        <span className="flex-1 text-sm text-foreground truncate">{layer.name}</span>

        {/* Opacity percentage */}
        <span className="text-xs text-muted-foreground w-8 text-right">
          {Math.round(layer.opacity * 100)}%
        </span>

        {/* Controls */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          className="p-1 hover:bg-background rounded transition-colors"
          title={layer.visible ? 'Hide Layer' : 'Show Layer'}
        >
          {layer.visible ? (
            <Eye className="w-4 h-4 text-foreground" />
          ) : (
            <EyeOff className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock();
          }}
          className="p-1 hover:bg-background rounded transition-colors"
          title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
        >
          {layer.locked ? (
            <Lock className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Unlock className="w-4 h-4 text-foreground" />
          )}
        </button>
      </div>

      {/* Opacity Slider and Blend Mode (shown when selected) */}
      {isSelected && (
        <div className="pl-12 pr-2 pb-2 space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground flex-shrink-0">Opacity:</label>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(layer.opacity * 100)}
              onChange={(e) => onOpacityChange(Number(e.target.value) / 100)}
              className="flex-1 h-1 bg-accent rounded-lg appearance-none cursor-pointer accent-primary"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground flex-shrink-0">Blend:</label>
            <select
              value={layer.blendMode}
              onChange={(e) => onBlendModeChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 text-xs bg-background border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="source-over">Normal</option>
              <option value="multiply">Multiply</option>
              <option value="screen">Screen</option>
              <option value="overlay">Overlay</option>
              <option value="darken">Darken</option>
              <option value="lighten">Lighten</option>
              <option value="color-dodge">Color Dodge</option>
              <option value="color-burn">Color Burn</option>
              <option value="hard-light">Hard Light</option>
              <option value="soft-light">Soft Light</option>
              <option value="difference">Difference</option>
              <option value="exclusion">Exclusion</option>
              <option value="hue">Hue</option>
              <option value="saturation">Saturation</option>
              <option value="color">Color</option>
              <option value="luminosity">Luminosity</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
