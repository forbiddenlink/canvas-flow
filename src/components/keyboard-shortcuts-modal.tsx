'use client';

import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Shortcut {
  keys: string;
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  // File operations
  { keys: 'Cmd/Ctrl + S', description: 'Save project', category: 'File' },
  { keys: 'Cmd/Ctrl + E', description: 'Export image', category: 'File' },
  { keys: 'Cmd/Ctrl + Shift + E', description: 'Export to code', category: 'File' },

  // Edit operations
  { keys: 'Cmd/Ctrl + Z', description: 'Undo', category: 'Edit' },
  { keys: 'Cmd/Ctrl + Shift + Z', description: 'Redo', category: 'Edit' },
  { keys: 'Cmd/Ctrl + D', description: 'Duplicate layer', category: 'Edit' },
  { keys: 'Delete / Backspace', description: 'Delete layer', category: 'Edit' },

  // Tools
  { keys: 'V', description: 'Move tool / Select', category: 'Tools' },
  { keys: 'C', description: 'Crop tool', category: 'Tools' },
  { keys: 'B', description: 'Brush tool', category: 'Tools' },
  { keys: 'E', description: 'Eraser tool', category: 'Tools' },
  { keys: 'T', description: 'Text tool', category: 'Tools' },

  // Layers
  { keys: 'Cmd/Ctrl + K', description: 'Create component from selection', category: 'Components' },

  // View
  { keys: 'Space + Drag', description: 'Pan canvas', category: 'View' },
  { keys: 'Cmd/Ctrl + +', description: 'Zoom in', category: 'View' },
  { keys: 'Cmd/Ctrl + -', description: 'Zoom out', category: 'View' },
  { keys: 'Cmd/Ctrl + 0', description: 'Fit to screen', category: 'View' },
  { keys: 'Cmd/Ctrl + 1', description: 'Zoom to 100%', category: 'View' },

  // Generation
  { keys: 'Cmd/Ctrl + G', description: 'Open generation modal', category: 'AI' },

  // Other
  { keys: '?', description: 'Show keyboard shortcuts', category: 'Help' },
  { keys: 'Cmd/Ctrl + K', description: 'Open command palette', category: 'Help' },
];

export function KeyboardShortcutsModal({ open, onOpenChange }: KeyboardShortcutsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  // Filter shortcuts based on search query
  const filteredShortcuts = shortcuts.filter(
    (shortcut) =>
      shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.keys.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group shortcuts by category
  const groupedShortcuts = filteredShortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  const categories = Object.keys(groupedShortcuts).sort();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
        <div
          className="bg-surface border border-border rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Keyboard Shortcuts</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Quick reference for all keyboard shortcuts
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-accent rounded transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search shortcuts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Shortcuts List */}
          <div className="overflow-y-auto max-h-[calc(80vh-200px)] p-6">
            {categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No shortcuts found matching &quot;{searchQuery}&quot;
              </div>
            ) : (
              <div className="space-y-6">
                {categories.map((category) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {groupedShortcuts[category].map((shortcut, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 px-3 rounded hover:bg-accent transition-colors"
                        >
                          <span className="text-sm text-foreground">
                            {shortcut.description}
                          </span>
                          <kbd className="px-2 py-1 text-xs font-mono bg-background border border-border rounded">
                            {shortcut.keys}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-surface/50">
            <p className="text-xs text-muted-foreground text-center">
              Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-background border border-border rounded">?</kbd> to toggle this dialog •
              <kbd className="px-1.5 py-0.5 text-xs font-mono bg-background border border-border rounded ml-1">Esc</kbd> to close
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
