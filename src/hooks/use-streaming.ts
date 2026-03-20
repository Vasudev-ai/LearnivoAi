"use client";

import { useState, useCallback, useRef } from "react";

export type StreamPhase = "idle" | "generating" | "streaming" | "complete";

export interface StreamSection {
  id: string;
  status: "pending" | "streaming" | "complete";
  progress: number;
  content?: string;
}

export interface UseStreamingOptions {
  totalSections?: number;
  onComplete?: () => void;
}

export function useStreaming(options: UseStreamingOptions = {}) {
  const { onComplete } = options;
  
  const [phase, setPhase] = useState<StreamPhase>("idle");
  const [sections, setSections] = useState<StreamSection[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initializeSections = useCallback((sectionIds: string[]) => {
    setSections(
      sectionIds.map((id) => ({
        id,
        status: "pending",
        progress: 0,
      }))
    );
  }, []);

  const startStreaming = useCallback(
    async (
      sectionSequence: Array<{
        id: string;
        delay: number;
        content: string;
      }>
    ) => {
      setPhase("generating");
      await delay(300);
      setPhase("streaming");

      const totalDelay = sectionSequence.reduce((sum, s) => sum + s.delay, 0);
      setEstimatedTime(Math.ceil(totalDelay / 1000));

      for (const section of sectionSequence) {
        setSections((prev) =>
          prev.map((s) =>
            s.id === section.id ? { ...s, status: "streaming" } : s
          )
        );

        await streamSection(
          section.id,
          section.content,
          section.delay
        );
      }

      setPhase("complete");
      setOverallProgress(100);
      onComplete?.();
    },
    [onComplete]
  );

  const streamSection = async (
    sectionId: string,
    content: string,
    duration: number
  ) => {
    const steps = 10;
    const stepDuration = duration / steps;

    for (let i = 1; i <= steps; i++) {
      await delay(stepDuration);
      const progress = (i / steps) * 100;
      const partialContent = content.slice(0, Math.floor((i / steps) * content.length));

      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                progress,
                content: partialContent,
              }
            : s
        )
      );

      const totalProgress =
        sections.reduce((sum, s) => sum + s.progress, 0) +
        (progress / sectionSequence.length);
      setOverallProgress(Math.min(totalProgress, 95));

      if (estimatedTime && estimatedTime > 0) {
        setEstimatedTime((prev) => Math.max((prev || 0) - stepDuration / 1000, 0));
      }
    }

    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, status: "complete", progress: 100, content }
          : s
      )
    );
  };

  const sectionSequence: Array<{ id: string; delay: number; content: string }> = [];

  const stopStreaming = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setPhase("idle");
    setSections([]);
    setOverallProgress(0);
    setEstimatedTime(null);
  }, []);

  const reset = useCallback(() => {
    stopStreaming();
    setPhase("idle");
  }, [stopStreaming]);

  return {
    phase,
    sections,
    overallProgress,
    estimatedTime,
    initializeSections,
    startStreaming,
    stopStreaming,
    reset,
    isStreaming: phase === "streaming" || phase === "generating",
    isComplete: phase === "complete",
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
