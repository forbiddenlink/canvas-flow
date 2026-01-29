'use client';

import { useState } from 'react';
import { X, Download } from 'lucide-react';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canvas: fabric.Canvas | null;
}

type ExportFormat = 'png' | 'jpeg' | 'webp';

export function ExportModal({ open, onOpenChange, canvas }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [quality, setQuality] = useState(90);
  const [transparency, setTransparency] = useState(true);
  const [scale, setScale] = useState(1);

  if (!open) return null;

  const handleExport = () => {
    if (!canvas) return;

    // Determine the multiplier based on scale
    const multiplier = scale;

    // Export based on format
    let dataURL: string;

    if (format === 'png') {
      dataURL = canvas.toDataURL({
        format: 'png',
        multiplier,
        enableRetinaScaling: false,
      });
    } else if (format === 'jpeg') {
      dataURL = canvas.toDataURL({
        format: 'jpeg',
        quality: quality / 100,
        multiplier,
        enableRetinaScaling: false,
      });
    } else if (format === 'webp') {
      dataURL = canvas.toDataURL({
        format: 'webp',
        quality: quality / 100,
        multiplier,
        enableRetinaScaling: false,
      });
    } else {
      return;
    }

    // Create download link
    const link = document.createElement('a');
    link.download = `pixelforge-export-${Date.now()}.${format}`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Close modal
    onOpenChange(false);
  };

  const estimatedSize = () => {
    if (!canvas) return 'Unknown';
    const width = (canvas.width ?? 1024) * scale;
    const height = (canvas.height ?? 768) * scale;
    const pixels = width * height;

    let bytes: number;
    if (format === 'png') {
      bytes = pixels * 4; // RGBA
    } else {
      bytes = pixels * 3 * (quality / 100); // RGB with quality
    }

    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      return `~${(bytes / 1024).toFixed(0)} KB`;
    }
    return `~${mb.toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Export Image</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setFormat('png')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  format === 'png'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-semibold">PNG</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Lossless
                </div>
              </button>
              <button
                onClick={() => setFormat('jpeg')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  format === 'jpeg'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-semibold">JPEG</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Smaller
                </div>
              </button>
              <button
                onClick={() => setFormat('webp')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  format === 'webp'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-semibold">WebP</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Modern
                </div>
              </button>
            </div>
          </div>

          {/* Quality Slider (for JPEG and WebP) */}
          {(format === 'jpeg' || format === 'webp') && (
            <div>
              <label className="block text-sm font-medium mb-3">
                Quality: {quality}%
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Lower size</span>
                <span>Higher quality</span>
              </div>
            </div>
          )}

          {/* Transparency Option (PNG only) */}
          {format === 'png' && (
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={transparency}
                  onChange={(e) => setTransparency(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm font-medium">
                  Preserve transparency
                </span>
              </label>
              <p className="text-xs text-muted-foreground mt-2">
                Transparent areas will be preserved in the exported image
              </p>
            </div>
          )}

          {/* Resolution Scale */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Resolution Scale: {scale}x
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className={`p-2 rounded border-2 transition-colors ${
                    scale === s
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
            {canvas && (
              <p className="text-xs text-muted-foreground mt-2">
                Output size: {(canvas.width ?? 1024) * scale} × {(canvas.height ?? 768) * scale}px
              </p>
            )}
          </div>

          {/* Estimated File Size */}
          <div className="p-4 bg-accent/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Estimated file size</span>
              <span className="text-sm font-semibold">{estimatedSize()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
