'use client';

import { useEffect, useState } from 'react';
import { useCanvasStore } from '@/store/canvas-store';
import { Sliders, RotateCw, Sparkles, Eye, SlidersHorizontal, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { ComparisonSlider } from './comparison-slider';
import { CurvesPanel } from './curves-panel';

export function AdjustmentsPanel() {
  const [showCurves, setShowCurves] = useState(false);
  const canvas = useCanvasStore((state) => state.canvas);
  const brightness = useCanvasStore((state) => state.brightness);
  const contrast = useCanvasStore((state) => state.contrast);
  const saturation = useCanvasStore((state) => state.saturation);
  const hueRotation = useCanvasStore((state) => state.hueRotation);
  const temperature = useCanvasStore((state) => state.temperature);
  const blur = useCanvasStore((state) => state.blur);
  const sharpen = useCanvasStore((state) => state.sharpen);
  const vignette = useCanvasStore((state) => state.vignette);
  const filterStrength = useCanvasStore((state) => state.filterStrength);
  const showBeforeAfter = useCanvasStore((state) => state.showBeforeAfter);
  const showComparisonSlider = useCanvasStore((state) => state.showComparisonSlider);
  const setBrightness = useCanvasStore((state) => state.setBrightness);
  const setContrast = useCanvasStore((state) => state.setContrast);
  const setSaturation = useCanvasStore((state) => state.setSaturation);
  const setHueRotation = useCanvasStore((state) => state.setHueRotation);
  const setTemperature = useCanvasStore((state) => state.setTemperature);
  const setBlur = useCanvasStore((state) => state.setBlur);
  const setSharpen = useCanvasStore((state) => state.setSharpen);
  const setVignette = useCanvasStore((state) => state.setVignette);
  const setFilterStrength = useCanvasStore((state) => state.setFilterStrength);
  const setShowBeforeAfter = useCanvasStore((state) => state.setShowBeforeAfter);
  const setShowComparisonSlider = useCanvasStore((state) => state.setShowComparisonSlider);
  const applyPreset = useCanvasStore((state) => state.applyPreset);
  const resetAdjustments = useCanvasStore((state) => state.resetAdjustments);
  const addToHistory = useCanvasStore((state) => state.addToHistory);

  // Apply adjustments to selected object
  useEffect(() => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    // Only apply to image objects
    if (activeObject.type !== 'image') return;

    // If showing before/after, clear all filters
    if (showBeforeAfter) {
      if (activeObject._element) {
        activeObject._element.style.filter = '';
        activeObject._element.style.boxShadow = '';
      }
      canvas.renderAll();
      return;
    }

    // Calculate filter strength multiplier (0-1)
    const strengthMultiplier = filterStrength / 100;

    // Apply filters using CSS filter property
    const filters = [];

    const adjustedBrightness = brightness * strengthMultiplier;
    const adjustedContrast = contrast * strengthMultiplier;
    const adjustedSaturation = saturation * strengthMultiplier;
    const adjustedHueRotation = hueRotation * strengthMultiplier;
    const adjustedTemperature = temperature * strengthMultiplier;
    const adjustedBlur = blur * strengthMultiplier;
    const adjustedSharpen = sharpen * strengthMultiplier;
    const adjustedVignette = vignette * strengthMultiplier;

    if (adjustedBrightness !== 0) {
      filters.push(`brightness(${100 + adjustedBrightness}%)`);
    }

    if (adjustedContrast !== 0) {
      filters.push(`contrast(${100 + adjustedContrast}%)`);
    }

    if (adjustedSaturation !== 0) {
      filters.push(`saturate(${100 + adjustedSaturation}%)`);
    }

    if (adjustedHueRotation !== 0) {
      filters.push(`hue-rotate(${adjustedHueRotation}deg)`);
    }

    // Temperature: Add sepia for warm, invert/sepia for cool
    if (adjustedTemperature !== 0) {
      if (adjustedTemperature > 0) {
        // Warm: Add sepia and adjust hue
        const tempAmount = adjustedTemperature / 100;
        filters.push(`sepia(${tempAmount * 0.3})`);
        filters.push(`hue-rotate(${tempAmount * 10}deg)`);
      } else {
        // Cool: Shift towards blue
        const tempAmount = Math.abs(adjustedTemperature) / 100;
        filters.push(`hue-rotate(${-tempAmount * 10}deg)`);
        filters.push(`saturate(${100 + tempAmount * 20}%)`);
      }
    }

    // Blur: Gaussian blur
    if (adjustedBlur > 0) {
      filters.push(`blur(${adjustedBlur}px)`);
    }

    // Sharpen: Using contrast and brightness (CSS doesn't have sharpen, so we approximate)
    if (adjustedSharpen > 0) {
      const sharpenAmount = adjustedSharpen / 100;
      filters.push(`contrast(${100 + sharpenAmount * 20}%)`);
      filters.push(`brightness(${100 + sharpenAmount * 5}%)`);
    }

    // Apply filter to the image element
    if (activeObject._element) {
      activeObject._element.style.filter = filters.join(' ');
    }

    // Vignette: Apply using box-shadow for a vignette effect
    if (adjustedVignette > 0) {
      // Create a vignette effect using shadow
      const vignetteAmount = adjustedVignette / 100;
      const shadowSize = Math.floor(200 * vignetteAmount);
      if (activeObject._element) {
        activeObject._element.style.boxShadow = `inset 0 0 ${shadowSize}px ${shadowSize / 2}px rgba(0, 0, 0, ${vignetteAmount * 0.8})`;
      }
    } else {
      if (activeObject._element) {
        activeObject._element.style.boxShadow = '';
      }
    }

    canvas.renderAll();
  }, [canvas, brightness, contrast, saturation, hueRotation, temperature, blur, sharpen, vignette, filterStrength, showBeforeAfter]);

  const handleReset = () => {
    resetAdjustments();
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject._element) {
        activeObject._element.style.filter = '';
        activeObject._element.style.boxShadow = '';
      }
      canvas.renderAll();
      addToHistory(JSON.stringify(canvas.toJSON()));
    }
  };

  const handleAdjustmentChange = (setter: (value: number) => void, value: number) => {
    setter(value);
    // Add to history on mouse up (handled by slider onMouseUp)
  };

  const handleMouseUp = () => {
    if (canvas) {
      addToHistory(JSON.stringify(canvas.toJSON()));
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Adjustments</h3>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 hover:bg-accent rounded transition-colors"
            title="Reset all adjustments"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Select an image to adjust
        </p>
      </div>

      {/* Adjustments Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Preset Filters */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <label className="text-sm font-medium text-foreground">
                Preset Filters
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  applyPreset('vintage');
                  if (canvas) addToHistory(JSON.stringify(canvas.toJSON()));
                }}
                className="px-3 py-2 text-xs font-medium bg-accent hover:bg-accent/80 rounded transition-colors"
              >
                Vintage
              </button>
              <button
                onClick={() => {
                  applyPreset('bw');
                  if (canvas) addToHistory(JSON.stringify(canvas.toJSON()));
                }}
                className="px-3 py-2 text-xs font-medium bg-accent hover:bg-accent/80 rounded transition-colors"
              >
                B&W
              </button>
              <button
                onClick={() => {
                  applyPreset('none');
                  if (canvas) addToHistory(JSON.stringify(canvas.toJSON()));
                }}
                className="px-3 py-2 text-xs font-medium bg-accent hover:bg-accent/80 rounded transition-colors"
              >
                None
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border my-4"></div>

          {/* Filter Strength */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Filter Strength
              </label>
              <span className="text-xs font-mono text-muted-foreground bg-accent/50 px-2 py-0.5 rounded">
                {filterStrength}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={filterStrength}
              onChange={(e) => setFilterStrength(parseInt(e.target.value))}
              className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Before/After Toggle */}
          <div className="space-y-2">
            <button
              onClick={() => setShowBeforeAfter(!showBeforeAfter)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded transition-colors ${
                showBeforeAfter
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent hover:bg-accent/80 text-foreground'
              }`}
            >
              <Eye className="w-4 h-4" />
              {showBeforeAfter ? 'Showing Original' : 'Show Before/After'}
            </button>
          </div>

          {/* Comparison Slider Toggle */}
          <div className="space-y-2">
            <button
              onClick={() => setShowComparisonSlider(!showComparisonSlider)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded transition-colors ${
                showComparisonSlider
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent hover:bg-accent/80 text-foreground'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showComparisonSlider ? 'Hide Comparison' : 'Compare Before/After'}
            </button>

            {/* Comparison Slider Component */}
            <ComparisonSlider isActive={showComparisonSlider} />
          </div>

          {/* Divider */}
          <div className="border-t border-border my-4"></div>

          {/* Brightness */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Brightness
              </label>
              <span className="text-xs font-mono text-muted-foreground bg-accent/50 px-2 py-0.5 rounded">
                {brightness > 0 ? '+' : ''}{brightness}
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={brightness}
              onChange={(e) => handleAdjustmentChange(setBrightness, parseInt(e.target.value))}
              onMouseUp={handleMouseUp}
              onTouchEnd={handleMouseUp}
              className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Darker</span>
              <span>Brighter</span>
            </div>
          </div>

          {/* Contrast */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Contrast
              </label>
              <span className="text-xs font-mono text-muted-foreground bg-accent/50 px-2 py-0.5 rounded">
                {contrast > 0 ? '+' : ''}{contrast}
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={contrast}
              onChange={(e) => handleAdjustmentChange(setContrast, parseInt(e.target.value))}
              onMouseUp={handleMouseUp}
              onTouchEnd={handleMouseUp}
              className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Less</span>
              <span>More</span>
            </div>
          </div>

          {/* Saturation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Saturation
              </label>
              <span className="text-xs font-mono text-muted-foreground bg-accent/50 px-2 py-0.5 rounded">
                {saturation > 0 ? '+' : ''}{saturation}
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={saturation}
              onChange={(e) => handleAdjustmentChange(setSaturation, parseInt(e.target.value))}
              onMouseUp={handleMouseUp}
              onTouchEnd={handleMouseUp}
              className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Grayscale</span>
              <span>Vibrant</span>
            </div>
          </div>

          {/* Hue Rotation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Hue Rotation
              </label>
              <span className="text-xs font-mono text-muted-foreground bg-accent/50 px-2 py-0.5 rounded">
                {hueRotation}°
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={hueRotation}
              onChange={(e) => handleAdjustmentChange(setHueRotation, parseInt(e.target.value))}
              onMouseUp={handleMouseUp}
              onTouchEnd={handleMouseUp}
              className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0°</span>
              <span>180°</span>
              <span>360°</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border my-4"></div>

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Temperature
              </label>
              <span className="text-xs font-mono text-muted-foreground bg-accent/50 px-2 py-0.5 rounded">
                {temperature > 0 ? '+' : ''}{temperature}
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={temperature}
              onChange={(e) => handleAdjustmentChange(setTemperature, parseInt(e.target.value))}
              onMouseUp={handleMouseUp}
              onTouchEnd={handleMouseUp}
              className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Cool</span>
              <span>Warm</span>
            </div>
          </div>

          {/* Blur */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Blur
              </label>
              <span className="text-xs font-mono text-muted-foreground bg-accent/50 px-2 py-0.5 rounded">
                {blur}px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={blur}
              onChange={(e) => handleAdjustmentChange(setBlur, parseInt(e.target.value))}
              onMouseUp={handleMouseUp}
              onTouchEnd={handleMouseUp}
              className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0px</span>
              <span>20px</span>
            </div>
          </div>

          {/* Sharpen */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Sharpen
              </label>
              <span className="text-xs font-mono text-muted-foreground bg-accent/50 px-2 py-0.5 rounded">
                {sharpen}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sharpen}
              onChange={(e) => handleAdjustmentChange(setSharpen, parseInt(e.target.value))}
              onMouseUp={handleMouseUp}
              onTouchEnd={handleMouseUp}
              className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>None</span>
              <span>Max</span>
            </div>
          </div>

          {/* Vignette */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Vignette
              </label>
              <span className="text-xs font-mono text-muted-foreground bg-accent/50 px-2 py-0.5 rounded">
                {vignette}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={vignette}
              onChange={(e) => handleAdjustmentChange(setVignette, parseInt(e.target.value))}
              onMouseUp={handleMouseUp}
              onTouchEnd={handleMouseUp}
              className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>None</span>
              <span>Strong</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border my-4"></div>

          {/* Curves Adjustment Section */}
          <div className="space-y-3">
            <button
              onClick={() => setShowCurves(!showCurves)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium bg-accent hover:bg-accent/80 rounded transition-colors"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Curves Adjustment</span>
              </div>
              {showCurves ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showCurves && (
              <div className="mt-3">
                <CurvesPanel />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with tip */}
      <div className="p-3 border-t border-border bg-surface/50">
        <p className="text-xs text-muted-foreground">
          💡 Adjustments apply to selected image in real-time
        </p>
      </div>
    </div>
  );
}
