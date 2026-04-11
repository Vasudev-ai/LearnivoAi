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
  Command,
  History,
  TrendingUp,
  LayoutGrid,
  Zap,
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
import { Badge } from "@/components/ui/badge";
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

const ModernDashboard = ({ tools, profile, user, totalAssets, assetsThisWeek, totalTopics, startTour }: any) => {
  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 p-8 md:p-12">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="h-64 w-64 text-primary animate-pulse" />
        </div>
        <div className="relative z-10 max-w-2xl">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 py-1 px-3">
                <Sparkles className="mr-2 h-3 w-3" />
                Next Generation AI platform
            </Badge>
            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                Design the future of <span className="text-primary italic">Learning.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
                Welcome back, {profile?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || "Teacher"}. 
                What groundbreaking material will we create today?
            </p>
            <div className="flex flex-wrap gap-4">
               <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20" asChild>
                  <Link href="/lesson-planner">
                     <Zap className="mr-2 h-5 w-5 fill-current" />
                     Start Creating
                  </Link>
               </Button>
               <Button size="lg" variant="outline" className="rounded-full px-8 backdrop-blur-sm" onClick={startTour}>
                  Take a Quick Tour
               </Button>
            </div>
        </div>
      </section>

      {/* Stats Hub */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <SpotlightCard className="bg-background/50 backdrop-blur-xl border-primary/10 group">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-full">+12% vs last week</span>
                </div>
                <h3 className="text-muted-foreground text-sm font-medium mb-1">Total Assets Built</h3>
                <p className="text-3xl font-bold">{totalAssets}</p>
            </div>
         </SpotlightCard>
         <SpotlightCard className="bg-background/50 backdrop-blur-xl border-primary/10 group">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                        <History className="h-6 w-6 text-purple-500" />
                    </div>
                </div>
                <h3 className="text-muted-foreground text-sm font-medium mb-1">Impact This Week</h3>
                <p className="text-3xl font-bold">{assetsThisWeek}</p>
            </div>
         </SpotlightCard>
         <SpotlightCard className="bg-background/50 backdrop-blur-xl border-primary/10 group">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-orange-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                        <Notebook className="h-6 w-6 text-orange-500" />
                    </div>
                </div>
                <h3 className="text-muted-foreground text-sm font-medium mb-1">Active Topics</h3>
                <p className="text-3xl font-bold">{totalTopics}</p>
            </div>
         </SpotlightCard>
      </section>

      {/* Platform Core */}
      <section>
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-primary rounded-full" />
                <h2 className="font-headline text-2xl font-bold">Platform Capabilities</h2>
            </div>
            <Link href="/library" className="text-sm text-primary hover:underline font-medium flex items-center gap-1">
                Explore All <ArrowRight className="h-3 w-3" />
            </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.slice(0, 8).map((tool: any, i: number) => (
                <Link key={tool.href} href={tool.href} className="group">
                    <SpotlightCard className="h-full border-primary/5 hover:border-primary/20 transition-all duration-300">
                        <div className="p-5 flex flex-col gap-4">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                {React.cloneElement(tool.icon, { className: "h-5 w-5" })}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{tool.title}</h4>
                                <p className="text-xs text-muted-foreground line-clamp-1">{tool.description}</p>
                            </div>
                        </div>
                    </SpotlightCard>
                </Link>
            ))}
        </div>
      </section>

      {/* Featured Tool / AI Lab */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="rounded-3xl border border-primary/10 bg-grid-white/[0.02] p-8 flex flex-col justify-between min-h-[300px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div>
               <h3 className="text-xl font-bold mb-2">New: Lesson Pulse v2</h3>
               <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                  Our most advanced lesson planner yet. Now with hyper-local context and Bloom's Taxonomy integration.
               </p>
               <Button variant="outline" className="rounded-full shadow-sm" asChild>
                  <Link href="/lesson-planner">Try Now</Link>
               </Button>
            </div>
            <div className="self-end">
               <BrainCircuit className="h-24 w-24 text-primary/10 group-hover:text-primary/20 transition-colors" />
            </div>
         </div>
         
         <div className="rounded-3xl border border-orange-500/10 bg-grid-white/[0.02] p-8 flex flex-col justify-between min-h-[300px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div>
               <h3 className="text-xl font-bold mb-2">Paper Digitizer</h3>
               <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                  Turn your messy handwritten notes into clean, reusable digital curriculum with one click.
               </p>
               <Button variant="outline" className="rounded-full border-orange-500/20 text-orange-500 hover:bg-orange-500/5 shadow-sm" asChild>
                  <Link href="/paper-digitizer">Launch Scanner</Link>
               </Button>
            </div>
            <div className="self-end">
               <ScanLine className="h-24 w-24 text-orange-500/10 group-hover:text-orange-500/20 transition-colors" />
            </div>
         </div>
      </section>
    </div>
  )
}

export default function DashboardPage() {
  const { folders, isFoldersLoading, isAssetsLoading } = useWorkspace();
  const { user, profile } = useUser();
  const { startTour } = useOnboardingTour();
  const [dashboardVersion, setDashboardVersion] = React.useState<"classic" | "modern">("classic");

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
        className="flex items-start justify-between gap-4"
      >
        <div className="space-y-1">
          <h1 className="font-headline text-2xl md:text-3xl font-bold break-all">
            {greeting}, {profile?.name || user?.displayName || "Teacher"}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {dashboardVersion === 'classic' 
              ? "Ready to create something amazing? Your AI assistant is here to help."
              : "Step into your intelligent workspace. The future of education is here."
            }
          </p>
        </div>
        <div className="flex shrink-0 items-center rounded-full border bg-muted/50 p-1">
            <Button 
                variant={dashboardVersion === 'classic' ? 'secondary' : 'ghost'} 
                size="sm" 
                className="rounded-full px-4 text-xs h-8"
                onClick={() => setDashboardVersion('classic')}
            >
                <LayoutGrid className="mr-2 h-3.5 w-3.5" />
                Classic
            </Button>
            <Button 
                variant={dashboardVersion === 'modern' ? 'secondary' : 'ghost'} 
                size="sm" 
                className="rounded-full px-4 text-xs h-8"
                onClick={() => setDashboardVersion('modern')}
            >
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Modern
            </Button>
        </div>
      </motion.div>

      {dashboardVersion === 'modern' ? (
        <ModernDashboard 
            tools={tools} 
            profile={profile} 
            user={user} 
            totalAssets={totalAssets} 
            assetsThisWeek={assetsThisWeek} 
            totalTopics={totalTopics} 
            startTour={startTour}
        />
      ) : (
        <>

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
      </>
      )}
    </motion.div>
  );
}
