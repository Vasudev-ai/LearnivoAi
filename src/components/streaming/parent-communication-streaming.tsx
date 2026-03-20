"use client";

import { memo } from "react";
import { Mail } from "lucide-react";
import { ProgressRing } from "@/components/progress-ring";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ParentCommunicationStreamingProps {
  overallProgress: number;
}

export const ParentCommunicationStreaming = memo(function ParentCommunicationStreaming({
  overallProgress,
}: ParentCommunicationStreamingProps) {
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
            <span>Drafting message...</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Professional parent communication
          </p>
        </div>
        <ProgressRing progress={overallProgress} size={56} />
      </div>

      {/* Tabs - Same layout as actual */}
      <Tabs defaultValue="english">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="english">
            <Mail className="mr-2 h-4 w-4" />
            English
          </TabsTrigger>
          <TabsTrigger value="translated">
            <Mail className="mr-2 h-4 w-4" />
            Translated
          </TabsTrigger>
        </TabsList>

        <TabsContent value="english" className="mt-4">
          <div className="rounded-md border bg-muted p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Skeleton className="h-5 w-20 animate-pulse" />
              <Skeleton className="h-5 flex-1 animate-pulse" />
            </div>
            <Skeleton className="h-4 w-full animate-pulse" />
            <Skeleton className="h-4 w-full animate-pulse" />
            <Skeleton className="h-4 w-5/6 animate-pulse" />
            <div className="my-2" />
            <Skeleton className="h-4 w-full animate-pulse" />
            <Skeleton className="h-4 w-full animate-pulse" />
            <Skeleton className="h-4 w-4/6 animate-pulse" />
          </div>
        </TabsContent>

        <TabsContent value="translated" className="mt-4">
          <div className="rounded-md border bg-muted p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Skeleton className="h-5 w-20 animate-pulse" />
              <Skeleton className="h-5 flex-1 animate-pulse" />
            </div>
            <Skeleton className="h-4 w-full animate-pulse" />
            <Skeleton className="h-4 w-full animate-pulse" />
            <Skeleton className="h-4 w-5/6 animate-pulse" />
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span>Drafting professional message...</span>
      </div>
    </div>
  );
});
