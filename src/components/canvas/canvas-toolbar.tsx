'use client';

import { useCanvasStore } from '@/store/canvas-store';
import { FileCode, Sparkles } from 'lucide-react';

interface CanvasToolbarProps {
  onExportCode?: () => void;
  onLoadDemo?: () => void;
}

export function CanvasToolbar({ onExportCode, onLoadDemo }: CanvasToolbarProps) {
  const { zoom, zoomIn, zoomOut, fitToScreen, undo, redo, canUndo, canRedo } =
    useCanvasStore();

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="h-12 border-b border-border bg-surface/50 backdrop-blur-sm flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-2">
        <button
          onClick={zoomOut}
          className="p-2 hover:bg-accent rounded transition-colors"
          title="Zoom Out (Ctrl + -)"
          aria-label="Zoom out"
        >
          <span className="text-lg font-semibold">−</span>
        </button>
        <span className="text-sm text-muted-foreground min-w-[60px] text-center font-mono">
          {zoomPercent}%
        </span>
        <button
          onClick={zoomIn}
          className="p-2 hover:bg-accent rounded transition-colors"
          title="Zoom In (Ctrl + +)"
          aria-label="Zoom in"
        >
          <span className="text-lg font-semibold">+</span>
        </button>
        <button
          onClick={fitToScreen}
          className="ml-2 px-3 py-1.5 text-sm hover:bg-accent rounded transition-colors"
          title="Fit to Screen (Ctrl + 0)"
          aria-label="Fit to screen"
        >
          Fit to Screen
        </button>
      </div>
      <div className="flex items-center gap-2">
        {onLoadDemo && (
          <button
            onClick={onLoadDemo}
            className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded transition-colors flex items-center gap-2"
            title="Load Demo Content"
            aria-label="Load demo content"
          >
            <Sparkles className="w-4 h-4" />
            Load Demo
          </button>
        )}
        {onExportCode && (
          <button
            onClick={onExportCode}
            className="px-3 py-1.5 text-sm bg-primary text-primary-foreground hover:opacity-90 rounded transition-colors flex items-center gap-2"
            title="Export to Code (Cmd/Ctrl + Shift + E)"
            aria-label="Export to code"
          >
            <FileCode className="w-4 h-4" />
            Export Code
          </button>
        )}
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-2 hover:bg-accent rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo (Ctrl + Z)"
          aria-label="Undo"
        >
          <span className="text-lg">↶</span>
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-2 hover:bg-accent rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo (Ctrl + Shift + Z)"
          aria-label="Redo"
        >
          <span className="text-lg">↷</span>
        </button>
      </div>
    </div>
  );
}
