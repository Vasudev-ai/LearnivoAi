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
  ArrowLeft,
  Loader2,
  CheckCircle2,
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
import { Markdown } from "@/components/markdown";
import { generateLessonPlanAction } from "@/app/actions/generate-lesson-plan";
import { useToast } from "@/hooks/use-toast";

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

const ModernDashboard = ({ tools, profile, user, dashboardVersion, setDashboardVersion, greetingMessage }: any) => {
  const router = useRouter();
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [view, setView] = React.useState<"home" | "result">("home");

  const suggestions = [
    { label: "Plan a Solar System Lesson", icon: <DraftingCompass className="h-3 w-3" />, prompt: "Plan a comprehensive lesson on the Solar System for Grade 5" },
    { label: "Generate Algebra Quiz", icon: <HelpCircle className="h-3 w-3" />, prompt: "Generate a 10-question Algebra quiz on linear equations" },
    { label: "Draft Parent Email", icon: <Mail className="h-3 w-3" />, prompt: "Draft a professional email to parents about upcoming parent-teacher meeting" },
  ];

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) return;

    // Immersion Flow: Stay in Chat!
    setView("result");
    setIsGenerating(true);
    setResult(null);

    const performGeneration = async (isRetry = false) => {
        try {
            // First attempt: try to generate
            const output: any = await generateLessonPlanAction({
                topic: finalQuery,
                grade: profile?.defaultGrade || "Intermediate",
                subject: "General",
                objectives: "Generate a detailed and concise response. If it's a lesson, make it professional. If it's a quiz, provide questions."
            });

            if (output) {
                if (output.plan) {
                    let markdownResult = `# ${output.title || 'Generated Plan'}\n\n`;
                    Object.entries(output.plan).forEach(([day, details]: [string, any]) => {
                        markdownResult += `## ${day.replace('_', ' ').toUpperCase()}: ${details.sub_topic}\n`;
                        markdownResult += `**Objectives:**\n${details.learning_objectives.map((o: string) => `- ${o}`).join('\n')}\n\n`;
                        markdownResult += `**Activities:**\n${details.activities.map((a: any) => `- ${a.name} (${a.duration})`).join('\n')}\n\n`;
                        markdownResult += `**Assessment:** ${details.assessment}\n\n`;
                    });
                    setResult(markdownResult);
                } else if (typeof output === 'string') {
                    setResult(output);
                } else if (output.content) {
                    setResult(output.content);
                } else {
                    setResult(JSON.stringify(output, null, 2));
                }
            }
        } catch (error: any) {
            throw error;
        }
    };

    try {
        await performGeneration();
    } catch (error: any) {
        toast({
            title: "Generation Error",
            description: error.message || "Please refresh and try again.",
            variant: "destructive"
        });
        setView("home");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-100px)] flex flex-col items-center overflow-hidden">
      {/* Immersive Neural Background */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.04] dark:bg-primary/[0.08] blur-[120px] rounded-full" />
      </div>

      {/* Floating Toggle Hub - Hidden in Result View */}
      {view === 'home' && (
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
      )}

      {/* RESULT VIEW STAGE */}
      <AnimatePresence mode="wait">
        {view === 'result' ? (
            <motion.div 
                key="result-stage"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 w-full max-w-[1400px] px-8 py-12 flex flex-col gap-10"
            >
                {/* Result Header Navigation */}
                <div className="flex items-center justify-between border-b border-border/40 pb-6">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => { setView('home'); setResult(null); }}
                        className="rounded-xl px-4 text-xs font-bold text-muted-foreground hover:text-foreground group"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Button>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Immersion Active</span>
                    </div>
                </div>

                {/* Content Generation Area */}
                <div className="flex-1 min-h-0 relative overflow-hidden">
                    <div className="h-full overflow-y-auto scrollbar-hide py-4">
                        {isGenerating ? (
                            <div className="flex flex-col items-center justify-center h-full space-y-8">
                                <div className="relative scale-125">
                                    <div className="absolute inset-0 bg-primary/25 blur-3xl animate-pulse rounded-full" />
                                    <div className="relative h-20 w-20 rounded-[1.5rem] bg-card border border-primary/20 flex items-center justify-center shadow-[0_0_50px_-10px_rgba(var(--primary-rgb),0.3)]">
                                        <Sparkles className="h-10 w-10 text-primary animate-bounce" />
                                    </div>
                                </div>
                                <div className="space-y-3 text-center">
                                    <h3 className="text-3xl font-bold tracking-tight text-foreground/90">Sculpting...</h3>
                                    <p className="text-lg text-muted-foreground font-medium italic animate-pulse opacity-60">Preparing your expansive workspace.</p>
                                </div>
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-card/40 backdrop-blur-[40px] border border-border/60 rounded-[2.5rem] p-12 md:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_50px_120px_-30px_rgba(0,0,0,0.7)]"
                            >
                                <Markdown content={result || ""} className="prose-lg max-w-none" />
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Follow-up Command Bar */}
                <div className="shrink-0 pt-6 pb-2 self-center w-full max-w-4xl">
                     <form onSubmit={handleSearch} className="relative flex items-center bg-card/80 backdrop-blur-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] border border-border/80 rounded-3xl p-3 group transition-all duration-500 focus-within:ring-8 focus-within:ring-primary/5 focus-within:border-primary/20">
                        <div className="h-12 w-12 rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground/30">
                            <Plus className="h-5 w-5" />
                        </div>
                        <div className="flex-1 px-4">
                            <input 
                                type="text" 
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Any follow-up questions?" 
                                className="w-full bg-transparent border-none outline-none text-lg font-medium placeholder:text-muted-foreground/30 text-foreground px-1"
                            />
                        </div>
                        <Button type="submit" size="icon" disabled={isGenerating} className="h-12 w-12 rounded-xl bg-foreground text-background">
                            <ArrowRight className="h-6 w-6" />
                        </Button>
                    </form>
                </div>
            </motion.div>
        ) : (
            <motion.div 
                key="home-stage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 flex flex-col items-center justify-center gap-12 px-8 max-w-[1400px] mx-auto overflow-visible w-full h-full"
            >
                {/* Agentic Hero Section */}
                <motion.section 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground/90 leading-tight">
                        {greetingMessage.split(',')[0]}, <br/>
                        <span className="text-primary/80">{greetingMessage.split(',')[1]}</span>
                    </h1>
                    <p className="text-2xl md:text-3xl font-medium text-muted-foreground/40 tracking-tight italic">
                        Your intelligent classroom agent is ready.
                    </p>
                </motion.section>

                {/* The Action Command Hub */}
                <div className="w-full max-w-4xl flex flex-col items-center gap-6">
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
            </motion.div>
        )}
      </AnimatePresence>
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

  const greetingMessage = React.useMemo(() => {
    const hour = new Date().getHours();
    const name = profile?.name?.split(' ')[0] || "Educator";
    if (hour < 12) return `Good morning, ${name}. Ready for your first class?`;
    if (hour < 17) return `Good afternoon, ${name}. What are we teaching today?`;
    return `Good evening, ${name}. Let's prep for tomorrow.`;
  }, [profile]);

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
    // Keep local greeting sync for classic view
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex w-full flex-col gap-6 md:gap-8"
    >
      {(dashboardVersion as string) === 'classic' && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4"
      >
        <div className="space-y-1">
          <h1 className="font-headline text-2xl md:text-3xl font-bold break-all">
            {greetingMessage}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
              Ready to create something amazing? Your AI assistant is here to help.
          </p>
        </div>
        <div className="flex shrink-0 items-center rounded-full border bg-muted/50 p-1">
            <Button 
                variant={(dashboardVersion as string) === 'classic' ? 'secondary' : 'ghost'} 
                size="sm" 
                className="rounded-full px-4 text-xs h-8"
                onClick={() => setDashboardVersion('classic')}
            >
                <LayoutGrid className="mr-2 h-3.5 w-3.5" />
                Classic
            </Button>
            <Button 
                variant={(dashboardVersion as string) === 'modern' ? 'secondary' : 'ghost'} 
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
            greetingMessage={greetingMessage}
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
