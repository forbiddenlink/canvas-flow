'use client';

import { useEffect, useRef, useState } from 'react';

interface ResizeHandleProps {
  onResize: (delta: number) => void;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export function ResizeHandle({
  onResize,
  orientation = 'vertical',
  className = '',
}: ResizeHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const startPosRef = useRef(0);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = orientation === 'vertical' ? e.clientX - startPosRef.current : e.clientY - startPosRef.current;
      startPosRef.current = orientation === 'vertical' ? e.clientX : e.clientY;
      onResize(delta);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onResize, orientation]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startPosRef.current = orientation === 'vertical' ? e.clientX : e.clientY;
    setIsDragging(true);
  };

  return (
    <div
      className={`${
        orientation === 'vertical'
          ? 'w-1 hover:w-1.5 cursor-col-resize'
          : 'h-1 hover:h-1.5 cursor-row-resize'
      } bg-border hover:bg-primary/50 transition-all duration-150 ${
        isDragging ? 'bg-primary' : ''
      } ${className}`}
      onMouseDown={handleMouseDown}
      role="separator"
      aria-orientation={orientation}
      aria-label={`Resize ${orientation === 'vertical' ? 'horizontally' : 'vertically'}`}
    />
  );
}
