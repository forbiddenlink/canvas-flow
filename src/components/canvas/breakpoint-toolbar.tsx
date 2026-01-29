"use client";

import { Smartphone, Tablet, Monitor, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCanvasStore } from "@/store/canvas-store";
import { Breakpoint, BREAKPOINT_WIDTHS } from "@/types";
import { cn } from "@/lib/utils";

const breakpoints: { value: Breakpoint; icon: typeof Smartphone; label: string; width: number }[] = [
  { value: "mobile", icon: Smartphone, label: "Mobile", width: BREAKPOINT_WIDTHS.mobile },
  { value: "tablet", icon: Tablet, label: "Tablet", width: BREAKPOINT_WIDTHS.tablet },
  { value: "desktop", icon: Monitor, label: "Desktop", width: BREAKPOINT_WIDTHS.desktop },
  { value: "wide", icon: Maximize, label: "Wide", width: BREAKPOINT_WIDTHS.wide },
];

export function BreakpointToolbar() {
  const currentBreakpoint = useCanvasStore((state) => state.currentBreakpoint);
  const setCurrentBreakpoint = useCanvasStore((state) => state.setCurrentBreakpoint);
  const canvas = useCanvasStore((state) => state.canvas);

  const handleBreakpointChange = (breakpoint: Breakpoint) => {
    setCurrentBreakpoint(breakpoint);
    
    // Resize canvas to match breakpoint
    const width = BREAKPOINT_WIDTHS[breakpoint];
    if (canvas) {
      // Update canvas dimensions based on breakpoint
      canvas.setWidth(width);
      canvas.renderAll();
    }
  };

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-background border rounded-lg">
      <span className="text-xs text-muted-foreground mr-2">Breakpoint:</span>
      {breakpoints.map(({ value, icon: Icon, label, width }) => (
        <Button
          key={value}
          variant={currentBreakpoint === value ? "default" : "ghost"}
          size="sm"
          onClick={() => handleBreakpointChange(value)}
          className={cn(
            "gap-1.5",
            currentBreakpoint === value && "bg-primary text-primary-foreground"
          )}
          title={`${label} (${width}px)`}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="text-xs">{label}</span>
          <span className="text-[10px] opacity-70">{width}px</span>
        </Button>
      ))}
    </div>
  );
}
