'use client';

import { useState, useRef, useEffect } from 'react';
import { useCanvasStore } from '@/store/canvas-store';
import { FlipHorizontal, FlipVertical, Undo, Redo } from 'lucide-react';

interface EditMenuProps {
  onClose?: () => void;
}

export function EditMenu({ onClose }: EditMenuProps) {
  const canvas = useCanvasStore((state) => state.canvas);
  const undo = useCanvasStore((state) => state.undo);
  const redo = useCanvasStore((state) => state.redo);
  const canUndo = useCanvasStore((state) => state.canUndo);
  const canRedo = useCanvasStore((state) => state.canRedo);

  const handleFlipHorizontal = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) {
      alert('Please select an object first');
      return;
    }

    // Flip horizontally by inverting the scaleX
    activeObject.set('flipX', !activeObject.flipX);
    canvas.renderAll();

    // Add to history
    const state = JSON.stringify(canvas.toJSON(['id', 'name', 'selectable']));
    useCanvasStore.getState().addToHistory(state);

    onClose?.();
  };

  const handleFlipVertical = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) {
      alert('Please select an object first');
      return;
    }

    // Flip vertically by inverting the scaleY
    activeObject.set('flipY', !activeObject.flipY);
    canvas.renderAll();

    // Add to history
    const state = JSON.stringify(canvas.toJSON(['id', 'name', 'selectable']));
    useCanvasStore.getState().addToHistory(state);

    onClose?.();
  };

  const handleUndo = () => {
    undo();
    onClose?.();
  };

  const handleRedo = () => {
    redo();
    onClose?.();
  };

  return (
    <div className="min-w-[200px] py-1 bg-surface border border-border rounded-md shadow-lg">
      <button
        onClick={handleUndo}
        disabled={!canUndo}
        className="w-full px-3 py-2 text-left text-sm hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Undo className="w-4 h-4" />
        <span>Undo</span>
        <span className="ml-auto text-xs text-muted-foreground">Cmd+Z</span>
      </button>

      <button
        onClick={handleRedo}
        disabled={!canRedo}
        className="w-full px-3 py-2 text-left text-sm hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Redo className="w-4 h-4" />
        <span>Redo</span>
        <span className="ml-auto text-xs text-muted-foreground">Cmd+Shift+Z</span>
      </button>

      <div className="h-px bg-border my-1" />

      <button
        onClick={handleFlipHorizontal}
        className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
      >
        <FlipHorizontal className="w-4 h-4" />
        <span>Flip Horizontal</span>
      </button>

      <button
        onClick={handleFlipVertical}
        className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
      >
        <FlipVertical className="w-4 h-4" />
        <span>Flip Vertical</span>
      </button>
    </div>
  );
}

export function EditMenuButton() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 hover:bg-accent rounded"
      >
        Edit
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50">
          <EditMenu onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}
