"use client";

import { useRouter } from "next/navigation";

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

const ModernDashboard = ({ tools, profile, user, dashboardVersion, setDashboardVersion }: any) => {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  const suggestions = [
    { label: "Plan a Solar System Lesson", icon: <DraftingCompass className="h-3 w-3" />, prompt: "Plan a comprehensive lesson on the Solar System for Grade 5" },
    { label: "Generate Algebra Quiz", icon: <HelpCircle className="h-3 w-3" />, prompt: "Generate a 10-question Algebra quiz on linear equations" },
    { label: "Draft Parent Email", icon: <Mail className="h-3 w-3" />, prompt: "Draft a professional email to parents about upcoming parent-teacher meeting" },
  ];

  const handleSearch = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) return;

    const lowerQuery = finalQuery.toLowerCase();
    
    // Smart Keyword Routing
    if (lowerQuery.includes("quiz") || lowerQuery.includes("test") || lowerQuery.includes("exam")) {
        router.push(`/quiz-generator?prompt=${encodeURIComponent(finalQuery)}`);
    } else if (lowerQuery.includes("math") || lowerQuery.includes("calculate") || lowerQuery.includes("solve")) {
        router.push(`/math-helper?prompt=${encodeURIComponent(finalQuery)}`);
    } else if (lowerQuery.includes("story") || lowerQuery.includes("tale") || lowerQuery.includes("poem")) {
        router.push(`/story-generator?prompt=${encodeURIComponent(finalQuery)}`);
    } else if (lowerQuery.includes("email") || lowerQuery.includes("parent") || lowerQuery.includes("message")) {
        router.push(`/parent-communication?prompt=${encodeURIComponent(finalQuery)}`);
    } else {
        // Default to Lesson Planner
        router.push(`/lesson-planner?prompt=${encodeURIComponent(finalQuery)}`);
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-100px)] flex flex-col items-center justify-center overflow-hidden">
      {/* Immersive Neural Background */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.04] dark:bg-primary/[0.08] blur-[120px] rounded-full" />
      </div>

      {/* Floating Toggle Hub */}
      <div className="absolute top-8 right-8 z-[60] flex items-center gap-4">
          <div className="flex shrink-0 items-center rounded-xl border border-border/40 bg-card/40 backdrop-blur-xl p-1 shadow-2xl">
              <Button 
                  variant={dashboardVersion === 'classic' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className="rounded-lg px-4 text-[10px] font-bold uppercase tracking-widest h-8"
                  onClick={() => setDashboardVersion('classic')}
              >
                  Classic
              </Button>
              <Button 
                  variant={dashboardVersion === 'modern' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className="rounded-lg px-4 text-[10px] font-bold uppercase tracking-widest h-8"
                  onClick={() => setDashboardVersion('modern')}
              >
                  Modern
              </Button>
          </div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-4 max-w-5xl mx-auto pb-20 overflow-visible w-full">
        
        {/* Agentic Hero Section */}
        <motion.section 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2"
        >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground/90">
                Hello, {profile?.name?.split(' ')[0] || "Educator"}
            </h1>
            <p className="text-xl md:text-3xl font-medium text-muted-foreground/30 tracking-tight">
                Let's make your teaching easier.
            </p>
        </motion.section>

        {/* The Action Command Hub */}
        <div className="w-full max-w-2xl flex flex-col items-center gap-4">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="w-full relative group"
            >
                <form onSubmit={handleSearch} className="relative flex items-center bg-slate-50/80 dark:bg-slate-900/40 backdrop-blur-3xl border border-slate-200 dark:border-border/80 rounded-2xl p-2.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_10px_40px_-10px_rgba(0,0,0,0.05)] transition-all duration-300 focus-within:border-primary/40 focus-within:shadow-[0_0_0_4px_rgba(var(--primary-rgb),0.05)]">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-muted/30 flex items-center justify-center text-slate-400 dark:text-muted-foreground/30">
                        <Plus className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 px-4">
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="What are we creating today?" 
                            className="w-full bg-transparent border-none outline-none text-lg font-medium placeholder:text-slate-300 dark:placeholder:text-muted-foreground/20 text-slate-700 dark:text-foreground px-1"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button 
                            type="submit"
                            size="icon" 
                            className="h-12 w-12 rounded-xl bg-foreground text-background hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                        >
                            <ArrowRight className="h-6 w-6" />
                        </Button>
                    </div>
                </form>
            </motion.div>

            {/* Smart Action Suggestions */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-2"
            >
                {suggestions.map((s, i) => (
                    <button 
                        key={i} 
                        onClick={() => {
                            setQuery(s.prompt);
                            handleSearch(undefined, s.prompt);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-100 dark:border-border/40 bg-white/50 dark:bg-muted/20 text-[11px] font-bold text-slate-400 dark:text-muted-foreground/60 hover:bg-white dark:hover:bg-muted/40 hover:text-primary transition-all hover:scale-105 active:scale-95 shadow-sm"
                    >
                        {s.icon}
                        {s.label}
                    </button>
                ))}
            </motion.div>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-2 pt-10">
            {tools.slice(0, 3).map((tool: any, i: number) => (
                <motion.div
                    key={tool.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1), duration: 0.5 }}
                >
                    <Link href={tool.href} className="group block h-full">
                        <Card className="h-full bg-slate-50/20 dark:bg-card/20 backdrop-blur-2xl border border-slate-200 dark:border-border/40 rounded-2xl p-8 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] dark:shadow-none transition-all duration-300 overflow-hidden group-hover:-translate-y-1 group-hover:border-primary/20 hover:shadow-lg">
                            <div className="space-y-6">
                                <div className="h-11 w-11 rounded-xl bg-[#D4FF44] flex items-center justify-center shadow-[0_8px_16px_rgba(212,255,68,0.2)]">
                                    {React.cloneElement(tool.icon, { className: "h-5 w-5 text-black" })}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-foreground/90">{tool.title}</h3>
                                    <p className="text-sm text-slate-400 dark:text-muted-foreground leading-relaxed font-medium line-clamp-2">
                                        {tool.description}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </motion.div>
            ))}
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
      {dashboardVersion === 'classic' && (
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
              Ready to create something amazing? Your AI assistant is here to help.
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
      )}

      {(dashboardVersion as string) === 'modern' ? (
        <ModernDashboard 
            tools={tools} 
            profile={profile} 
            user={user} 
            totalAssets={totalAssets} 
            dashboardVersion={dashboardVersion}
            setDashboardVersion={setDashboardVersion}
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
