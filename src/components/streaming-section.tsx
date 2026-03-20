"use client";

import { memo } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

type StreamStatus = "pending" | "streaming" | "complete";

interface StreamingSectionProps {
  title: string;
  icon?: React.ReactNode;
  content?: string | React.ReactNode;
  status?: StreamStatus;
  progress?: number;
  className?: string;
  showProgress?: boolean;
  lineCount?: number;
}

export const StreamingSection = memo(function StreamingSection({
  title,
  icon,
  content,
  status = "pending",
  progress = 0,
  className,
  showProgress = true,
  lineCount = 3,
}: StreamingSectionProps) {
  const isComplete = status === "complete";
  const isStreaming = status === "streaming";
  const isPending = status === "pending";

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        {showProgress && (
          <Badge
            variant={isComplete ? "default" : "secondary"}
            className={cn(
              "ml-auto text-xs",
              isComplete && "bg-primary/20 text-primary"
            )}
          >
            {isComplete ? (
              <Check className="h-3 w-3 mr-1" />
            ) : isStreaming ? (
              `${Math.round(progress)}%`
            ) : (
              "..."
            )}
          </Badge>
        )}
      </div>

      <div className="pl-6 space-y-1.5">
        {isPending && (
          <>
            {Array.from({ length: lineCount }).map((_, i) => (
              <Skeleton
                key={i}
                className={cn("h-4 w-full", i === lineCount - 1 && "w-3/4")}
              />
            ))}
          </>
        )}

        {isStreaming && (
          <>
            <div className="h-4 bg-primary/10 rounded animate-pulse" />
            {typeof content === "string" ? (
              <span className="text-sm text-muted-foreground">{content}</span>
            ) : (
              content
            )}
          </>
        )}

        {isComplete && (
          <>
            {typeof content === "string" ? (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {content}
              </p>
            ) : (
              content
            )}
          </>
        )}
      </div>
    </div>
  );
});
