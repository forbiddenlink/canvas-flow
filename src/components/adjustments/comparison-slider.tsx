'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useCanvasStore } from '@/store/canvas-store';

interface ComparisonSliderProps {
  isActive: boolean;
}

export function ComparisonSlider({ isActive }: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // 0-100%
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvas = useCanvasStore((state) => state.canvas);

  // Handle mouse/touch drag
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current || !isDragging) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, [isDragging]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  }, [handleMove]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
    return undefined;
  }, [isDragging, handleMouseMove, handleTouchMove, handleMouseUp]);

  // Apply clip-path to canvas based on slider position
  useEffect(() => {
    if (!canvas || !isActive) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'image') return;

    // Store original state if not already stored
    if (!activeObject.data) {
      activeObject.data = {};
    }
    if (!activeObject.data.originalFilters && activeObject._element) {
      activeObject.data.originalFilters = activeObject._element.style.filter;
    }

    // Apply clip-path to show edited on right, original on left
    if (activeObject._element) {
      const clipPercentage = sliderPosition;

      // Create a wrapper effect by using clip-path
      // Right side (edited): show from sliderPosition to 100%
      // This is a simplified version - in production you'd want two layers
      activeObject._element.style.clipPath = `inset(0 ${100 - clipPercentage}% 0 0)`;
    }

    canvas.renderAll();

    // Cleanup on unmount or when slider is disabled
    return () => {
      if (activeObject._element && activeObject.data?.originalFilters !== undefined) {
        activeObject._element.style.clipPath = '';
      }
    };
  }, [canvas, isActive, sliderPosition]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-8 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-col-resize mt-4"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* Track background */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-full shadow-lg cursor-col-resize transition-transform hover:scale-110"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Drag indicator lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-0.5 h-3 bg-blue-500 mx-px"></div>
          <div className="w-0.5 h-3 bg-blue-500"></div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute -bottom-5 left-0 text-xs text-gray-500 dark:text-gray-400">
        Before
      </div>
      <div className="absolute -bottom-5 right-0 text-xs text-gray-500 dark:text-gray-400">
        After
      </div>
    </div>
  );
}
