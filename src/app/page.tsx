
"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight, CheckCircle, Sparkles, Star, Building, User, GraduationCap, Grid3x3, Building2, Layers, Map, HelpCircle, ScanLine, Phone, MapPin, Mail as MailIcon, DraftingCompass, MessageCircle, GitBranch, Menu, Calculator, Brain, PenTool, ClipboardCheck, Book, Gavel, FileText, Library, Layout, MessageSquare, Scale, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useRef, useEffect, type MouseEvent, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUser } from "@/firebase";
import { UserNav } from "@/components/layout/user-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { LandingHeader } from "@/components/layout/landing-header";
import { LandingFooter } from "@/components/layout/landing-footer";

const DashboardWireframe = () => (
    <div className="relative w-full max-w-[280px] xs:max-w-sm sm:max-w-xl lg:max-w-5xl mx-auto">
        {/* Background Glows */}
        <div className="absolute -inset-4 rounded-full bg-primary/10 blur-[100px] opacity-0 transition-opacity duration-1000"></div>

        {/* Main Mockup Layer - Straight Layout, Cropped Bottom */}
        <div className="relative w-full rounded-t-2xl md:rounded-t-[2rem] rounded-b-none border-t border-x border-white/60 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 pt-2 px-2 sm:pt-3 sm:px-3 pb-0 shadow-2xl backdrop-blur-md overflow-hidden border-b-0 h-[150px] xs:h-[200px] sm:h-[250px] md:h-[300px] lg:h-[320px] xl:h-[380px] transition-colors duration-700">
            <div className="w-full h-full rounded-t-xl md:rounded-t-[1.5rem] rounded-b-none overflow-hidden border-t border-x border-black/5 dark:border-white/10 bg-slate-100 dark:bg-zinc-950/50 flex border-b-0 relative transition-colors duration-700">
                <div role="presentation" className="absolute inset-0 bg-slate-100 dark:bg-zinc-900 aspect-video w-full h-[600px] -z-10 animate-pulse hidden" />
                <img 
                   src="/landing.png" 
                   alt="Learnivo Dashboard Interface" 
                   className="w-full h-full object-cover object-top block text-transparent bg-slate-100 dark:bg-zinc-900 rounded-b-none"
                   loading="lazy"
                   onError={(e) => {
                     // Fallback placeholder gradient when user hasn't uploaded landing.png yet
                     e.currentTarget.style.background = 'linear-gradient(135deg, #f1f5f9, #e2e8f0)';
                   }}
                />
            </div>
        </div>
    </div>
);

const features = [
  {
    icon: <DraftingCompass className="h-8 w-8" />,
    title: "Lesson Planner",
    description: "Generate comprehensive weekly and daily lesson plans aligned with global standards.",
  },
  {
    icon: <Layers className="h-8 w-8" />,
    title: "Visual Aids",
    description: "Instantly create simple drawings, diagrams, and charts to explain complex academic topics.",
  },
  {
    icon: <Calculator className="h-8 w-8" />,
    title: "Math Helper",
    description: "Solve complex mathematical problems from a photo with step-by-step logical explanations.",
  },
  {
    icon: <Map className="h-8 w-8" />,
    title: "Hyper-Local Content",
    description: "Generate stories and examples tailored to your students' local language and cultural context.",
  },
  {
    icon: <PenTool className="h-8 w-8" />,
    title: "Story Generator",
    description: "Create engaging and values-based creative stories for any grade level or moral objective.",
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: "Knowledge Base",
    description: "Get instant, simple, and scientifically accurate answers to complex student questions.",
  },
  {
    icon: <MailIcon className="h-8 w-8" />,
    title: "Parent Communication",
    description: "Draft professional, empathetic, and culturally appropriate emails to parents in seconds.",
  },
  {
    icon: <ScanLine className="h-8 w-8" />,
    title: "Paper Digitizer",
    description: "Convert physical, handwritten question papers into editable digital documents with AI precision.",
  },
  {
    icon: <HelpCircle className="h-8 w-8" />,
    title: "Quiz Generator",
    description: "Build adaptive assessments and multiple-choice questions from any source text instantly.",
  },
  {
    icon: <Scale className="h-8 w-8" />,
    title: "Rubric Generator",
    description: "Create detailed, fair, and customized grading rubrics for any assignment or project.",
  },
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: "Debate Generator",
    description: "Generate engaging debate topics, pro/con arguments, and research materials for classrooms.",
  },
  {
    icon: <Library className="h-8 w-8" />,
    title: "Digital Library",
    description: "Organize and manage all your digital textbooks, notes, and generated educational assets.",
  }
];


