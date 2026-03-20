"use client";

import React, { memo } from "react";
import { cn } from "@/lib/utils";

type MascotState = "idle" | "thinking" | "success" | "error";

interface SahayakMascotProps {
  state?: MascotState;
  size?: "sm" | "md" | "lg";
  className?: string;
  showMessage?: boolean;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
};

const innerSizeClasses = {
  sm: "w-10 h-10",
  md: "w-16 h-16",
  lg: "w-20 h-20",
};

const eyeSizeClasses = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4",
};

export const SahayakMascot = memo(function SahayakMascot({
  state = "thinking",
  size = "md",
  className,
  showMessage = false,
}: SahayakMascotProps) {
  const stateMessages: Record<MascotState, string> = {
    idle: "Ready to help!",
    thinking: "Working on it...",
    success: "All done!",
    error: "Let me try again",
  };

  const getMouthShape = () => {
    switch (state) {
      case "success":
        return "M8 14 Q12 18 16 14";
      case "error":
        return "M8 15 Q12 12 16 15";
      default:
        return "M8 14 L16 14";
    }
  };

  const getEyeStyle = () => {
    if (state === "thinking") {
      return "animate-mascot-blink";
    }
    return "";
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center",
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 animate-mascot-glow"
          )}
        />

        <div
          className={cn(
            "relative flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-primary to-lime-400 shadow-lg animate-mascot-float",
            innerSizeClasses[size]
          )}
        >
          <svg
            viewBox="0 0 24 24"
            className={cn("w-full h-full", size === "sm" ? "p-2" : "p-3")}
          >
            <circle
              cx="8"
              cy="10"
              r="2"
              className={cn("fill-primary-foreground", getEyeStyle())}
            />
            <circle
              cx="16"
              cy="10"
              r="2"
              className={cn("fill-primary-foreground", getEyeStyle())}
            />
            {state === "thinking" && (
              <>
                <circle
                  cx="6"
                  cy="5"
                  r="1"
                  className="fill-primary-foreground/60 animate-pulse"
                />
                <circle
                  cx="9"
                  cy="4"
                  r="1.5"
                  className="fill-primary-foreground/40 animate-pulse [animation-delay:0.2s]"
                />
              </>
            )}
            {state === "success" && (
              <>
                <path
                  d="M4 8 L6 10 L9 6"
                  className="stroke-primary-foreground stroke-2 fill-none"
                />
                <path
                  d="M15 6 L18 10 L20 8"
                  className="stroke-primary-foreground stroke-2 fill-none"
                />
              </>
            )}
            <path
              d={getMouthShape()}
              className="stroke-primary-foreground stroke-2 fill-none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {state === "thinking" && (
          <div className="absolute -bottom-1 flex gap-1">
            <span
              className={cn(
                "rounded-full bg-primary/30 animate-bounce [animation-delay:-0.3s]",
                eyeSizeClasses[size]
              )}
            />
            <span
              className={cn(
                "rounded-full bg-primary/30 animate-bounce [animation-delay:-0.15s]",
                eyeSizeClasses[size]
              )}
            />
            <span
              className={cn(
                "rounded-full bg-primary/30 animate-bounce",
                eyeSizeClasses[size]
              )}
            />
          </div>
        )}
      </div>

      {showMessage && (
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          {stateMessages[state]}
        </p>
      )}
    </div>
  );
});
