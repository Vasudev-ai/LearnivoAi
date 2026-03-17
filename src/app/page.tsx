
"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight, CheckCircle, Sparkles, Star, Building, User, GraduationCap, Grid3x3, Building2, Layers, Map, HelpCircle, ScanLine, Phone, MapPin, Mail as MailIcon, DraftingCompass, MessageCircle, GitBranch, Menu } from "lucide-react";
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

const DashboardWireframe = () => (
    <div className="relative w-full max-w-[280px] xs:max-w-sm sm:max-w-xl lg:max-w-4xl group [perspective:2000px]">
        {/* Background Glows */}
        <div className="absolute -inset-10 rounded-full bg-primary/10 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        
        {/* Decorative Stacks (Multilayer) */}
        <div className="absolute -right-12 -bottom-12 h-full w-full rounded-2xl border border-white/5 bg-background/20 backdrop-blur-3xl transform [transform:rotateX(10deg)_rotateY(-20deg)_rotateZ(2deg)_skewX(-5deg)] scale-90 opacity-20 transition-all duration-700 group-hover:opacity-30"></div>
        <div className="absolute -right-6 -bottom-6 h-full w-full rounded-2xl border border-white/10 bg-background/40 backdrop-blur-2xl transform [transform:rotateX(10deg)_rotateY(-20deg)_rotateZ(2deg)_skewX(-5deg)] scale-95 opacity-40 transition-all duration-700 group-hover:opacity-50"></div>

        {/* Main Mockup Layer */}
        <div className="relative h-full w-full rounded-2xl border border-white/20 bg-card/60 p-2 shadow-2xl shadow-primary/20 backdrop-blur-md shadow-glow transform [transform-style:preserve-3d] [transform:rotateX(10deg)_rotateY(-20deg)_rotateZ(2deg)_skewX(-5deg)] group-hover:[transform:rotateX(0deg)_rotateY(0deg)_rotateZ(0deg)_skewX(0deg)] transition-all duration-1000 ease-out">
            <div className="aspect-[16/10] w-full rounded-lg bg-background/60 p-5 border border-white/5 relative overflow-hidden [transform-style:preserve-3d]">
                {/* Internal Decorative Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-primary/10 to-transparent blur-3xl pointer-events-none"></div>
                
                <div className="flex h-full w-full gap-6 relative z-10 [transform:translateZ(20px)]">
                    {/* Sidebar Wireframe */}
                    <div className="w-[22%] rounded-xl bg-white/5 border border-white/10 p-4 space-y-6">
                        <div className="h-2.5 w-12 bg-primary/50 rounded-full"></div>
                        <div className="space-y-3">
                            <div className="h-2 w-full bg-white/10 rounded-full"></div>
                            <div className="h-2 w-full bg-white/10 rounded-full"></div>
                            <div className="h-2 w-4/5 bg-white/10 rounded-full"></div>
                        </div>
                        <div className="pt-10 space-y-3">
                            <div className="h-2 w-full bg-white/10 rounded-full"></div>
                            <div className="h-2 w-full bg-white/10 rounded-full"></div>
                        </div>
                    </div>
                    
                    {/* Main Area Wireframe */}
                    <div className="flex-1 rounded-xl bg-white/5 border border-white/10 p-5">
                        <div className="flex justify-between items-center mb-8">
                            <div className="space-y-2">
                                <div className="h-4 w-40 bg-white/20 rounded-full"></div>
                                <div className="h-2 w-24 bg-white/10 rounded-full"></div>
                            </div>
                            <div className="h-10 w-10 bg-primary/20 rounded-xl border border-primary/20 flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 h-40 rounded-2xl bg-gradient-to-br from-primary/15 to-transparent border border-white/5 p-4">
                                <div className="h-full w-full rounded-lg bg-black/20 animate-pulse"></div>
                            </div>
                            <div className="h-40 rounded-2xl bg-white/5 border border-white/5 p-4">
                                <div className="space-y-3">
                                    <div className="h-2 w-full bg-white/10 rounded-full"></div>
                                    <div className="h-2 w-full bg-white/10 rounded-full"></div>
                                    <div className="h-2 w-full bg-white/10 rounded-full"></div>
                                </div>
                            </div>
                            <div className="h-24 rounded-2xl bg-white/5 border border-white/5"></div>
                            <div className="h-24 rounded-2xl bg-white/5 border border-white/5"></div>
                            <div className="h-24 rounded-2xl bg-white/5 border border-white/5"></div>
                        </div>
                    </div>
                </div>
                
                {/* Floating Card Element (Extra Layer) */}
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-40 h-52 bg-card rounded-2xl border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 transform [transform:translateZ(60px)_rotateY(-10deg)] hidden lg:flex flex-col justify-between transition-transform duration-700 group-hover:scale-105">
                     <div className="space-y-3">
                        <div className="h-3 w-1/2 bg-primary/40 rounded-full"></div>
                        <div className="space-y-1.5">
                            <div className="h-1.5 w-full bg-muted rounded-full"></div>
                            <div className="h-1.5 w-full bg-muted rounded-full"></div>
                        </div>
                     </div>
                     <div className="h-20 rounded-lg bg-primary/5 border border-primary/10 mt-4"></div>
                     <div className="mt-4 flex -space-x-2">
                        <div className="h-6 w-6 rounded-full bg-primary/30 border border-white/10"></div>
                        <div className="h-6 w-6 rounded-full bg-blue-500/30 border border-white/10"></div>
                     </div>
                </div>
            </div>
        </div>
    </div>
);

