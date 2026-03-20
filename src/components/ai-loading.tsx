"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SahayakMascot } from "./sahayak-mascot";

const defaultMessages = [
  "Analyzing your request...",
  "Consulting the knowledge base...",
  "Brainstorming creative ideas...",
  "Structuring the content...",
  "Polishing the final output...",
  "Adding a touch of magic...",
];

const toolMessages: Record<string, string[]> = {
  "lesson-planner": [
    "Designing your lesson structure...",
    "Adding engaging activities...",
    "Including assessment criteria...",
    "Formatting for clarity...",
    "Your plan is almost ready!",
  ],
  "math-helper": [
    "Reading the equation...",
    "Breaking down the problem...",
    "Calculating step by step...",
    "Verifying the solution...",
    "Preparing explanations...",
  ],
  "quiz-generator": [
    "Designing quiz questions...",
    "Adding multiple choice options...",
    "Creating the answer key...",
    "Balancing difficulty levels...",
    "Finalizing your quiz...",
  ],
  "visual-aids": [
    "Visualizing the concept...",
    "Sketching the diagram...",
    "Adding labels and details...",
    "Polishing the visual...",
    "Almost there!",
  ],
  "knowledge-base": [
    "Searching knowledge sources...",
    "Analyzing the question...",
    "Formulating the answer...",
    "Simplifying for clarity...",
    "Finalizing response...",
  ],
  "story-generator": [
    "Gathering story elements...",
    "Weaving the narrative...",
    "Adding characters...",
    "Building suspense...",
    "Adding final touches...",
  ],
  "rubric-generator": [
    "Analyzing assignment criteria...",
    "Defining performance levels...",
    "Writing descriptors...",
    "Structuring the rubric...",
    "Polishing the content...",
  ],
  "debate-topic-generator": [
    "Researching topics...",
    "Formulating arguments...",
    "Finding pro and con points...",
    "Balancing perspectives...",
    "Preparing materials...",
  ],
  "hyper-local-content": [
    "Understanding local context...",
    "Adapting content...",
    "Adding cultural references...",
    "Translating nuances...",
    "Finalizing content...",
  ],
  "parent-communication": [
    "Drafting the message...",
    "Adding empathy and tone...",
    "Polishing the language...",
    "Checking for clarity...",
    "Final review...",
  ],
  "paper-digitizer": [
    "Scanning the document...",
    "Recognizing text...",
    "Formatting content...",
    "Digitizing questions...",
    "Almost done...",
  ],
};

interface AILoadingProps {
  messages?: string[];
  className?: string;
  toolName?: string;
  showProgress?: boolean;
}

export function AILoading({
  messages,
  className,
  toolName,
  showProgress = true,
}: AILoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const activeMessages =
    messages || (toolName && toolMessages[toolName]) || defaultMessages;

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % activeMessages.length);
    }, 2000);

    return () => clearInterval(messageInterval);
  }, [activeMessages.length]);

  useEffect(() => {
    if (showProgress) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + Math.random() * 15;
        });
      }, 800);

      return () => clearInterval(progressInterval);
    }
  }, [showProgress]);

  const displayProgress = Math.min(progress, 95);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 text-center p-8",
        className
      )}
    >
      <SahayakMascot state="thinking" size="lg" />

      {showProgress && (
        <div className="w-full max-w-xs space-y-2">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 animate-progress-shimmer"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {Math.round(displayProgress)}% complete
          </p>
        </div>
      )}

      <div className="relative h-6 w-64 overflow-hidden">
        <p
          key={currentMessageIndex}
          className="animate-fade-in-out absolute inset-0 w-full text-center font-medium text-muted-foreground"
        >
          {activeMessages[currentMessageIndex]}
        </p>
      </div>

      <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse [animation-delay:0.2s]" />
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse [animation-delay:0.4s]" />
      </div>
    </div>
  );
}
