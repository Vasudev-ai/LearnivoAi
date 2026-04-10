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
import { useOnboardingTour } from "@/components/onboarding-tour";

const tools = [
  {
    title: "Lesson Planner",
    description: "Create comprehensive lesson plans in seconds",
    href: "/lesson-planner",
    icon: <DraftingCompass className="h-8 w-8" />,
  },
  {
    title: "Visual Aids",
    description: "Create engaging diagrams and charts for your lessons",
    href: "/visual-aids",
    icon: <Layers className="h-8 w-8" />,
  },
  {
    title: "Math Helper",
    description: "Solve any math problem with step-by-step explanations",
    href: "/math-helper",
    icon: <Calculator className="h-8 w-8" />,
  },
  {
    title: "Hyper-Local Content",
    description: "Create content that resonates with your students' region",
    href: "/hyper-local-content",
    icon: <Map className="h-8 w-8" />,
  },
  {
    title: "Story Generator",
    description: "Bring any topic to life with creative stories",
    href: "/story-generator",
    icon: <BookText className="h-8 w-8" />,
  },
  {
    title: "Knowledge Base",
    description: "Get instant answers to complex student questions",
    href: "/knowledge-base",
    icon: <BrainCircuit className="h-8 w-8" />,
  },
  {
    title: "Parent Communication",
    description: "Draft professional emails to parents instantly",
    href: "/parent-communication",
    icon: <Mail className="h-8 w-8" />,
  },
  {
    title: "Paper Digitizer",
    description: "Convert physical papers to digital format with AI!",
    href: "/paper-digitizer",
    icon: <ScanLine className="h-8 w-8" />,
  },
  {
    title: "Quiz Generator",
    description: "Create engaging quizzes from any topic or text!",
    href: "/quiz-generator",
    icon: <HelpCircle className="h-8 w-8" />,
  },
  {
    title: "Rubric Generator",
    description: "Build detailed grading rubrics in seconds!",
    href: "/rubric-generator",
    icon: <Scale className="h-8 w-8" />,
  },
  {
    title: "Debate Topics",
    description: "Generate engaging debate topics and materials!",
    href: "/debate-topic-generator",
    icon: <GraduationCap className="h-8 w-8" />,
  },
  {
    title: "My Library",
    description: "Organize your digital textbooks and resources!",
    href: "/library",
    icon: <Library className="h-8 w-8" />,
  },
  {
    title: "My Workspace",
    description: "Keep all your generated content organized!",
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
  const { startTour } = useOnboardingTour();

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

  const [greeting, setGreeting] = React.useState("Welcome");

  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

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
          {greeting}, {profile?.name || user?.displayName || "Teacher"}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Ready to create something amazing? Your AI assistant is here to help.
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
              <BarChart className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
                  <CardTitle className="font-headline text-xl md:text-2xl font-bold">
                    Your Weekly Summary
                  </CardTitle>
                </div>
                <CardDescription className="text-xs md:text-sm">
                  See what you've been working on this week.
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
<SpotlightCard className="bg-card border-border">
        <CardHeader className="p-4 md:p-6 pb-2 md:pb-4">
          <div className="flex items-center gap-2">
            <BarChart className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
                  <CardTitle className="font-headline text-xl md:text-2xl font-bold">
                    Your Weekly Summary
                  </CardTitle>
                </div>
                <CardDescription className="text-xs md:text-sm">
                  Great progress! Keep up the good work.
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-tour="quick-actions">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <Link href={tool.href} className="group block h-full">
<SpotlightCard className="flex h-full flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-card border-border">
        <CardHeader className="p-4 md:p-6">
          <div className="mb-3 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            {tool.icon}
          </div>
          <CardTitle className="font-headline text-lg md:text-xl text-foreground group-hover:text-primary transition-colors">
            {tool.title}
          </CardTitle>
          <CardDescription className="text-xs md:text-sm text-muted-foreground">
            {tool.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto border-t border-border p-3 md:p-4">
          <div className="flex w-full items-center justify-between text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      <span>Let's go!</span>
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
