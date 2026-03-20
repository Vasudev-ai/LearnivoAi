"use client";

import { memo } from "react";
import { HelpCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressRing } from "@/components/progress-ring";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { StreamPhase } from "@/hooks/use-streaming";

interface QuizGeneratorStreamingProps {
  phase: StreamPhase;
  overallProgress: number;
  questionCount?: number;
}

export const QuizGeneratorStreaming = memo(function QuizGeneratorStreaming({
  phase,
  overallProgress,
  questionCount = 5,
}: QuizGeneratorStreamingProps) {
  const isStreaming = phase === "streaming" || phase === "generating";

  // Calculate which question is currently being generated
  const getCurrentQuestion = () => {
    const progressPerQuestion = 100 / questionCount;
    const currentQuestion = Math.floor(overallProgress / progressPerQuestion);
    return Math.min(currentQuestion, questionCount - 1);
  };

  const currentQuestion = getCurrentQuestion();

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
                <span>Generating quiz...</span>
              </>
            ) : (
              <span>Quiz</span>
            )}
          </h3>
          <p className="text-sm text-muted-foreground">
            {questionCount} questions • {currentQuestion + 1}/{questionCount} generated
          </p>
        </div>
        <ProgressRing progress={overallProgress} size={56} />
      </div>

      {/* Quiz & Answer Key Tabs */}
      <Tabs defaultValue="quiz">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quiz">
            <HelpCircle className="mr-2 h-4 w-4" />
            Quiz
          </TabsTrigger>
          <TabsTrigger value="answer-key">
            <CheckCircle className="mr-2 h-4 w-4" />
            Answer Key
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quiz" className="mt-4">
          <div className="space-y-8">
            {/* MCQ Questions */}
            <div className="space-y-4">
              <h3 className="font-headline text-lg font-semibold border-b pb-2">
                Multiple Choice Questions
              </h3>
              
              {Array.from({ length: questionCount }).map((_, index) => {
                const isComplete = index < currentQuestion;
                const isCurrent = index === currentQuestion;
                const isPending = index > currentQuestion;

                return (
                  <div 
                    key={index} 
                    className={cn(
                      "border rounded-lg p-4 transition-all",
                      isCurrent && isStreaming && "border-primary/50 bg-primary/5 animate-pulse",
                      isComplete && "border-primary/30 bg-primary/5"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Badge 
                        variant={isComplete ? "default" : isCurrent ? "secondary" : "outline"}
                        className={cn(
                          isComplete && "bg-primary/20 text-primary",
                          isCurrent && isStreaming && "bg-primary text-primary-foreground animate-pulse"
                        )}
                      >
                        {isComplete ? "✓" : index + 1}
                      </Badge>
                      {isCurrent && isStreaming && (
                        <span className="text-xs text-primary animate-pulse">Generating...</span>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="font-semibold">{index + 1}.</span>
                        {isCurrent && isStreaming ? (
                          <Skeleton className="h-5 flex-1 animate-pulse" />
                        ) : (
                          <Skeleton className="h-5 flex-1" />
                        )}
                      </div>

                      <div className="space-y-2 pl-6">
                        {["a)", "b)", "c)", "d)"].map((option) => (
                          <div key={option} className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground w-4">{option}</span>
                            {isCurrent && isStreaming ? (
                              <Skeleton className="h-4 flex-1 animate-pulse" />
                            ) : (
                              <Skeleton className="h-4 flex-1" />
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="text-xs text-muted-foreground pl-6">
                        {isCurrent && isStreaming ? (
                          <Skeleton className="h-3 w-16 animate-pulse" />
                        ) : (
                          <Skeleton className="h-3 w-16" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="answer-key" className="mt-4">
          <Accordion type="single" collapsible className="w-full">
            {Array.from({ length: questionCount }).map((_, index) => {
              const isComplete = index < currentQuestion;
              const isCurrent = index === currentQuestion;

              return (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-start gap-3">
                      <Badge 
                        variant={isComplete ? "default" : "outline"}
                        className={cn(
                          isComplete && "bg-primary/20 text-primary"
                        )}
                      >
                        {isComplete ? "✓" : index + 1}
                      </Badge>
                      {isCurrent ? (
                        <Skeleton className="h-4 w-48" />
                      ) : (
                        <Skeleton className="h-4 w-48" />
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 pl-6">
                    {isCurrent && isStreaming ? (
                      <>
                        <Skeleton className="h-4 w-32 animate-pulse" />
                        <Skeleton className="h-4 w-full animate-pulse" />
                        <Skeleton className="h-4 w-5/6 animate-pulse" />
                      </>
                    ) : (
                      <>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                      </>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </TabsContent>
      </Tabs>

      {/* Footer Status */}
      {isStreaming && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Generating question {currentQuestion + 1} of {questionCount}...</span>
        </div>
      )}
    </div>
  );
});
