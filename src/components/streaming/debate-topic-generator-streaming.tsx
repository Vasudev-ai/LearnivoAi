"use client";

import { memo } from "react";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressRing } from "@/components/progress-ring";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface DebateTopicGeneratorStreamingProps {
  overallProgress: number;
  topicCount?: number;
}

export const DebateTopicGeneratorStreaming = memo(function DebateTopicGeneratorStreaming({
  overallProgress,
  topicCount = 5,
}: DebateTopicGeneratorStreamingProps) {
  const getCurrentTopic = () => {
    const progressPerTopic = 100 / topicCount;
    const currentTopic = Math.floor(overallProgress / progressPerTopic);
    return Math.min(currentTopic, topicCount - 1);
  };

  const currentTopic = getCurrentTopic();

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
            <span>Generating debate topics...</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            {topicCount} engaging topics with arguments
          </p>
        </div>
        <ProgressRing progress={overallProgress} size={56} />
      </div>

      {/* Topics Accordion - Same layout as actual */}
      <Accordion type="single" collapsible className="w-full">
        {Array.from({ length: topicCount }).map((_, index) => {
          const isComplete = index < currentTopic;
          const isCurrent = index === currentTopic;
          const isPending = index > currentTopic;

          return (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={isComplete ? "default" : isCurrent ? "secondary" : "outline"}
                    className={cn(
                      isComplete && "bg-primary/20 text-primary",
                      isCurrent && "bg-primary text-primary-foreground animate-pulse"
                    )}
                  >
                    {isComplete ? "✓" : index + 1}
                  </Badge>
                  <div className="flex-1 text-left">
                    {isCurrent ? (
                      <Skeleton className="h-5 w-64 animate-pulse" />
                    ) : (
                      <span className={cn(isPending && "text-muted-foreground")}>
                        {isPending ? "Topic pending..." : `Topic ${index + 1}`}
                      </span>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pl-12">
                  {/* For Arguments */}
                  <div className="flex items-start gap-2">
                    <ThumbsUp className="h-4 w-4 text-green-500 mt-1" />
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium text-green-600">For:</p>
                      {isCurrent ? (
                        <>
                          <Skeleton className="h-4 w-full animate-pulse" />
                          <Skeleton className="h-4 w-5/6 animate-pulse" />
                        </>
                      ) : (
                        <Skeleton className="h-4 w-full" />
                      )}
                    </div>
                  </div>

                  {/* Against Arguments */}
                  <div className="flex items-start gap-2">
                    <ThumbsDown className="h-4 w-4 text-red-500 mt-1" />
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium text-red-600">Against:</p>
                      {isCurrent ? (
                        <>
                          <Skeleton className="h-4 w-full animate-pulse" />
                          <Skeleton className="h-4 w-4/6 animate-pulse" />
                        </>
                      ) : (
                        <Skeleton className="h-4 w-full" />
                      )}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span>Generating topic {currentTopic + 1} of {topicCount}...</span>
      </div>
    </div>
  );
});