const features = [
  {
    icon: <DraftingCompass className="h-8 w-8" />,
    title: "AI Lesson Planner",
    description: "Automate lesson plan creation in minutes, aligned with your curriculum and objectives.",
  },
  {
    icon: <Layers className="h-8 w-8" />,
    title: "Visual Aids Generator",
    description: "Instantly create simple drawings and charts to explain complex topics clearly.",
  },
  {
    icon: <Map className="h-8 w-8" />,
    title: "Hyper-Local Content",
    description: "Generate stories and examples tailored to your students' local language and cultural context.",
  },
  {
    icon: <HelpCircle className="h-8 w-8" />,
    title: "Quiz & Rubric Generation",
    description: "Build assessments and detailed grading rubrics from any source text or topic instantly.",
  },
  {
    icon: <MailIcon className="h-8 w-8" />,
    title: "Parent Communication",
    description: "Draft professional and empathetic emails to parents in seconds, in any local language.",
  },
  {
    icon: <ScanLine className="h-8 w-8" />,
    title: "Paper Digitizer",
    description: "Convert physical, handwritten question papers into editable digital documents with AI.",
  },
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
  
  const AuthButtons = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      );
    }
    
    if (user) {
      return (
        <>
          <Button variant="ghost" asChild>
            <Link href={profile?.role === 'Student' ? "/student/dashboard" : "/dashboard"}>Dashboard</Link>
          </Button>
          <UserNav hideDetails />
        </>
      );
    }

    return (
      <>
        <Button variant="ghost" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg shadow-primary/30">Get Started</Button>
        </DialogTrigger>
      </>
    );
  }


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="flex min-h-screen w-full flex-col bg-background text-foreground relative pt-0">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

        <header className="sticky top-0 z-[999] w-full border-b border-white/10 bg-background/90 backdrop-blur-xl transition-all duration-300">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-all duration-300">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <span className="font-headline text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Learnivo AI
              </span>
            </Link>
            
            <div className="flex flex-1 justify-center">
              <nav className="hidden items-center gap-1 md:flex px-2 py-1.5 rounded-full bg-white/90 dark:bg-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-md border border-white/20 dark:border-white/10">
                  <Link
                    href="#features"
                    className="px-5 py-2 text-[13px] font-semibold text-slate-900 dark:text-slate-200 transition-all hover:text-primary rounded-full hover:bg-slate-50 dark:hover:bg-white/10"
                  >
                    Features
                  </Link>
                  <Link
                    href="#pricing"
                    className="px-5 py-2 text-[13px] font-semibold text-slate-900 dark:text-slate-200 transition-all hover:text-primary rounded-full hover:bg-slate-50 dark:hover:bg-white/10"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="#about"
                    className="px-5 py-2 text-[13px] font-semibold text-slate-900 dark:text-slate-200 transition-all hover:text-primary rounded-full hover:bg-slate-50 dark:hover:bg-white/10"
                  >
                    About Us
                  </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4">
                <AuthButtons />
              </div>
              
              {/* Mobile Nav Toggle */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="text-left flex items-center gap-2">
                       <BookOpen className="h-6 w-6 text-primary" />
                       Learnivo AI
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link href="#features" className="text-lg font-medium">Features</Link>
                    <Link href="#pricing" className="text-lg font-medium">Pricing</Link>
                    <Link href="#about" className="text-lg font-medium">About Us</Link>
                    <div className="flex flex-col gap-4 pt-4 border-t">
                       <AuthButtons />
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="bg-dot-pattern">
            <section className="container mx-auto px-4 xs:px-6 grid lg:grid-cols-2 gap-12 items-center pt-10 md:pt-16 lg:pt-20 relative z-10 overflow-hidden">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                  AI for Indian Education
                </div>
                <h1 className="font-headline text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                  Unlock Your Potential.
                  <span className="block text-primary drop-shadow-sm">Transform Education.</span>
                </h1>
                <p className="mt-6 max-w-[600px] text-base md:text-lg text-muted-foreground leading-relaxed">
                  A powerful AI-driven platform for Indian educators and students. Automate lesson planning, master complex topics, and manage learning tasks securely and efficiently.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  {user ? (
                    <Button size="lg" className="rounded-full h-12 px-8 shadow-lg shadow-primary/40 w-full sm:w-auto text-base" asChild>
                      <Link href={profile?.role === 'Student' ? "/student/dashboard" : "/dashboard"}>
                        Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <DialogTrigger asChild>
                      <Button size="lg" className="rounded-full h-12 px-8 shadow-lg shadow-primary/40 w-full sm:w-auto text-base">
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                  )}
                  <Button size="lg" variant="outline" className="rounded-full h-12 px-8 w-full sm:w-auto text-base">
                    Learn More
                  </Button>
                </div>
                
                <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex -space-x-3">
                    <Avatar className="border-2 border-background h-10 w-10 sm:h-12 sm:w-12 transition-transform hover:scale-110">
                      <AvatarImage src="https://picsum.photos/seed/teacher1/40/40" />
                      <AvatarFallback>T1</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background h-10 w-10 sm:h-12 sm:w-12 transition-transform hover:scale-110">
                      <AvatarImage src="https://picsum.photos/seed/teacher2/40/40" />
                      <AvatarFallback>T2</AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background h-10 w-10 sm:h-12 sm:w-12 transition-transform hover:scale-110">
                      <AvatarImage src="https://picsum.photos/seed/teacher3/40/40" />
                      <AvatarFallback>T3</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-semibold text-sm md:text-base">Trusted by over 5,000 educators</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Saving an average of 10+ hours per week.</p>
                  </div>
                </div>
              </div>
              <div className="relative flex justify-center lg:justify-end scale-100 sm:scale-100 lg:scale-100 overflow-visible mt-12 lg:mt-0">
                <DashboardWireframe />
              </div>
            </section>
          </div>

          <section id="features" className="container py-16 md:py-24 lg:py-28 relative z-10">
              <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
                  <h2 className="font-headline text-4xl font-bold md:text-5xl">
                      Empowering Education, One Tool at a Time
                  </h2>
                  <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                      Learnivo AI provides a suite of intelligent tools designed to tackle daily challenges, freeing up teachers to teach and students to learn.
                  </p>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
                  <SpotlightCard className="lg:col-span-2 lg:row-span-1 border bg-card/40 p-8 text-left transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 flex flex-col md:flex-row gap-6 items-center">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          {features[0].icon}
                      </div>
                      <div>
                        <h3 className="font-headline text-2xl font-bold">{features[0].title}</h3>
                        <p className="mt-2 text-muted-foreground text-lg leading-relaxed">{features[0].description}</p>
                      </div>
                  </SpotlightCard>
                  <SpotlightCard className="border bg-card/40 p-6 text-left transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {features[1].icon}
                      </div>
                      <h3 className="font-headline text-xl font-bold">{features[1].title}</h3>
                      <p className="mt-2 text-muted-foreground">{features[1].description}</p>
                  </SpotlightCard>
                  <SpotlightCard className="border bg-card/40 p-6 text-left transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {features[2].icon}
                      </div>
                      <h3 className="font-headline text-xl font-bold">{features[2].title}</h3>
                      <p className="mt-2 text-muted-foreground">{features[2].description}</p>
                  </SpotlightCard>
                  <SpotlightCard className="lg:col-span-2 lg:row-span-1 border bg-card/40 p-8 text-left transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 flex flex-col md:flex-row-reverse gap-6 items-center">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          {features[3].icon}
                      </div>
                      <div className="md:text-right">
                        <h3 className="font-headline text-2xl font-bold">{features[3].title}</h3>
                        <p className="mt-2 text-muted-foreground text-lg leading-relaxed">{features[3].description}</p>
                      </div>
                  </SpotlightCard>
                  <SpotlightCard className="lg:col-span-1 border bg-card/40 p-6 text-left transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {features[4].icon}
                      </div>
                      <h3 className="font-headline text-xl font-bold">{features[4].title}</h3>
                      <p className="mt-2 text-muted-foreground">{features[4].description}</p>
                  </SpotlightCard>
                  <SpotlightCard className="lg:col-span-1 lg:hidden border bg-card/40 p-6 text-left transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {features[5].icon}
                      </div>
                      <h3 className="font-headline text-xl font-bold">{features[5].title}</h3>
                      <p className="mt-2 text-muted-foreground">{features[5].description}</p>
                  </SpotlightCard>
                  <SpotlightCard className="hidden lg:flex sm:col-span-2 lg:col-span-1 border bg-card/40 p-6 text-left transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 flex-col">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {features[5].icon}
                      </div>
                      <h3 className="font-headline text-xl font-bold">{features[5].title}</h3>
                      <p className="mt-2 text-muted-foreground">{features[5].description}</p>
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
                  <SpotlightCard className="h-full flex flex-col border bg-card/40 p-6 sm:p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
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
                  <SpotlightCard className="h-full flex flex-col border bg-card/40 p-6 sm:p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
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
              <SpotlightCard className="flex flex-col justify-between border bg-card/40 p-6">
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
              <SpotlightCard className="flex flex-col justify-between border bg-card/40 p-6">
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
              <SpotlightCard className="flex flex-col justify-between border bg-card/40 p-6">
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

        <footer className="w-full border-t overflow-hidden">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 px-4 sm:px-6 py-12 md:py-20">
            <div className="col-span-12 md:col-span-3">
              <Link href="/" className="flex items-center gap-2">
                <BookOpen className="h-7 w-7 text-primary" />
                <span className="font-headline text-xl font-bold">Learnivo AI</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground max-w-xs">Empowering Indian educators with the power of AI to transform classrooms across the nation.</p>
              <div className="mt-6 flex space-x-5">
                  <Link href="#" className="hover:scale-110 transition-transform"><MessageCircle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" /></Link>
                  <Link href="#" className="hover:scale-110 transition-transform"><GitBranch className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" /></Link>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-9 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
              <div>
                <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">Support</h4>
                <ul className="space-y-4 text-muted-foreground text-sm">
                  <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">Policy</h4>
                <ul className="space-y-4 text-muted-foreground text-sm">
                  <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">Discover</h4>
                <ul className="space-y-4 text-muted-foreground text-sm">
                  <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                  <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                </ul>
              </div>
              <div className="col-span-1 xs:col-span-1">
                <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">Contact</h4>
                <ul className="space-y-4 text-muted-foreground text-sm">
                  <li className="flex items-start gap-3 group">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <span className="break-words pt-1.5 flex-1 min-w-0">+91 9719205268</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <span className="pt-1.5 flex-1 min-w-0">Uttar Pradesh, India</span>
                  </li>
                  <li className="flex items-start gap-3 group">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <MailIcon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="break-all pt-1.5 flex-1 min-w-0">info@learnivo.app</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t py-12 text-center overflow-hidden">
            <div className="font-headline text-5xl sm:text-8xl md:text-9xl font-black tracking-[0.2em] uppercase text-foreground/[0.03] select-none whitespace-nowrap">
                Learnivo AI
            </div>
          </div>
          <div className="border-t">
            <div className="container mx-auto py-6 px-6 text-center text-muted-foreground text-sm">
              © {new Date().getFullYear()} Learnivo AI. All rights reserved.
            </div>
          </div>
        </footer>
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
                            "border-2 border-transparent p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 h-full bg-card",
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
