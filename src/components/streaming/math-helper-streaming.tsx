"use client";

import { memo } from "react";
import { Calculator } from "lucide-react";
import { ProgressRing } from "@/components/progress-ring";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Lightbulb, BookOpen } from "lucide-react";

interface MathHelperStreamingProps {
  overallProgress: number;
}

export const MathHelperStreaming = memo(function MathHelperStreaming({
  overallProgress,
}: MathHelperStreamingProps) {
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
            <span>Solving math problem...</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Step-by-step solution
          </p>
        </div>
        <ProgressRing progress={overallProgress} size={56} />
      </div>

      {/* Solution Cards - Same layout as actual */}
      <div className="space-y-4">
        {/* Solution Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Solution</h4>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-full animate-pulse" />
              <Skeleton className="h-6 w-5/6 animate-pulse" />
              <Skeleton className="h-6 w-4/6 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* Steps Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Steps</h4>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex gap-3">
                  <Badge variant="outline" className="shrink-0">
                    {step}
                  </Badge>
                  <Skeleton className="h-5 flex-1 animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Explanation Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Explanation</h4>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full animate-pulse" />
              <Skeleton className="h-4 w-full animate-pulse" />
              <Skeleton className="h-4 w-5/6 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span>Calculating solution...</span>
      </div>
    </div>
  );
});
