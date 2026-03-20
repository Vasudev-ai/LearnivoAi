"use client";

import { memo } from "react";
import { BookText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressRing } from "@/components/progress-ring";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import type { StreamPhase } from "@/hooks/use-streaming";

interface StoryGeneratorStreamingProps {
  phase: StreamPhase;
  overallProgress: number;
  pageCount?: number;
}

export const StoryGeneratorStreaming = memo(function StoryGeneratorStreaming({
  phase,
  overallProgress,
  pageCount = 5,
}: StoryGeneratorStreamingProps) {
  const isStreaming = phase === "streaming" || phase === "generating";

  const getCurrentPage = () => {
    const progressPerPage = 100 / pageCount;
    const currentPage = Math.floor(overallProgress / progressPerPage);
    return Math.min(currentPage, pageCount - 1);
  };

  const currentPage = getCurrentPage();

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
                <span>Weaving a tale...</span>
              </>
            ) : (
              <span>Generated Story</span>
            )}
          </h3>
          <p className="text-sm text-muted-foreground">
            {pageCount} pages • {currentPage + 1}/{pageCount} generated
          </p>
        </div>
        <ProgressRing progress={overallProgress} size={56} />
      </div>

      {/* Story Carousel - Same layout as actual */}
      <Carousel className="w-full">
        <CarouselContent>
          {Array.from({ length: pageCount }).map((_, index) => {
            const isComplete = index < currentPage;
            const isCurrent = index === currentPage;
            const isPending = index > currentPage;

            return (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="overflow-hidden">
                    <CardContent className="flex flex-col aspect-video items-center justify-center p-6 gap-4">
                      {/* Image Area */}
                      <div className="relative w-full h-3/5 bg-muted rounded-md flex items-center justify-center">
                        {isCurrent && isStreaming ? (
                          <div className="flex flex-col items-center gap-2">
                            <Skeleton className="w-32 h-32 rounded-full animate-pulse" />
                            <Skeleton className="w-48 h-4 animate-pulse" />
                          </div>
                        ) : isComplete ? (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            <BookText className="h-12 w-12 opacity-50" />
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            Pending...
                          </div>
                        )}
                      </div>

                      {/* Text Area */}
                      <div className="text-center text-lg md:text-xl h-2/5 overflow-y-auto w-full px-4">
                        {isCurrent && isStreaming ? (
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-full animate-pulse" />
                            <Skeleton className="h-5 w-5/6 animate-pulse" />
                            <Skeleton className="h-5 w-4/6 animate-pulse" />
                          </div>
                        ) : isComplete ? (
                          <p className="text-muted-foreground">Page {index + 1} content</p>
                        ) : (
                          <p className="text-muted-foreground">Pending...</p>
                        )}
                      </div>

                      {/* Page Number Badge */}
                      <Badge 
                        variant={isComplete ? "default" : isCurrent ? "secondary" : "outline"}
                        className={cn(
                          "absolute top-4 right-4",
                          isComplete && "bg-primary/20 text-primary",
                          isCurrent && isStreaming && "bg-primary text-primary-foreground animate-pulse"
                        )}
                      >
                        {isComplete ? "✓" : `Page ${index + 1}`}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="ml-12" />
        <CarouselNext className="mr-12" />
      </Carousel>

      {/* Footer Status */}
      {isStreaming && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Generating page {currentPage + 1} of {pageCount}...</span>
        </div>
      )}
    </div>
  );
});
