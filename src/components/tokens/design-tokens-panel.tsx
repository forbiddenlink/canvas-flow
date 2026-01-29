/**
 * Design Tokens Panel
 * Manage design tokens (colors, text styles, effects)
 */

'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCanvasStore } from '@/store/canvas-store';

export function DesignTokensPanel() {
  const { designTokens, addColorToken, addTextStyleToken } = useCanvasStore();
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'effects'>('colors');
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [isAddingText, setIsAddingText] = useState(false);
  const [newColorName, setNewColorName] = useState('');
  const [newColorValue, setNewColorValue] = useState('#000000');
  const [newTextName, setNewTextName] = useState('');
  const [newTextSize, setNewTextSize] = useState('16');
  const [newTextFamily, setNewTextFamily] = useState('Inter');

  const handleAddColor = () => {
    if (newColorName.trim()) {
      addColorToken(newColorName, newColorValue, 'color');
      setNewColorName('');
      setNewColorValue('#000000');
      setIsAddingColor(false);
    }
  };

  const handleAddTextStyle = () => {
    if (newTextName.trim()) {
      addTextStyleToken(newTextName, {
        fontSize: parseInt(newTextSize),
        fontFamily: newTextFamily,
        fontWeight: 400,
        lineHeight: 1.5,
      });
      setNewTextName('');
      setNewTextSize('16');
      setNewTextFamily('Inter');
      setIsAddingText(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Design Tokens</h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex">
          <button
            onClick={() => setActiveTab('colors')}
            className={`flex-1 px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'colors'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Colors
          </button>
          <button
            onClick={() => setActiveTab('typography')}
            className={`flex-1 px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'typography'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Typography
          </button>
          <button
            onClick={() => setActiveTab('effects')}
            className={`flex-1 px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'effects'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Effects
          </button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <>
              {designTokens.colors.map((color) => (
                <div
                  key={color.id}
                  className="flex items-center gap-2 p-2 rounded border border-border hover:border-primary/50 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded border border-border flex-shrink-0"
                    style={{ backgroundColor: color.value }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {color.name}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {color.value}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add Color Form */}
              {isAddingColor ? (
                <div className="p-3 rounded border-2 border-dashed border-primary space-y-2">
                  <Input
                    placeholder="Color name (e.g., Primary Blue)"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddColor()}
                  />
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newColorValue}
                      onChange={(e) => setNewColorValue(e.target.value)}
                      className="w-12 h-8 rounded cursor-pointer"
                    />
                    <Input
                      value={newColorValue}
                      onChange={(e) => setNewColorValue(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddColor} size="sm" className="flex-1">
                      <Check className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                    <Button
                      onClick={() => setIsAddingColor(false)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setIsAddingColor(true)}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Color
                </Button>
              )}

              {/* Empty State */}
              {designTokens.colors.length === 0 && !isAddingColor && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No colors yet. Add your first color token.
                </div>
              )}
            </>
          )}

          {/* Typography Tab */}
          {activeTab === 'typography' && (
            <>
              {designTokens.textStyles.map((style) => (
                <div
                  key={style.id}
                  className="flex items-center gap-2 p-3 rounded border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {style.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {style.fontFamily} · {style.fontSize}px · {style.fontWeight}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add Text Style Form */}
              {isAddingText ? (
                <div className="p-3 rounded border-2 border-dashed border-primary space-y-2">
                  <Input
                    placeholder="Style name (e.g., Heading 1)"
                    value={newTextName}
                    onChange={(e) => setNewTextName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTextStyle()}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Size (px)"
                      value={newTextSize}
                      onChange={(e) => setNewTextSize(e.target.value)}
                    />
                    <Input
                      placeholder="Font family"
                      value={newTextFamily}
                      onChange={(e) => setNewTextFamily(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddTextStyle} size="sm" className="flex-1">
                      <Check className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                    <Button
                      onClick={() => setIsAddingText(false)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setIsAddingText(true)}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Text Style
                </Button>
              )}

              {/* Empty State */}
              {designTokens.textStyles.length === 0 && !isAddingText && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No text styles yet. Add your first typography token.
                </div>
              )}
            </>
          )}

          {/* Effects Tab */}
          {activeTab === 'effects' && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              Effects tokens coming soon
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
