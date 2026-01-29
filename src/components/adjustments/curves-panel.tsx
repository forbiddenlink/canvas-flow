'use client';

import { useState } from 'react';
import { useCanvasStore, CurvePoint } from '@/store/canvas-store';
import { CurvesEditor } from './curves-editor';

export function CurvesPanel() {
  const [activeChannel, setActiveChannel] = useState<'rgb' | 'r' | 'g' | 'b'>('rgb');

  const curvesRgb = useCanvasStore((state) => state.curvesRgb);
  const curvesRed = useCanvasStore((state) => state.curvesRed);
  const curvesGreen = useCanvasStore((state) => state.curvesGreen);
  const curvesBlue = useCanvasStore((state) => state.curvesBlue);

  const setCurvesRgb = useCanvasStore((state) => state.setCurvesRgb);
  const setCurvesRed = useCanvasStore((state) => state.setCurvesRed);
  const setCurvesGreen = useCanvasStore((state) => state.setCurvesGreen);
  const setCurvesBlue = useCanvasStore((state) => state.setCurvesBlue);

  const getCurrentPoints = (): CurvePoint[] => {
    switch (activeChannel) {
      case 'r': return curvesRed;
      case 'g': return curvesGreen;
      case 'b': return curvesBlue;
      default: return curvesRgb;
    }
  };

  const setCurrentPoints = (points: CurvePoint[]) => {
    switch (activeChannel) {
      case 'r': setCurvesRed(points); break;
      case 'g': setCurvesGreen(points); break;
      case 'b': setCurvesBlue(points); break;
      default: setCurvesRgb(points); break;
    }
  };

  const resetCurrentChannel = () => {
    const defaultPoints: CurvePoint[] = [{ x: 0, y: 0 }, { x: 256, y: 256 }];
    setCurrentPoints(defaultPoints);
  };

  return (
    <div className="space-y-4">
      {/* Channel Selector */}
      <div>
        <label className="text-xs font-medium text-foreground mb-2 block">
          Channel
        </label>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => setActiveChannel('rgb')}
            className={`px-3 py-2 text-xs font-medium rounded transition-colors ${
              activeChannel === 'rgb'
                ? 'bg-primary text-primary-foreground'
                : 'bg-accent hover:bg-accent/80'
            }`}
          >
            RGB
          </button>
          <button
            onClick={() => setActiveChannel('r')}
            className={`px-3 py-2 text-xs font-medium rounded transition-colors ${
              activeChannel === 'r'
                ? 'bg-red-500 text-white'
                : 'bg-accent hover:bg-accent/80'
            }`}
          >
            R
          </button>
          <button
            onClick={() => setActiveChannel('g')}
            className={`px-3 py-2 text-xs font-medium rounded transition-colors ${
              activeChannel === 'g'
                ? 'bg-green-500 text-white'
                : 'bg-accent hover:bg-accent/80'
            }`}
          >
            G
          </button>
          <button
            onClick={() => setActiveChannel('b')}
            className={`px-3 py-2 text-xs font-medium rounded transition-colors ${
              activeChannel === 'b'
                ? 'bg-blue-500 text-white'
                : 'bg-accent hover:bg-accent/80'
            }`}
          >
            B
          </button>
        </div>
      </div>

      {/* Curves Editor Canvas */}
      <div>
        <CurvesEditor
          channel={activeChannel}
          points={getCurrentPoints()}
          onChange={setCurrentPoints}
        />
      </div>

      {/* Instructions */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• <span className="font-semibold text-foreground">Click</span> to add control points</p>
        <p>• <span className="font-semibold text-foreground">Drag</span> points to adjust curve</p>
        <p>• <span className="font-semibold text-foreground">Double-click</span> to remove points</p>
        <p>• <span className="font-semibold text-foreground">S-curve</span> increases contrast</p>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetCurrentChannel}
        className="w-full px-4 py-2 text-sm font-medium bg-accent hover:bg-accent/80 rounded transition-colors"
      >
        Reset {activeChannel.toUpperCase()} Channel
      </button>
    </div>
  );
}
