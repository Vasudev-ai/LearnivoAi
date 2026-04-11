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
  PlayCircle,
  Plus,
  FileText,
  ChevronRight,
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

const ModernDashboard = ({ tools, profile, user, totalAssets, assetsThisWeek, totalTopics, startTour, recentAssets }: any) => {
  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Friendly Greeting Stage */}
      <section className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 md:p-10 group shadow-sm transition-all hover:shadow-md">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Always Active • Ready to Help</span>
                </div>
                
                <h1 className="font-headline text-3xl md:text-5xl font-bold tracking-tight">
                    Hello, {profile?.name?.split(' ')[0] || "Educator"}!
                </h1>
                
                <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">
                    You've already created <span className="text-foreground font-semibold">{totalAssets} resources</span>.
                    {recentAssets?.[0] ? `Shall we continue with "${recentAssets[0].title}"?` : "What would you like to build first today?"}
                </p>
                
                <div className="flex flex-wrap gap-3 pt-2">
                    <Button size="lg" className="rounded-xl px-8 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" asChild>
                        <Link href="/lesson-planner">
                            <Plus className="mr-2 h-4 w-4" />
                            New Classroom Resource
                        </Link>
                    </Button>
                    <Button size="lg" variant="secondary" className="rounded-xl px-6 bg-muted/50 backdrop-blur-sm hover:bg-muted transition-all" onClick={startTour}>
                        <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                        Quick Introduction
                    </Button>
                </div>
            </div>
            
            <div className="hidden lg:flex relative">
                <div className="relative h-48 w-48 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 flex items-center justify-center backdrop-blur-2xl">
                    <Sparkles className="h-24 w-24 text-primary opacity-60 animate-pulse" />
                </div>
            </div>
        </div>
      </section>

      {/* Main Experience Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Your Recent Work - The Heart of the Dashboard */}
        <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resume your latest work</h3>
                <Link href="/workspace" className="text-[10px] font-bold uppercase text-primary hover:underline">See All Documents</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentAssets?.length > 0 ? (
                    recentAssets.slice(0, 3).map((asset: any) => {
                        const isLesson = asset.type === 'lesson-plan';
                        const accentColor = isLesson ? 'text-emerald-500' : 'text-indigo-500';
                        const bgColor = isLesson ? 'bg-emerald-500/10' : 'bg-indigo-500/10';
                        
                        return (
                            <Link key={asset.id} href={`/workspace?folder=${asset.folderId}&asset=${asset.id}`} className="group">
                                <SpotlightCard className="h-full bg-card border-border hover:border-primary/40 transition-all p-6 relative overflow-hidden">
                                    <div className={`absolute top-0 left-0 w-1 h-full ${isLesson ? 'bg-emerald-500' : 'bg-indigo-500'} opacity-50`} />
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className={`h-10 w-10 flex items-center justify-center rounded-xl ${bgColor} ${accentColor} transition-colors`}>
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div className="text-[10px] font-bold text-muted-foreground/30 group-hover:text-primary transition-colors">
                                                Edit Now →
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-sm truncate">{asset.title}</h4>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{asset.type?.replace(/-/g, ' ')}</p>
                                        </div>
                                    </div>
                                </SpotlightCard>
                            </Link>
                        );
                    })
                ) : (
                    <div className="col-span-3 h-32 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl opacity-40 gap-2">
                        <Plus className="h-6 w-6" />
                        <p className="text-xs font-semibold">No documents found. Let's create your first one!</p>
                    </div>
                )}
            </div>
        </div>

        {/* Helpful Assistant Sidebar */}
        <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">What's Next?</h3>
            <Card className="bg-primary/10 border-primary/20 shadow-none relative overflow-hidden group">
                <div className="p-6 space-y-4 relative z-10">
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary fill-current" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Smart Suggestion</span>
                    </div>
                    <p className="text-xs font-bold leading-relaxed">
                        {recentAssets?.[0]?.type === 'lesson-plan' 
                          ? `Ready for a Quiz on "${recentAssets[0].title.slice(0, 15)}"?` 
                          : "Want to create visual aids for your topics?"}
                    </p>
                    <Button size="sm" className="w-full text-xs font-bold rounded-xl" asChild>
                        <Link href={recentAssets?.[0]?.type === 'lesson-plan' ? "/quiz-generator" : "/visual-aids"}>Start Generating</Link>
                    </Button>
                </div>
            </Card>
        </div>

        {/* Simplified Tool Grid */}
        <div className="lg:col-span-4 pt-6 space-y-6">
            <div className="flex items-center gap-4 px-2">
                <h3 className="text-sm font-bold text-foreground">Explore Teaching Tools</h3>
                <div className="h-px flex-1 bg-border/60" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4" data-tour="platform-grid">
                {tools.slice(0, 8).map((tool: any) => (
                    <Link key={tool.href} href={tool.href} className="group flex flex-col items-center gap-3">
                        <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-card border border-border group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300 group-hover:-translate-y-1 shadow-sm">
                            {React.cloneElement(tool.icon, { className: "h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" })}
                        </div>
                        <span className="text-xs font-bold text-center tracking-tight leading-none group-hover:text-primary transition-colors">{tool.title}</span>
                    </Link>
                ))}
            </div>
        </div>
      </div>
      
      {/* Friendly Footer */}
      <div className="flex items-center justify-center pt-10 border-t border-border/50">
         <div className="flex items-center gap-2 opacity-30">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Learnivo • Empowering Educators</span>
         </div>
      </div>
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

  const recentAssets = React.useMemo(() => {
    const allAssets: any[] = [];
    assetTypeFolders.forEach(folder => {
        folder.assets.forEach(asset => {
            allAssets.push({ ...asset, folderId: folder.id });
        });
    });
    return allAssets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [assetTypeFolders]);

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
            recentAssets={recentAssets}
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
