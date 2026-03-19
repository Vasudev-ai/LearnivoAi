"use client";

import React, { memo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  DraftingCompass,
  GraduationCap,
  HelpCircle,
  Library,
  Mail,
  Map,
  Notebook,
  Scale,
  BarChart,
  BookCopy,
  Layers,
  CalendarClock,
  ScanLine,
  BookText,
  View,
  Calculator,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/context/workspace-context";
import { useUser } from "@/firebase";
import { SpotlightCard } from "@/components/shared";
import { motion, AnimatePresence } from "framer-motion";
import {
  StatsGridSkeleton,
  ToolGridSkeleton,
  EmptyState,
} from "@/components/skeletons";

const tools = [
  {
    title: "Lesson Planner",
    description: "Generate comprehensive weekly lesson plans.",
    href: "/lesson-planner",
    icon: <DraftingCompass className="h-8 w-8" />,
  },
  {
    title: "Visual Aids",
    description: "Create simple drawings or charts for your lessons.",
    href: "/visual-aids",
    icon: <Layers className="h-8 w-8" />,
  },
  {
    title: "Math Helper",
    description: "Solve math problems from a photo with explanations.",
    href: "/math-helper",
    icon: <Calculator className="h-8 w-8" />,
  },
  {
    title: "Hyper-Local Content",
    description: "Create content tailored to your students' region.",
    href: "/hyper-local-content",
    icon: <Map className="h-8 w-8" />,
  },
  {
    title: "Story Generator",
    description: "Generate creative stories for any topic or moral.",
    href: "/story-generator",
    icon: <BookText className="h-8 w-8" />,
  },
  {
    title: "Instant Knowledge Base",
    description: "Get simple answers for complex student questions.",
    href: "/knowledge-base",
    icon: <BrainCircuit className="h-8 w-8" />,
  },
  {
    title: "Parent Communication",
    description: "Draft professional emails to parents in seconds.",
    href: "/parent-communication",
    icon: <Mail className="h-8 w-8" />,
  },
  {
    title: "Paper Digitizer",
    description: "Turn physical question papers into digital format.",
    href: "/paper-digitizer",
    icon: <ScanLine className="h-8 w-8" />,
  },
  {
    title: "Quiz Generator",
    description: "Create quizzes from topics or pasted text content.",
    href: "/quiz-generator",
    icon: <HelpCircle className="h-8 w-8" />,
  },
  {
    title: "Rubric Generator",
    description: "Create detailed grading rubrics for any assignment.",
    href: "/rubric-generator",
    icon: <Scale className="h-8 w-8" />,
  },
  {
    title: "Debate Topic Generator",
    description: "Generate engaging debate topics and materials.",
    href: "/debate-topic-generator",
    icon: <GraduationCap className="h-8 w-8" />,
  },
  {
    title: "My Library",
    description: "Manage your digital textbooks and resources.",
    href: "/library",
    icon: <Library className="h-8 w-8" />,
  },
  {
    title: "My Workspace",
    description: "Organize all your generated lesson plans and assets.",
    href: "/workspace",
    icon: <Notebook className="h-8 w-8" />,
  },
];

const SummaryCard = memo(
  ({ title, value }: { title: string; value: string | number }) => (
    <SpotlightCard>
      <CardHeader className="p-3 md:p-4 pb-0 md:pb-2">
        <CardDescription className="text-[10px] md:text-sm uppercase tracking-wider font-medium">
          {title}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 md:p-4 pt-1 md:pt-2">
        <CardTitle className="text-xl md:text-4xl font-bold">
          {value}
        </CardTitle>
      </CardContent>
    </SpotlightCard>
  )
);

SummaryCard.displayName = "SummaryCard";

export default function DashboardPage() {
  const { folders, isFoldersLoading, isAssetsLoading } = useWorkspace();
  const { user, profile } = useUser();

  const isLoading = isFoldersLoading || isAssetsLoading;

  const sahayakAssetsFolder = folders.find((f) => f.id === "folder-sahayak-assets");
  const assetTypeFolders = folders.filter((f) => f.id !== "folder-sahayak-assets");

  const totalAssets = assetTypeFolders.reduce(
    (sum, folder) => sum + folder.assets.length,
    0
  );

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const assetsThisWeek = assetTypeFolders.reduce((sum, folder) => {
    return (
      sum +
      folder.assets.filter(
        (asset) => new Date(asset.createdAt) >= oneWeekAgo
      ).length
    );
  }, 0);

  const totalTopics = folders.filter((folder) =>
    folder.name.startsWith("Topic:")
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex w-full flex-col gap-6 md:gap-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="font-headline text-2xl md:text-3xl font-bold break-all">
          Welcome, {profile?.name || user?.email?.split("@")[0] || "Teacher"}!
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Here's a snapshot of your activity and tools.
        </p>
      </motion.div>

      {/* Weekly Summary */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="p-4 md:p-6 pb-2 md:pb-4">
                <div className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 md:h-6 md:w-6 text-lime-500" />
                  <CardTitle className="font-headline text-xl md:text-2xl font-bold">
                    Your Weekly Summary
                  </CardTitle>
                </div>
                <CardDescription className="text-xs md:text-sm">
                  Your progress in the last 7 days.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <StatsGridSkeleton count={3} />
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <SpotlightCard>
              <CardHeader className="p-4 md:p-6 pb-2 md:pb-4">
                <div className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 md:h-6 md:w-6 text-lime-500" />
                  <CardTitle className="font-headline text-xl md:text-2xl font-bold">
                    Your Weekly Summary
                  </CardTitle>
                </div>
                <CardDescription className="text-xs md:text-sm">
                  Your progress in the last 7 days.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <SummaryCard title="Total Topics" value={totalTopics} />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <SummaryCard
                      title="Total Assets Created"
                      value={totalAssets}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="col-span-2 lg:col-span-1"
                  >
                    <SummaryCard
                      title="Assets This Week"
                      value={assetsThisWeek}
                    />
                  </motion.div>
                </div>
              </CardContent>
            </SpotlightCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tools Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <Link href={tool.href} className="group block h-full">
                <SpotlightCard className="flex h-full flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                  <CardHeader className="p-4 md:p-6">
                    <div className="mb-3 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-lime-500/10 text-lime-500 group-hover:bg-lime-500/20 transition-colors">
                      {tool.icon}
                    </div>
                    <CardTitle className="font-headline text-lg md:text-xl text-foreground group-hover:text-lime-500 transition-colors">
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm text-muted-foreground">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto border-t p-3 md:p-4">
                    <div className="flex w-full items-center justify-between text-sm font-medium text-lime-500 group-hover:text-lime-600">
                      <span>Open Tool</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardFooter>
                </SpotlightCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
