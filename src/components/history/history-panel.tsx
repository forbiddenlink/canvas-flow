'use client';

import { useEffect, useState } from 'react';
import { useCanvasStore } from '@/store/canvas-store';
import { Undo2, Redo2, Trash2 } from 'lucide-react';

interface HistoryState {
  index: number;
  description: string;
  isCurrent: boolean;
}

export function HistoryPanel() {
  const canvas = useCanvasStore((state) => state.canvas);
  const history = useCanvasStore((state) => state.history);
  const historyIndex = useCanvasStore((state) => state.historyIndex);
  const canUndo = useCanvasStore((state) => state.canUndo);
  const canRedo = useCanvasStore((state) => state.canRedo);
  const undo = useCanvasStore((state) => state.undo);
  const redo = useCanvasStore((state) => state.redo);
  const [historyStates, setHistoryStates] = useState<HistoryState[]>([]);

  // Parse history to create display states
  useEffect(() => {
    const states: HistoryState[] = history.map((_, index) => ({
      index,
      description: index === 0 ? 'Initial State' : `Action ${index}`,
      isCurrent: index === historyIndex,
    }));

    setHistoryStates(states);
  }, [history, historyIndex]);

  // Jump to a specific history state
  const jumpToState = (targetIndex: number) => {
    if (!canvas || targetIndex === historyIndex) return;

    // Undo or redo to reach the target state
    if (targetIndex < historyIndex) {
      // Go backwards
      const steps = historyIndex - targetIndex;
      for (let i = 0; i < steps; i++) {
        undo();
      }
    } else {
      // Go forwards
      const steps = targetIndex - historyIndex;
      for (let i = 0; i < steps; i++) {
        redo();
      }
    }
  };

  // Get clear history function from store
  const clearHistoryFromStore = useCanvasStore((state) => state.clearHistory);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">History</h3>
          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-1.5 rounded hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
              title="Undo (Cmd+Z)"
              aria-label="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-1.5 rounded hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
              title="Redo (Cmd+Shift+Z)"
              aria-label="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <button
              onClick={clearHistoryFromStore}
              disabled={history.length <= 1}
              className="p-1.5 rounded hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
              title="Clear history"
              aria-label="Clear history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {history.length} {history.length === 1 ? 'state' : 'states'} • {historyIndex + 1} of {history.length}
        </p>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto">
        {historyStates.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No history yet. Make changes to see them here.
            </p>
          </div>
        ) : (
          <div className="p-2">
            {historyStates.map((state) => (
              <button
                key={state.index}
                onClick={() => jumpToState(state.index)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors mb-1 ${
                  state.isCurrent
                    ? 'bg-primary/10 border border-primary/30 text-foreground'
                    : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                }`}
                title={`Jump to ${state.description}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{state.description}</span>
                  {state.isCurrent && (
                    <span className="text-xs text-primary font-medium">Current</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  State {state.index + 1}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer with keyboard shortcuts */}
      <div className="p-3 border-t border-border bg-surface/50">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Undo:</span>
            <kbd className="px-1.5 py-0.5 bg-accent rounded text-[10px] font-mono">Cmd+Z</kbd>
          </div>
          <div className="flex justify-between">
            <span>Redo:</span>
            <kbd className="px-1.5 py-0.5 bg-accent rounded text-[10px] font-mono">Cmd+Shift+Z</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