export default function LandingPage() {
  const { user, profile, isUserLoading, isProfileLoading } = useUser();
  const heroImage = PlaceHolderImages.find((img) => img.id === "dashboard-preview");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"teacher" | "student" | null>(null);
  const router = useRouter();

  const handleRoleSelect = (role: "teacher" | "student") => {
    setSelectedRole(role);
    if (role === 'teacher') {
      router.push('/signup/teacher');
    } else {
      router.push('/signup/student');
    }
  };
  
  // Hero Spotlight Logic
  const heroRef = useRef<HTMLDivElement>(null);
  const handleHeroMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const hero = heroRef.current;
    if (hero) {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      hero.style.setProperty('--hero-mouse-x', `${x}px`);
      hero.style.setProperty('--hero-mouse-y', `${y}px`);
    }
  };
  
  const SpotlightCard = ({ children, className, ...props }: { children: React.ReactNode; className?: string, onClick?: () => void }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
      }
    };

    return (
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className={cn("spotlight-card rounded-xl", className)}
        {...props}
      >
        {children}
      </div>
    );
  };
  
  const isLoading = useMemo(() => isUserLoading || isProfileLoading, [isUserLoading, isProfileLoading]);

  /* 
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        return;
      }

      if (!profile || !profile.hasCompletedOnboarding) {
        router.replace('/onboarding');
        return;
      }

      const dashboardPath = profile.role === 'Student' ? '/student/dashboard' : '/dashboard';
      router.replace(dashboardPath);
    }
  }, [user, profile, isLoading, router]);
  */
  


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="flex min-h-screen w-full flex-col bg-background text-foreground relative pt-0">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

        <LandingHeader />

        <main className="flex-1 w-full px-2 sm:px-4 md:px-6 pt-2 md:pt-4 mb-12">
          <div 
             ref={heroRef}
             onMouseMove={handleHeroMouseMove}
             className="relative overflow-hidden bg-[#F8F9FA] dark:bg-zinc-900/40 rounded-[2.5rem] w-full max-w-[1920px] mx-auto border border-black/5 dark:border-white/5 group/hero"
          >
            {/* Interactive Spotlight Glow */}
            <div 
              className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-500 blur-[80px]"
              style={{
                background: `radial-gradient(500px circle at var(--hero-mouse-x, 50%) var(--hero-mouse-y, 50%), hsl(var(--primary) / 0.15), transparent 40%)`
              }}
            />
            {/* massive gradient background mimicking the screenshot but using primary green */}
            <div className="absolute inset-x-0 bottom-0 top-[30%] bg-[radial-gradient(ellipse_120%_100%_at_50%_100%,hsl(var(--primary)/0.25),transparent_70%)] dark:bg-[radial-gradient(ellipse_120%_100%_at_50%_100%,hsl(var(--primary)/0.35),transparent_70%)] z-0 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 top-[50%] bg-[radial-gradient(ellipse_80%_80%_at_50%_100%,hsl(var(--primary)/0.3),transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_100%,hsl(var(--primary)/0.4),transparent_70%)] z-0 pointer-events-none" />
            
            {/* Grid Pattern overlaid (Pure CSS) */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-50 dark:opacity-30" style={{ backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'linear-gradient(to bottom, transparent, black 80%, black)' }} />
            <div className="hidden dark:block absolute inset-0 z-0 pointer-events-none opacity-50" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'linear-gradient(to bottom, transparent, black 80%, black)' }} />

            <section className="container mx-auto px-4 xs:px-6 flex flex-col items-center text-center pt-20 md:pt-28 lg:pt-[100px] relative z-10 pb-0">
                <div className="inline-block rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 px-5 py-1.5 text-xs font-bold tracking-widest text-slate-800 dark:text-zinc-200 uppercase mb-8 shadow-sm">
                  AI for Indian Education
                </div>
                
                <h1 className="font-headline text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[4.5rem] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05] max-w-[900px] mx-auto">
                  The Ultimate <span className="text-primary drop-shadow-sm">EdTech AI</span> for Modern Schools.
                </h1>
                
                <p className="mt-8 max-w-[700px] text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed mx-auto">
                  A powerful AI-driven platform for Indian educators and students. Automate lesson planning, master complex topics, and manage learning tasks securely and efficiently.
                </p>
                
                <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                  {user ? (
                     <Button size="lg" className="rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 dark:bg-white dark:border-transparent dark:hover:bg-zinc-200 dark:text-black font-semibold h-12 px-8 shadow-lg shadow-black/5 dark:shadow-white/5 w-full sm:w-auto text-sm transition-all" asChild>
                      <Link href={profile?.role === 'Student' ? "/student/dashboard" : "/dashboard"}>
                        Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <DialogTrigger asChild>
                      <Button size="lg" className="rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 dark:bg-white dark:border-transparent dark:hover:bg-zinc-200 dark:text-black font-semibold h-12 px-8 shadow-lg shadow-black/5 dark:shadow-white/5 w-full sm:w-auto text-sm transition-all">
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                  )}
                  {/* Kept "Learn More" minimal like a ghost button to let "Get Started" shine like the image */}
                  <Button size="lg" variant="ghost" className="rounded-full h-12 px-6 w-full sm:w-auto text-sm hover:bg-slate-100 dark:hover:bg-white/10 hidden sm:flex">
                    Learn More
                  </Button>
                </div>
                
                <div className="mt-6 md:mt-8 flex flex-row items-center gap-3 justify-center">
                  <div className="flex -space-x-2">
                    <Avatar className="border-2 border-background h-8 w-8 sm:h-10 sm:w-10 transition-transform hover:scale-110">
                      <AvatarImage src="https://picsum.photos/seed/teacher1/40/40" />
                      <AvatarFallback>T1</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background h-8 w-8 sm:h-10 sm:w-10 transition-transform hover:scale-110">
                      <AvatarImage src="https://picsum.photos/seed/teacher2/40/40" />
                      <AvatarFallback>T2</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background h-8 w-8 sm:h-10 sm:w-10 transition-transform hover:scale-110">
                      <AvatarImage src="https://picsum.photos/seed/teacher3/40/40" />
                      <AvatarFallback>T3</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-xs md:text-sm text-slate-900 dark:text-zinc-200">Trusted by over 30 educators</p>
                    <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 mt-0.5">Saving an average of 10+ hours per week.</p>
                  </div>
                </div>
                
                <div className="w-full flex justify-center mt-6 md:mt-8 pb-0 relative">
                   <div className="relative w-full max-w-5xl mx-auto px-4 md:px-0">
                      {/* Using the dashboard Wireframe inside */}
                      <DashboardWireframe />
                   </div>
                </div>
            </section>
          </div>

          {/* Trusted Brand Logos Bar (Outside Hero) */}
          <section className="w-full py-8 md:py-10 border-b border-black/5 dark:border-white/5 bg-background">
              <div className="container mx-auto px-4 max-w-5xl">
                  <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 lg:gap-20 opacity-70 dark:opacity-50 grayscale filter hover:grayscale-0 transition-all duration-300">
                      <div className="font-serif font-bold text-xl md:text-2xl tracking-tight text-slate-800 dark:text-slate-200">The Doon School</div>
                      <div className="font-sans font-bold text-lg md:text-xl tracking-tight flex items-center gap-2"><BookOpen className="w-6 h-6 text-primary" /> St. Xavier's</div>
                      <div className="font-serif italic font-bold text-xl md:text-2xl text-slate-800 dark:text-slate-200">Delhi Public School</div>
                      <div className="font-semibold text-lg md:text-xl tracking-tight uppercase flex items-center gap-2 text-slate-800 dark:text-slate-200">Kendriya Vidyalaya</div>
                      <div className="font-bold text-xl md:text-2xl tracking-tighter text-slate-800 dark:text-slate-200">DAV Public</div>
                  </div>
              </div>
          </section>

          <section id="features" className="container py-16 md:py-24 lg:py-28 relative z-10">
              <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
                  <h2 className="font-headline text-4xl font-bold md:text-5xl">
                      Empowering Education, One Tool at a Time
                  </h2>
                  <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                      Learnivo AI provides a suite of intelligent tools designed to tackle daily challenges, freeing up teachers to teach and students to learn.
                  </p>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Row 1: Large + Medium */}
                  <SpotlightCard className="lg:col-span-2 border bg-card text-card-foreground p-8 text-left transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 flex flex-col md:flex-row gap-6 items-center">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          {features[0].icon}
                      </div>
                      <div>
                        <h3 className="font-headline text-2xl font-bold">{features[0].title}</h3>
                        <p className="mt-2 text-muted-foreground text-lg leading-relaxed">{features[0].description}</p>
                      </div>
                  </SpotlightCard>
                  
                  <SpotlightCard className="border bg-card text-card-foreground p-6 text-left transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 flex flex-col">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {features[1].icon}
                      </div>
                      <h3 className="font-headline text-xl font-bold">{features[1].title}</h3>
                      <p className="mt-2 text-muted-foreground">{features[1].description}</p>
                  </SpotlightCard>

                  {/* Row 2: Medium + Large */}
                  <SpotlightCard className="border bg-card text-card-foreground p-6 text-left transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 flex flex-col">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {features[2].icon}
                      </div>
                      <h3 className="font-headline text-xl font-bold">{features[2].title}</h3>
                      <p className="mt-2 text-muted-foreground">{features[2].description}</p>
                  </SpotlightCard>

                  <SpotlightCard className="lg:col-span-2 border bg-card/40 p-8 text-left transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 flex flex-col md:flex-row-reverse gap-6 items-center">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          {features[3].icon}
                      </div>
                      <div className="md:text-right">
                        <h3 className="font-headline text-2xl font-bold">{features[3].title}</h3>
                        <p className="mt-2 text-muted-foreground text-lg leading-relaxed">{features[3].description}</p>
                      </div>
                  </SpotlightCard>

                  {/* Row 3: Three Small/Medium */}
                  <SpotlightCard className="border bg-card text-card-foreground p-6 text-left transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 flex flex-col">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {features[4].icon}
                      </div>
                      <h3 className="font-headline text-xl font-bold">{features[4].title}</h3>
                      <p className="mt-2 text-muted-foreground">{features[4].description}</p>
                  </SpotlightCard>

                  <SpotlightCard className="border bg-card text-card-foreground p-6 text-left transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 flex flex-col">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {features[5].icon}
                      </div>
                      <h3 className="font-headline text-xl font-bold">{features[5].title}</h3>
                      <p className="mt-2 text-muted-foreground">{features[5].description}</p>
                  </SpotlightCard>

                  <SpotlightCard className="border bg-card text-card-foreground p-6 text-left transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 flex flex-col">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {features[8].icon}
                      </div>
                      <h3 className="font-headline text-xl font-bold">{features[8].title}</h3>
                      <p className="mt-2 text-muted-foreground">{features[8].description}</p>
                  </SpotlightCard>

                  {/* Row 4: One Wide Bottom Tool */}
                  <SpotlightCard className="lg:col-span-3 border bg-card text-card-foreground p-8 text-left transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 flex flex-col md:flex-row gap-8 items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            {features[7].icon}
                        </div>
                        <div>
                            <h3 className="font-headline text-2xl font-bold">{features[7].title}</h3>
                            <p className="mt-2 text-muted-foreground md:max-w-xl">{features[7].description}</p>
                        </div>
                      </div>
                      <Button className="shrink-0 rounded-full h-12 px-8">Launch Tool</Button>
                  </SpotlightCard>
              </div>
          </section>

          <section id="pricing" className="container py-16 md:py-24 lg:py-28 relative z-10">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <h2 className="font-headline text-4xl font-bold md:text-5xl">
                A Plan for Every Classroom
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                Choose the plan that fits your needs. Start for free and upgrade anytime to unlock powerful new capabilities.
              </p>
            </div>

            <div className="mt-12 relative">
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto pb-8 md:pb-0 snap-x snap-mandatory scrollbar-hide px-4 -mx-4 md:px-0 md:mx-0">
{/* Basic Plan */}
        <div className="shrink-0 w-[85%] sm:w-[70%] md:w-full snap-center">
          <SpotlightCard className="h-full flex flex-col border bg-card text-card-foreground p-6 sm:p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
                    <h3 className="font-headline text-2xl font-bold">Basic</h3>
                    <p className="mt-2 min-h-[3rem] text-muted-foreground">For individuals exploring the power of AI.</p>
                    <p className="my-6 font-headline text-5xl font-bold">Free</p>
                    <h4 className="font-semibold mb-4 text-foreground">Features:</h4>
                    <ul className="space-y-3 text-sm sm:text-base text-muted-foreground mb-8">
                      <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" /> <span>5 uses/month of basic AI tools</span></li>
                      <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" /> <span>Workspace & Library access</span></li>
                      <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" /> <span>Community Support</span></li>
                    </ul>
                    <Button variant="outline" className="mt-auto w-full h-12 rounded-full">Get Started</Button>
                  </SpotlightCard>
                </div>

                {/* Pro Plan */}
                <div className="shrink-0 w-[85%] sm:w-[70%] md:w-full snap-center">
                  <SpotlightCard className="h-full relative flex flex-col border-2 border-primary bg-primary/10 p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
                    <h3 className="font-headline text-2xl font-bold">Pro</h3>
                    <p className="mt-2 min-h-[3rem] text-muted-foreground">For individual teachers and students who want to unlock the full potential of AI.</p>
                    <p className="my-6 font-headline text-5xl font-bold">₹499<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                    <h4 className="font-semibold mb-4 text-foreground">Features:</h4>
                    <ul className="space-y-3 text-sm sm:text-base text-muted-foreground mb-8">
                      <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" /> <span>Unlimited Lesson Plans & Quizzes</span></li>
                      <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" /> <span><strong>100 Credits / month</strong> for premium tools</span></li>
                      <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" /> <span>AI-powered evaluation</span></li>
                      <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" /> <span>Priority Support</span></li>
                    </ul>
                    <Button className="mt-auto w-full h-12 rounded-full shadow-lg shadow-primary/30">Upgrade to Pro</Button>
                  </SpotlightCard>
                </div>

