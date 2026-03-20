"use client";

import { useState, useCallback, useRef } from "react";

export type StreamPhase = "idle" | "generating" | "streaming" | "complete";

export interface StreamSection {
  id: string;
  status: "pending" | "streaming" | "complete";
  progress: number;
  content?: string;
}

export interface SectionItem {
  id: string;
  delay: number;
  content: string;
}

export interface UseStreamingOptions {
  onComplete?: () => void;
}

export function useStreaming(options: UseStreamingOptions = {}) {
  const { onComplete } = options;
  
  const [phase, setPhase] = useState<StreamPhase>("idle");
  const [sections, setSections] = useState<StreamSection[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initializeSections = useCallback((sectionIds: string[]) => {
    setSections(
      sectionIds.map((id) => ({
        id,
        status: "pending" as const,
        progress: 0,
      }))
    );
  }, []);

  const startStreaming = useCallback(
    async (sectionSequence: SectionItem[]) => {
      setPhase("generating");
      await delay(300);
      setPhase("streaming");

      for (const section of sectionSequence) {
        setCurrentSectionId(section.id);
        setSections((prev) =>
          prev.map((s) =>
            s.id === section.id ? { ...s, status: "streaming" as const } : s
          )
        );

        await streamSectionContent(
          section.id,
          section.content,
          section.delay,
          sectionSequence.length
        );
      }

      setPhase("complete");
      setOverallProgress(100);
      setCurrentSectionId(null);
      onComplete?.();
    },
    [onComplete]
  );

  const streamSectionContent = async (
    sectionId: string,
    content: string,
    duration: number,
    totalSections: number
  ) => {
    const steps = 10;
    const stepDuration = duration / steps;

    for (let i = 1; i <= steps; i++) {
      await delay(stepDuration);
      const progress = (i / steps) * 100;
      const partialContent = content.slice(0, Math.floor((i / steps) * content.length));

      setSections((prev) => {
        const completedSections = prev.filter(s => s.status === "complete" || s.id === sectionId).length;
        const totalProgress = prev.reduce((sum, s) => sum + (s.status === "complete" ? 100 : s.progress), 0);
        const overall = Math.min((totalProgress / totalSections), 95);
        setOverallProgress(overall);

        return prev.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                progress,
                content: partialContent,
              }
            : s
        );
      });
    }

    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, status: "complete" as const, progress: 100, content }
          : s
      )
    );
  };

  const stopStreaming = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setPhase("idle");
    setSections([]);
    setOverallProgress(0);
    setCurrentSectionId(null);
  }, []);

  const reset = useCallback(() => {
    stopStreaming();
    setPhase("idle");
  }, [stopStreaming]);

  return {
    phase,
    sections,
    overallProgress,
    currentSectionId,
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
