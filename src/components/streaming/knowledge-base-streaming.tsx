"use client";

import { memo } from "react";
import { BrainCircuit } from "lucide-react";
import { ProgressRing } from "@/components/progress-ring";
import { Skeleton } from "@/components/ui/skeleton";
import type { StreamPhase } from "@/hooks/use-streaming";

interface KnowledgeBaseStreamingProps {
  phase: StreamPhase;
  overallProgress: number;
  question?: string;
}

export const KnowledgeBaseStreaming = memo(function KnowledgeBaseStreaming({
  phase,
  overallProgress,
  question = "",
}: KnowledgeBaseStreamingProps) {
  const isStreaming = phase === "streaming" || phase === "generating";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-headline text-lg font-semibold flex items-center gap-2">
            {isStreaming ? (
              <>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <span>Finding answer...</span>
              </>
            ) : (
              <span>Simple Answer</span>
            )}
          </h3>
          {question && (
            <p className="text-sm text-muted-foreground">
              Q: {question}
            </p>
          )}
        </div>
        <ProgressRing progress={overallProgress} size={56} />
      </div>

      {/* Answer Content - Same layout as actual */}
      <div className="prose prose-lg max-w-none rounded-md border bg-muted p-6 dark:prose-invert">
        {isStreaming ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <div className="my-4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/6" />
            <div className="my-4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        ) : (
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>
        )}
      </div>

      {/* Footer */}
      {isStreaming && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Searching knowledge base...</span>
        </div>
      )}
    </div>
  );
});
