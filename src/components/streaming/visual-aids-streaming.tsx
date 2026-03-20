"use client";

import { memo } from "react";
import { Layers } from "lucide-react";
import { ProgressRing } from "@/components/progress-ring";
import { Skeleton } from "@/components/ui/skeleton";

interface VisualAidsStreamingProps {
  overallProgress: number;
  concept?: string;
  visualType?: string;
}

export const VisualAidsStreaming = memo(function VisualAidsStreaming({
  overallProgress,
  concept = "",
  visualType = "Simple Drawing",
}: VisualAidsStreamingProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-headline text-lg font-semibold flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span>Creating visual...</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            {visualType} for {concept || "your concept"}
          </p>
        </div>
        <ProgressRing progress={overallProgress} size={56} />
      </div>

      {/* SVG Preview Area - Same layout as actual */}
      <div className="w-full h-96 p-4 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
        <div className="text-center space-y-4">
          {/* Drawing Animation */}
          <div className="relative w-32 h-32 mx-auto">
            <Skeleton className="w-full h-full rounded-lg animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Layers className="h-16 w-16 text-slate-600 animate-pulse" />
            </div>
          </div>

          {/* Progress Text */}
          <div className="space-y-2">
            <p className="text-slate-400 text-sm">Generating your {visualType}...</p>
            <div className="w-48 h-1 bg-slate-700 rounded-full overflow-hidden mx-auto">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-slate-500 text-xs">{Math.round(overallProgress)}% complete</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span>Creating visual aid...</span>
      </div>
    </div>
  );
});