{/* Institute Plan */}
        <div className="shrink-0 w-[85%] sm:w-[70%] md:w-full snap-center">
          <SpotlightCard className="h-full flex flex-col border bg-card text-card-foreground p-6 sm:p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
                    <h3 className="font-headline text-2xl font-bold">Institute</h3>
                    <p className="mt-2 min-h-[3rem] text-muted-foreground">For schools and educational institutions.</p>
                    <p className="my-6 font-headline text-5xl font-bold">Custom</p>
                    <h4 className="font-semibold mb-4 text-foreground">Features:</h4>
                    <ul className="space-y-3 text-sm sm:text-base text-muted-foreground mb-8">
                      <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" /> <span>All Pro features for every user</span></li>
                      <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" /> <span><strong>Unlimited credits</strong> for all users</span></li>
                      <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" /> <span>Admin dashboard & analytics</span></li>
                      <li className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" /> <span>Dedicated support & training</span></li>
                    </ul>
                    <Button variant="outline" className="mt-auto w-full h-12 rounded-full">Contact Sales</Button>
                  </SpotlightCard>
                </div>
              </div>
              
              {/* Mobile scroll indicator */}
              <div className="flex md:hidden justify-center gap-1.5 mt-2">
                <div className="h-1.5 w-6 rounded-full bg-primary/20"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-primary/10"></div>
                <div className="h-1.5 w-1.5 rounded-full bg-primary/10"></div>
              </div>
            </div>
          </section>

          <section id="testimonials" className="container py-16 md:py-24 lg:py-28 relative z-10">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <h2 className="font-headline text-4xl font-bold md:text-5xl">
                Loved by Educators Across India
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                See what teachers and students are saying about how Learnivo AI is transforming their classrooms and saving them time.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <SpotlightCard className="flex flex-col justify-between border bg-card text-card-foreground p-6">
                <div>
                  <div className="flex gap-0.5 mb-4">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </div>
                  <p className="text-muted-foreground">"Learnivo AI has been a game-changer. The lesson planner saves me hours every week, and the hyper-local content is something my students absolutely love. It's an indispensable tool."</p>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/priya/40/40" />
                    <AvatarFallback>PS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Priya Sharma</p>
                    <p className="text-sm text-muted-foreground">Science Teacher, Delhi Public School</p>
                  </div>
                </div>
              </SpotlightCard>
              <SpotlightCard className="flex flex-col justify-between border bg-card text-card-foreground p-6">
                <div>
                  <div className="flex gap-0.5 mb-4">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </div>
                  <p className="text-muted-foreground">"I was skeptical about AI in the classroom, but this tool has made my life so much easier. The quiz generator is fantastic for quick assessments. Highly recommended!"</p>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/arjun/40/40" />
                    <AvatarFallback>AR</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Arjun Rao</p>
                    <p className="text-sm text-muted-foreground">Math Teacher, Kendriya Vidyalaya</p>
                  </div>
                </div>
              </SpotlightCard>
              <SpotlightCard className="flex flex-col justify-between border bg-card text-card-foreground p-6">
                <div>
                  <div className="flex gap-0.5 mb-4">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </div>
                  <p className="text-muted-foreground">"The ability to generate content in regional languages is what sets Learnivo AI apart. My students feel more connected to the material. It's a wonderful assistant for any Indian teacher."</p>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/sunita/40/40" />
                    <AvatarFallback>SK</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Sunita Kulkarni</p>
                    <p className="text-sm text-muted-foreground">History Teacher, Pune</p>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </section>

          <section className="py-24 bg-card/20">
            <div className="container mx-auto px-6 text-center">
              <h2 className="font-headline text-3xl font-bold text-foreground">
                Join our newsletter to stay updated.
              </h2>
              <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
                Get the latest news, feature updates, and educational insights delivered straight to your inbox.
              </p>
              <div className="mt-8 max-w-md mx-auto space-y-4">
                <div className="relative group">
                  <MailIcon className="absolute left-4 top-5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Enter your email"
                    className="w-full bg-background border-border pl-12 pr-4 sm:pr-36 rounded-full h-14 focus-visible:ring-primary/20"
                  />
                  <Button className="hidden sm:inline-flex absolute right-2 top-2 h-10 rounded-full px-6 shadow-lg shadow-primary/20">
                    Subscribe
                  </Button>
                </div>
                <Button className="sm:hidden w-full h-12 rounded-full shadow-lg shadow-primary/20">
                  Subscribe
                </Button>
              </div>
            </div>
          </section>
        </main>

        <LandingFooter />
      </div>
      <DialogContent className="p-0 border-none sm:max-w-2xl bg-transparent">
        <div className="animated-border rounded-lg">
          <div className="bg-background rounded-lg">
              <DialogHeader className="items-center text-center p-6 pb-0">
                <p className="text-primary font-semibold">Onboarding</p>
                <DialogTitle className="font-headline text-3xl font-bold">Choose Your Role</DialogTitle>
                <DialogDescription className="max-w-md">
                    Select your role to personalize your experience. This will determine the tools and features you have access to.
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 p-6">
                 <div className="animated-border rounded-xl">
<SpotlightCard 
            className={cn(
              "border-2 border-transparent p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 h-full bg-card text-card-foreground",
              selectedRole === 'teacher' ? 'border-primary bg-primary/10 shadow-lg' : ''
            )}
            onClick={() => handleRoleSelect('teacher')}
          >
                        <div className="flex items-center justify-center h-32 w-32 rounded-lg bg-muted/70 mb-4">
                        <User className="h-16 w-16 text-muted-foreground" />
                        </div>
                        <h3 className="font-bold text-lg">Teacher</h3>
                    </SpotlightCard>
                </div>
                 {/* <div className="animated-border rounded-xl">
                    <SpotlightCard
                        className={cn(
                            "border-2 border-transparent p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 h-full bg-card",
                            selectedRole === 'student' ? 'border-primary bg-primary/10 shadow-lg' : ''
                        )}
                        onClick={() => handleRoleSelect('student')}
                    >
                        <div className="flex items-center justify-center h-32 w-32 rounded-lg bg-muted/70 mb-4">
                        <GraduationCap className="h-16 w-16 text-muted-foreground" />
                        </div>
                        <h3 className="font-bold text-lg">Student</h3>
                    </SpotlightCard>
                </div> */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
