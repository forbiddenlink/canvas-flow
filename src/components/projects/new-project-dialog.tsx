'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CanvasPreset {
  name: string;
  width: number;
  height: number;
  description: string;
}

const CANVAS_PRESETS: CanvasPreset[] = [
  { name: 'HD (1920x1080)', width: 1920, height: 1080, description: '16:9 - HD video, presentations' },
  { name: 'Square (1080x1080)', width: 1080, height: 1080, description: '1:1 - Instagram posts' },
  { name: '4K (3840x2160)', width: 3840, height: 2160, description: '16:9 - 4K video' },
  { name: 'Social Banner (1200x630)', width: 1200, height: 630, description: 'Twitter, Facebook header' },
  { name: 'Story (1080x1920)', width: 1080, height: 1920, description: '9:16 - Instagram story' },
  { name: 'A4 Portrait (2480x3508)', width: 2480, height: 3508, description: 'Print - A4 size @ 300dpi' },
  { name: 'Desktop (1024x768)', width: 1024, height: 768, description: '4:3 - Default canvas' },
  { name: 'Custom', width: 1024, height: 768, description: 'Set your own dimensions' },
];

export function NewProjectDialog({ open, onOpenChange }: NewProjectDialogProps) {
  const router = useRouter();
  const [projectName, setProjectName] = useState('Untitled Project');
  const [selectedPreset, setSelectedPreset] = useState<string>('Desktop (1024x768)');
  const [customWidth, setCustomWidth] = useState('1024');
  const [customHeight, setCustomHeight] = useState('768');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    setError('');

    // Get dimensions
    let width: number;
    let height: number;

    if (selectedPreset === 'Custom') {
      width = parseInt(customWidth);
      height = parseInt(customHeight);

      // Validate custom dimensions
      if (isNaN(width) || isNaN(height) || width < 1 || height < 1) {
        setError('Please enter valid dimensions (minimum 1x1)');
        return;
      }

      if (width > 8000 || height > 8000) {
        setError('Maximum canvas size is 8000x8000 pixels');
        return;
      }
    } else {
      const preset = CANVAS_PRESETS.find(p => p.name === selectedPreset);
      if (!preset) {
        setError('Invalid preset selected');
        return;
      }
      width = preset.width;
      height = preset.height;
    }

    // Validate project name
    if (!projectName.trim()) {
      setError('Please enter a project name');
      return;
    }

    try {
      setIsCreating(true);

      // Create project in database
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectName.trim(),
          width,
          height,
          canvasData: JSON.stringify({
            version: '5.3.0',
            objects: [],
          }),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const data = await response.json();

      // Navigate to editor with new project
      router.push(`/editor?projectId=${data.project.id}&width=${width}&height=${height}`);

      // Close dialog
      onOpenChange(false);
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName);
    const preset = CANVAS_PRESETS.find(p => p.name === presetName);
    if (preset && presetName !== 'Custom') {
      setCustomWidth(preset.width.toString());
      setCustomHeight(preset.height.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isCreating) {
      handleCreate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Choose a canvas size and give your project a name
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Name Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name..."
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Canvas Size Presets */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Canvas Size
            </label>
            <div className="grid grid-cols-2 gap-3">
              {CANVAS_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetChange(preset.name)}
                  className={`p-3 rounded-md border-2 text-left transition-all ${
                    selectedPreset === preset.name
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 bg-card'
                  }`}
                >
                  <div className="font-medium text-sm text-foreground">
                    {preset.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {preset.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Dimensions */}
          {selectedPreset === 'Custom' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Custom Dimensions (pixels)
              </label>
              <div className="flex gap-3 items-center">
                <div className="flex-1">
                  <input
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(e.target.value)}
                    placeholder="Width"
                    min="1"
                    max="8000"
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <div className="text-xs text-muted-foreground mt-1">Width</div>
                </div>
                <span className="text-muted-foreground">×</span>
                <div className="flex-1">
                  <input
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(e.target.value)}
                    placeholder="Height"
                    min="1"
                    max="8000"
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <div className="text-xs text-muted-foreground mt-1">Height</div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
            className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
            {isCreating ? 'Creating...' : 'Create Project'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
