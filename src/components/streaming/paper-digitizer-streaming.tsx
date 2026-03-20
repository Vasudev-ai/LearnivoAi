"use client";

import { memo } from "react";
import { FileText } from "lucide-react";
import { ProgressRing } from "@/components/progress-ring";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface PaperDigitizerStreamingProps {
  overallProgress: number;
  fileName?: string;
}

export const PaperDigitizerStreaming = memo(function PaperDigitizerStreaming({
  overallProgress,
  fileName = "document.jpg",
}: PaperDigitizerStreamingProps) {
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
            <span>Digitizing paper...</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Processing {fileName}
          </p>
        </div>
        <ProgressRing progress={overallProgress} size={56} />
      </div>

      {/* File Status */}
      <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted">
        <FileText className="h-10 w-10 text-primary" />
        <div className="flex-1">
          <p className="font-medium">{fileName}</p>
          <p className="text-sm text-muted-foreground">Processing...</p>
        </div>
        <Badge variant="secondary" className="animate-pulse">
          {Math.round(overallProgress)}%
        </Badge>
      </div>

      {/* Content Preview - Same layout as actual */}
      <div className="prose prose-sm max-w-none rounded-md border bg-muted p-4 dark:prose-invert">
        <div className="space-y-3">
          <Skeleton className="h-5 w-full animate-pulse" />
          <Skeleton className="h-5 w-full animate-pulse" />
          <Skeleton className="h-5 w-5/6 animate-pulse" />
          <div className="my-4" />
          <Skeleton className="h-5 w-full animate-pulse" />
          <Skeleton className="h-5 w-full animate-pulse" />
          <Skeleton className="h-5 w-4/6 animate-pulse" />
          <div className="my-4" />
          <Skeleton className="h-5 w-full animate-pulse" />
          <Skeleton className="h-5 w-3/4 animate-pulse" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span>Digitizing and formatting content...</span>
      </div>
    </div>
  );
});
