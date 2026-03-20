"use client";

import { memo } from "react";
import { Target, ListChecks, Paperclip, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProgressRing } from "@/components/progress-ring";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { StreamPhase } from "@/hooks/use-streaming";

interface LessonPlannerStreamingProps {
  phase: StreamPhase;
  overallProgress: number;
  topic?: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const LessonPlannerStreaming = memo(function LessonPlannerStreaming({
  phase,
  overallProgress,
  topic = "",
}: LessonPlannerStreamingProps) {
  const isStreaming = phase === "streaming" || phase === "generating";

  // Calculate which day is currently being generated based on progress
  const getCurrentDay = () => {
    const progressPerDay = 100 / DAYS.length;
    const currentDayIndex = Math.floor(overallProgress / progressPerDay);
    return Math.min(currentDayIndex, DAYS.length - 1);
  };

  const currentDayIndex = getCurrentDay();

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
                <span>Generating lesson plan...</span>
              </>
            ) : (
              <span>Lesson Plan</span>
            )}
          </h3>
          {topic && (
            <p className="text-sm text-muted-foreground">
              Topic: {topic}
            </p>
          )}
        </div>
        <ProgressRing progress={overallProgress} size={56} />
      </div>

      {/* Days Accordion - All days shown */}
      <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
        {DAYS.map((day, index) => {
          const isComplete = index < currentDayIndex;
          const isCurrent = index === currentDayIndex;
          const isPending = index > currentDayIndex;

          return (
            <AccordionItem value={`item-${index}`} key={day}>
              <AccordionTrigger className="font-headline text-lg font-semibold capitalize hover:no-underline">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={isComplete ? "default" : isCurrent ? "secondary" : "outline"}
                    className={cn(
                      "text-base",
                      isComplete && "bg-primary/20 text-primary",
                      isCurrent && "bg-primary text-primary-foreground animate-pulse",
                      isPending && "text-muted-foreground"
                    )}
                  >
                    {isComplete ? "✓" : isCurrent ? "..." : index + 1}
                  </Badge>
                  <span className={cn(
                    isPending && "text-muted-foreground"
                  )}>
                    {day}
                  </span>
                  {isCurrent && isStreaming && (
                    <span className="text-xs text-primary animate-pulse">
                      Generating...
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                {/* Objectives Section */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="h-5 w-5 text-primary" />
                    <h4 className="font-headline text-lg font-semibold">Learning Objectives</h4>
                  </div>
                  <div className="pl-8 space-y-2">
                    {isCurrent && isStreaming ? (
                      <>
                        <Skeleton className="h-4 w-full animate-pulse" />
                        <Skeleton className="h-4 w-5/6 animate-pulse" />
                        <Skeleton className="h-4 w-4/6 animate-pulse" />
                      </>
                    ) : isComplete ? (
                      <>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Pending...
                      </div>
                    )}
                  </div>
                </div>

                {/* Activities Section */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <ListChecks className="h-5 w-5 text-primary" />
                    <h4 className="font-headline text-lg font-semibold">Activities</h4>
                  </div>
                  <div className="pl-8">
                    {isCurrent && isStreaming ? (
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-24 animate-pulse" />
                        <Skeleton className="h-6 w-32 animate-pulse" />
                        <Skeleton className="h-6 w-28 animate-pulse" />
                      </div>
                    ) : isComplete ? (
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-28" />
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Pending...
                      </div>
                    )}
                  </div>
                </div>

                {/* Resources & Assessment Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Resources */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Paperclip className="h-5 w-5 text-primary" />
                      <h4 className="font-headline text-lg font-semibold">Resources</h4>
                    </div>
                    <div className="pl-8 space-y-2">
                      {isCurrent && isStreaming ? (
                        <>
                          <Skeleton className="h-4 w-full animate-pulse" />
                          <Skeleton className="h-4 w-5/6 animate-pulse" />
                        </>
                      ) : isComplete ? (
                        <>
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                        </>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Pending...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Assessment */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <ClipboardCheck className="h-5 w-5 text-primary" />
                      <h4 className="font-headline text-lg font-semibold">Assessment</h4>
                    </div>
                    <div className="pl-8 space-y-2">
                      {isCurrent && isStreaming ? (
                        <>
                          <Skeleton className="h-4 w-full animate-pulse" />
                          <Skeleton className="h-4 w-4/6 animate-pulse" />
                        </>
                      ) : isComplete ? (
                        <>
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-4/6" />
                        </>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Pending...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Footer Status */}
      {isStreaming && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Generating content for {DAYS[currentDayIndex]}...</span>
        </div>
      )}
    </div>
  );
});
