'use client';

interface RotationIndicatorProps {
  angle: number;
  x: number;
  y: number;
  visible: boolean;
}

export function RotationIndicator({ angle, x, y, visible }: RotationIndicatorProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 bg-black/80 text-white px-3 py-2 rounded-md text-sm font-medium shadow-lg"
      style={{
        left: `${x}px`,
        top: `${y - 40}px`, // Position above the cursor
        transform: 'translateX(-50%)',
      }}
    >
      {angle.toFixed(1)}°
    </div>
  );
}
