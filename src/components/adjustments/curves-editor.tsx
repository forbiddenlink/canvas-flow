'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

interface CurvesEditorProps {
  channel: 'rgb' | 'r' | 'g' | 'b';
  points: Point[];
  onChange: (points: Point[]) => void;
}

export function CurvesEditor({ channel, points, onChange }: CurvesEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const width = 256;
  const height = 256;
  const gridSize = 64;
  const pointRadius = 6;

  // Get channel color
  const getChannelColor = () => {
    switch (channel) {
      case 'r': return '#ef4444'; // red
      case 'g': return '#10b981'; // green
      case 'b': return '#3b82f6'; // blue
      default: return '#a855f7'; // purple for RGB
    }
  };

  // Calculate curve value at x using Catmull-Rom spline interpolation
  const calculateCurveValue = useCallback((x: number, pts: Point[]): number => {
    // Sort points by x
    const sortedPoints = [...pts].sort((a, b) => a.x - b.x);

    // Find the segment containing x
    for (let i = 0; i < sortedPoints.length - 1; i++) {
      const p1 = sortedPoints[i];
      const p2 = sortedPoints[i + 1];

      if (x >= p1.x && x <= p2.x) {
        // Linear interpolation between points
        const t = (x - p1.x) / (p2.x - p1.x);
        return p1.y + (p2.y - p1.y) * t;
      }
    }

    // If x is outside the range, extrapolate
    if (x < sortedPoints[0].x) return sortedPoints[0].y;
    return sortedPoints[sortedPoints.length - 1].y;
  }, []);

  // Draw the curves editor
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#18181b'; // zinc-900
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#27272a'; // zinc-800
    ctx.lineWidth = 1;
    for (let i = 0; i <= width; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw diagonal reference line
    ctx.strokeStyle = '#3f3f46'; // zinc-700
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width, 0);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw the curve
    ctx.strokeStyle = getChannelColor();
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 0; x <= width; x++) {
      const y = height - calculateCurveValue(x, points);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw control points
    points.forEach((point, index) => {
      const isHovered = hoveredIndex === index;
      const isDragged = dragIndex === index;

      ctx.fillStyle = isDragged ? '#ffffff' : (isHovered ? '#e4e4e7' : getChannelColor());
      ctx.beginPath();
      ctx.arc(point.x, height - point.y, pointRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw point outline
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [points, dragIndex, hoveredIndex, calculateCurveValue, getChannelColor]);

  // Redraw on changes
  useEffect(() => {
    draw();
  }, [draw]);

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = height - (e.clientY - rect.top);

    // Check if clicking near a point
    const clickedIndex = points.findIndex(
      (point) => Math.hypot(point.x - x, point.y - y) <= pointRadius + 5
    );

    if (clickedIndex !== -1) {
      setDragIndex(clickedIndex);
    } else {
      // Add new point
      const newPoints = [...points, { x, y }].sort((a, b) => a.x - b.x);
      onChange(newPoints);
    }
  };

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(height, height - (e.clientY - rect.top)));

    if (dragIndex !== null) {
      // Don't allow moving first or last point horizontally
      const isEndpoint = dragIndex === 0 || dragIndex === points.length - 1;
      const newPoints = [...points];
      newPoints[dragIndex] = {
        x: isEndpoint ? points[dragIndex].x : x,
        y: y,
      };
      onChange(newPoints);
    } else {
      // Check for hover
      const hoverIndex = points.findIndex(
        (point) => Math.hypot(point.x - x, height - point.y - (e.clientY - rect.top)) <= pointRadius + 5
      );
      setHoveredIndex(hoverIndex !== -1 ? hoverIndex : null);
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setDragIndex(null);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setDragIndex(null);
    setHoveredIndex(null);
  };

  // Handle double click to remove point
  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = height - (e.clientY - rect.top);

    const clickedIndex = points.findIndex(
      (point) => Math.hypot(point.x - x, point.y - y) <= pointRadius + 5
    );

    // Don't allow removing first or last point
    if (clickedIndex !== -1 && clickedIndex !== 0 && clickedIndex !== points.length - 1) {
      const newPoints = points.filter((_, index) => index !== clickedIndex);
      onChange(newPoints);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
      className="cursor-crosshair rounded border border-border"
      style={{ width: '100%', height: 'auto' }}
    />
  );
}
