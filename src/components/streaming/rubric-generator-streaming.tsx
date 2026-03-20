"use client";

import { memo } from "react";
import { Scale } from "lucide-react";
import { ProgressRing } from "@/components/progress-ring";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RubricGeneratorStreamingProps {
  overallProgress: number;
  criteriaCount?: number;
}

export const RubricGeneratorStreaming = memo(function RubricGeneratorStreaming({
  overallProgress,
  criteriaCount = 4,
}: RubricGeneratorStreamingProps) {
  const levels = ["Excellent", "Good", "Satisfactory", "Needs Improvement"];

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
            <span>Creating rubric...</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            {criteriaCount} criteria with 4 performance levels
          </p>
        </div>
        <ProgressRing progress={overallProgress} size={56} />
      </div>

      {/* Rubric Table - Same layout as actual */}
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] font-bold">Criteria</TableHead>
              {levels.map((level) => (
                <TableHead key={level} className="text-center">{level}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: criteriaCount }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <Skeleton className="h-5 w-full animate-pulse" />
                </TableCell>
                {levels.map((level, levelIndex) => (
                  <TableCell key={level} className="text-center">
                    <Skeleton className="h-12 w-full animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span>Generating rubric criteria...</span>
      </div>
    </div>
  );
});
