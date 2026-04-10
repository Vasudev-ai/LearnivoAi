
"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight, CheckCircle, Sparkles, Star, Building, User, GraduationCap, Grid3x3, Building2, Layers, Map, HelpCircle, ScanLine, Phone, MapPin, Mail as MailIcon, DraftingCompass, MessageCircle, GitBranch, Menu, Calculator, Brain, PenTool, ClipboardCheck, Book, Gavel, FileText, Library, Layout, MessageSquare, Scale, Github, Heart, Clock, Check } from "lucide-react";
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
            <div suppressHydrationWarning className="w-full h-full rounded-t-xl md:rounded-t-[1.5rem] rounded-b-none overflow-hidden border-t border-x border-black/5 dark:border-white/10 bg-slate-100 dark:bg-zinc-950/50 flex border-b-0 relative transition-colors duration-700">
                <div role="presentation" className="absolute inset-0 bg-slate-100 dark:bg-zinc-900 aspect-video w-full h-[600px] -z-10 animate-pulse hidden" />
                <img 
                   src="/landing.png" 
                   alt="Learnivo Dashboard Interface Light" 
                   className="w-full h-full object-cover object-top block dark:hidden text-transparent bg-slate-100 rounded-b-none"
                   loading="lazy"
                   onError={(e) => {
                     e.currentTarget.style.background = 'linear-gradient(135deg, #f1f5f9, #e2e8f0)';
                   }}
                />
                <img 
                   src="/image.png" 
                   alt="Learnivo Dashboard Interface Dark" 
                   className="w-full h-full object-cover object-top hidden dark:block text-transparent bg-zinc-900 rounded-b-none"
                   loading="lazy"
                   onError={(e) => {
                     e.currentTarget.style.background = 'linear-gradient(135deg, #18181b, #27272a)';
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
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);
  const [isAnnual, setIsAnnual] = useState(true);
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

        <main className="flex-1 w-full px-3 sm:px-4 pt-2 md:pt-4 mb-12">
          <div 
             ref={heroRef}
             onMouseMove={handleHeroMouseMove}
             className="relative overflow-hidden bg-[#f1f5f9] dark:bg-zinc-900/40 rounded-[2rem] w-full mx-auto border border-black/5 dark:border-white/5 group/hero min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-7rem)] flex flex-col"
          >
            {/* Interactive Spotlight Glow */}
            <div 
              className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-500 blur-[80px]"
              style={{
                background: `radial-gradient(500px circle at var(--hero-mouse-x, 50%) var(--hero-mouse-y, 50%), hsl(var(--primary) / 0.15), transparent 40%)`
              }}
            />
            {/* massive gradient background mimicking the screenshot but using lime green */}
            <div className="absolute inset-x-0 bottom-0 top-[30%] bg-[radial-gradient(ellipse_120%_100%_at_50%_100%,rgba(74,222,128,0.15),transparent_70%)] dark:bg-[radial-gradient(ellipse_120%_100%_at_50%_100%,rgba(74,222,128,0.25),transparent_70%)] z-0 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 top-[50%] bg-[radial-gradient(ellipse_80%_80%_at_50%_100%,rgba(74,222,128,0.2),transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_100%,rgba(74,222,128,0.3),transparent_70%)] z-0 pointer-events-none" />
            
            {/* Grid Pattern overlaid (Pure CSS) */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-50 dark:opacity-30" style={{ backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'linear-gradient(to bottom, transparent, black 80%, black)' }} />
            <div className="hidden dark:block absolute inset-0 z-0 pointer-events-none opacity-50" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'linear-gradient(to bottom, transparent, black 80%, black)' }} />

            <section className="container mx-auto px-4 xs:px-6 flex flex-1 flex-col items-center text-center pt-36 md:pt-[18vh] relative z-10 pb-0 justify-between">
                <div>
                  <div className="inline-flex items-center rounded-full bg-slate-100 dark:bg-[#052e16] border border-slate-200 dark:border-[#166534]/50 px-5 py-1.5 text-xs font-bold tracking-widest text-slate-700 dark:text-[#4ade80] uppercase mb-8 shadow-sm transition-colors">
                  AI for Indian Education
                </div>
                
                <h1 className="font-headline text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[4.5rem] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05] max-w-[900px] mx-auto">
                  The Ultimate <span className="text-[#4ade80] drop-shadow-sm">EdTech AI</span> for Modern Schools.
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
                </div>
                
                <div className="w-full flex justify-center mt-auto pt-8 md:pt-12 pb-0 relative">
                   <div className="relative w-full max-w-5xl mx-auto px-4 md:px-0">
                      {/* Using the dashboard Wireframe inside */}
                      <DashboardWireframe />
                   </div>
                </div>
            </section>
          </div>

          {/* Trusted Brand Logos Bar (Outside Hero) */}
          <section className="w-full py-6 md:py-8 border-b border-black/5 dark:border-white/5 bg-background overflow-hidden relative">
              <div className="absolute left-0 inset-y-0 w-8 md:w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 inset-y-0 w-8 md:w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
              
              <div className="flex whitespace-nowrap animate-marquee-horizontal hover:paused opacity-70 dark:opacity-50 grayscale filter transition-all duration-300 hover:grayscale-0 w-max">
                  {/* First Set */}
                  <div className="flex items-center gap-12 md:gap-20 px-6 md:px-10">
                      <div className="font-serif font-bold text-xl md:text-2xl tracking-tight text-slate-800 dark:text-slate-200">The Doon School</div>
                      <div className="font-sans font-bold text-lg md:text-xl tracking-tight flex items-center gap-2"><BookOpen className="w-6 h-6 text-primary" /> St. Xavier's</div>
                      <div className="font-serif italic font-bold text-xl md:text-2xl text-slate-800 dark:text-slate-200">Delhi Public School</div>
                      <div className="font-semibold text-lg md:text-xl tracking-tight uppercase flex items-center gap-2 text-slate-800 dark:text-slate-200">Kendriya Vidyalaya</div>
                      <div className="font-bold text-xl md:text-2xl tracking-tighter text-slate-800 dark:text-slate-200">DAV Public</div>
                  </div>
                  {/* Second Set (Duplicate for seamless loop) */}
                  <div className="flex items-center gap-12 md:gap-20 px-6 md:px-10">
                      <div className="font-serif font-bold text-xl md:text-2xl tracking-tight text-slate-800 dark:text-slate-200">The Doon School</div>
                      <div className="font-sans font-bold text-lg md:text-xl tracking-tight flex items-center gap-2"><BookOpen className="w-6 h-6 text-primary" /> St. Xavier's</div>
                      <div className="font-serif italic font-bold text-xl md:text-2xl text-slate-800 dark:text-slate-200">Delhi Public School</div>
                      <div className="font-semibold text-lg md:text-xl tracking-tight uppercase flex items-center gap-2 text-slate-800 dark:text-slate-200">Kendriya Vidyalaya</div>
                      <div className="font-bold text-xl md:text-2xl tracking-tighter text-slate-800 dark:text-slate-200">DAV Public</div>
                  </div>
              </div>
          </section>

          <section id="features" className="w-full bg-[#f1f5f9] dark:bg-background py-24 lg:py-32 relative z-10 overflow-hidden transition-colors duration-300">
              <div className="container mx-auto px-4 md:px-6">
                 {/* Header */}
                 <div className="mx-auto flex flex-col items-center text-center">
                    <div className="inline-flex items-center rounded-full bg-primary/10 dark:bg-[#052e16] px-4 py-1.5 text-[10px] sm:text-xs font-bold tracking-widest text-primary dark:text-[#4ade80] uppercase mb-8 shadow-sm border border-primary/20 dark:border-[#166534]/50 transition-colors">
                      <Sparkles className="w-3.5 h-3.5 mr-2" />
                      Powering 10,000+ Educators
                    </div>
                    <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-16 lg:mb-24 leading-tight transition-colors">
                        Everything you need to <br className="hidden sm:block" />
                        <span className="text-primary dark:text-[#4ade80]">Transform your Classroom.</span>
                    </h2>
                 </div>

                 {/* Interactive Layout */}
                 <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-[1400px] mx-auto items-stretch">
                    
                    {/* Left Tabs List */}
                    <div className="w-full lg:w-[35%] flex flex-col gap-3">
                      {features.slice(0, 6).map((feature, idx) => {
                        const isActive = activeFeatureTab === idx;
                        return (
                          <button 
                            key={idx}
                            onClick={() => setActiveFeatureTab(idx)}
                            className={`group flex items-center justify-between p-4 sm:p-5 rounded-xl border transition-all duration-300 text-left align-middle
                              ${isActive 
                                ? "bg-white dark:bg-[#0A1A10] border-primary/30 dark:border-[#4ade80]/40 shadow-lg shadow-primary/5 dark:shadow-[#4ade80]/10" 
                                : "bg-transparent border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                              }`}
                          >
                            <div className="flex items-center gap-4 sm:gap-5">
                               <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg transition-colors
                                 ${isActive ? "bg-primary dark:bg-[#4ade80] text-primary-foreground dark:text-black" : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-[#94a3b8] group-hover:text-slate-700 dark:group-hover:text-white group-hover:bg-slate-200 dark:group-hover:bg-white/10"}`}>
                                  <div className={`[&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6 transition-transform ${isActive ? "scale-110" : ""}`}>
                                     {feature.icon}
                                  </div>
                               </div>
                               <span className={`font-headline font-bold text-[17px] sm:text-xl tracking-wide transition-colors
                                 ${isActive ? "text-slate-900 dark:text-[#4ade80]" : "text-slate-600 dark:text-[#94a3b8] group-hover:text-slate-900 dark:group-hover:text-white"}`}>
                                 {feature.title}
                               </span>
                            </div>
                            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300
                              ${isActive ? "bg-primary dark:bg-[#4ade80] shadow-[0_0_8px_rgba(22,163,74,0.5)] dark:shadow-[0_0_12px_rgba(74,222,128,0.8)] scale-100" : "bg-transparent scale-0"}`}>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Content Spotlight Card */}
                    <div className="w-full lg:w-[65%] min-h-[500px] lg:min-h-0 flex-1 rounded-3xl bg-white dark:bg-[#0C1217] border border-slate-200 dark:border-white/10 relative overflow-hidden ring-1 ring-black/5 dark:ring-[#4ade80]/10 shadow-2xl dark:shadow-[0_0_50px_rgba(74,222,128,0.05)] shadow-slate-200/50 dark:shadow-[#4ade80]/5 p-8 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-center transition-all duration-500 ease-out">
                        
                        {/* Soft Top Glow Gradient */}
                        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/50 dark:via-[#4ade80]/50 to-transparent opacity-80"></div>
                        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/5 dark:from-[#4ade80]/10 to-transparent md:opacity-50"></div>
                        
                        <div className="flex flex-col xl:flex-row gap-12 lg:gap-16 items-center w-full h-full relative z-10">
                           {/* Text Content Block */}
                           <div className="w-full xl:w-1/2 flex flex-col items-start pt-4 lg:pt-0">
                               <div className="inline-flex items-center rounded-sm bg-primary/10 dark:bg-[#052e16] border border-primary/20 dark:border-[#166534]/50 px-3 py-1 font-bold text-[10px] sm:text-xs tracking-[0.15em] text-primary dark:text-[#4ade80] uppercase mb-6 sm:mb-8 shadow-sm">
                                 <BookOpen className="w-3.5 h-3.5 mr-2" />
                                 {features[activeFeatureTab].title === "Lesson Planner" ? "PLANNING"
                                  : features[activeFeatureTab].title === "Visual Aids" ? "CREATION"
                                  : features[activeFeatureTab].title === "Math Helper" ? "PROBLEM SOLVING"
                                  : features[activeFeatureTab].title === "Hyper-Local Content" ? "CONTEXTUALIZATION"
                                  : features[activeFeatureTab].title === "Story Generator" ? "IMAGINATION"
                                  : "INTELLIGENCE"}
                               </div>
                               <h3 className="font-headline text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-6 sm:mb-8 tracking-tight transition-colors">
                                  {features[activeFeatureTab].title === "Lesson Planner" ? "Architect Lessons in Seconds." : 
                                   features[activeFeatureTab].title === "Visual Aids" ? "Illustrate Complex Concepts." :
                                   features[activeFeatureTab].title === "Math Helper" ? "Solve Problems Instantly." :
                                   features[activeFeatureTab].title === "Hyper-Local Content" ? "Relatable Local Context." :
                                   features[activeFeatureTab].title === "Story Generator" ? "Spark Student Creativity." :
                                   "Knowledge at your base."}
                               </h3>
                               <p className="text-slate-600 dark:text-[#94a3b8] text-base sm:text-lg mb-10 sm:mb-12 leading-relaxed max-w-md font-medium transition-colors">
                                 {features[activeFeatureTab].description}
                               </p>
                               
                               <Button className="bg-primary dark:bg-[#4ade80] hover:bg-primary/90 dark:hover:bg-[#22c55e] text-primary-foreground dark:text-[#022c22] font-black rounded-full px-8 py-7 text-[15px] tracking-wide shadow-[0_0_20px_rgba(22,163,74,0.3)] transition-all hover:scale-105 active:scale-95 group">
                                 GET STARTED <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                               </Button>
                           </div>
                           
                           {/* Minimal UI Wireframe Right Side */}
                           <div className="w-full xl:w-1/2 aspect-square max-h-[400px] xl:max-h-none rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/40 flex items-center justify-center relative overflow-hidden shadow-inner dark:shadow-2xl dark:backdrop-blur-md transition-colors">
                               {/* Dark Grid Background */}
                               <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-20" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                               
                               <div className="relative z-10 flex flex-col items-center justify-center animate-pulse duration-[3000ms]">
                                   <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white dark:bg-[#052e16] border border-slate-200 dark:border-[#166534] flex items-center justify-center mb-6 text-primary dark:text-[#4ade80] shadow-sm dark:shadow-[0_0_40px_rgba(74,222,128,0.15)] relative">
                                        <div className="absolute inset-0 rounded-xl border border-primary/20 dark:border-[#4ade80]/30 animate-ping opacity-30 dark:opacity-20 duration-1000 delay-500"></div>
                                        <div className="[&>svg]:w-10 [&>svg]:h-10 sm:[&>svg]:w-12 sm:[&>svg]:h-12">
                                           {features[activeFeatureTab].icon}
                                        </div>
                                   </div>
                                   <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-black text-slate-400 dark:text-[#52525B]">
                                      Processing Component
                                   </p>
                               </div>
                           </div>
                        </div>
                    </div>
                 </div>
              </div>
          </section>

          <section id="pricing" className="container py-16 md:py-24 lg:py-32 relative z-10 flex flex-col items-center">
            {/* Header */}
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-semibold text-primary text-xs tracking-widest uppercase mb-6 shadow-sm">
              Pricing
            </div>
            <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-extrabold text-center tracking-tight text-slate-900 dark:text-white mb-6">
              Choose the perfect plan for you <Sparkles className="inline w-8 h-8 md:w-10 md:h-10 text-yellow-400 -mt-2 ml-1" />
            </h2>
            <p className="max-w-2xl text-center text-lg text-slate-500 dark:text-slate-400 mb-12">
              Start for free and upgrade anytime to unlock powerful new AI capabilities for your classroom. Pay in various ways. Cancel anytime.
            </p>

            {/* Toggle Switch */}
            <div className="flex items-center gap-6 mb-16">
              <button 
                onClick={() => setIsAnnual(false)}
                className={cn(
                  "text-sm font-bold transition-colors",
                  !isAnnual ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"
                )}
              >
                Monthly
              </button>
              
              <div 
                onClick={() => setIsAnnual(!isAnnual)}
                className={cn(
                  "w-16 h-8 rounded-full p-1 cursor-pointer flex items-center transition-all duration-300 shadow-inner group",
                  isAnnual ? "bg-primary" : "bg-slate-200 dark:bg-zinc-800"
                )}
              >
                <div className={cn(
                  "w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 transform",
                  isAnnual ? "translate-x-8" : "translate-x-0"
                )}></div>
              </div>

              <button 
                onClick={() => setIsAnnual(true)}
                className={cn(
                  "text-sm font-bold flex items-center gap-2 transition-colors",
                  isAnnual ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"
                )}
              >
                Annually 
                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">20% off</span>
              </button>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full max-w-6xl px-4 md:px-0">
              
              {/* Card 1: Basic */}
              <div className="bg-white dark:bg-[#15181C] border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 lg:p-10 flex flex-col shadow-2xl dark:shadow-none hover:-translate-y-1 transition-transform duration-300">
                <h3 className="text-slate-900 dark:text-white text-2xl font-bold mb-2 tracking-tight">Basic</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 h-10 leading-relaxed">For individuals exploring the power of AI in education.</p>
                
                <div className="flex items-baseline gap-1 mb-2 text-slate-900 dark:text-white">
                  <span className="text-5xl md:text-6xl font-bold tracking-tighter">Free</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-8">forever</p>
                
                <hr className="border-slate-200 dark:border-white/10 border-dashed w-full mb-8 opacity-100 dark:opacity-50" />
                
                <Button className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-full h-14 mb-10 text-sm font-bold tracking-wide transition-colors">
                  Try it for free
                </Button>

                <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300 font-medium tracking-wide">
                  <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary shrink-0" /> <span>5 uses/month of basic AI tools</span></li>
                  <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary shrink-0" /> <span>Workspace & Library access</span></li>
                  <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary shrink-0" /> <span>Community Support</span></li>
                  <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary shrink-0" /> <span>Cancel anytime</span></li>
                </ul>
              </div>

              {/* Card 2: Pro (Highlighted) */}
              <div className="bg-primary/5 dark:bg-[#0A0D10] border border-primary/30 rounded-[2rem] p-8 lg:p-10 flex flex-col shadow-2xl shadow-primary/10 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden ring-1 ring-primary/20">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-100"></div>
                
                <h3 className="text-slate-900 dark:text-white text-2xl font-bold mb-2 tracking-tight">Pro</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 h-10 leading-relaxed">For individual teachers wanting to unlock the full potential of AI.</p>
                
                <div className="flex items-baseline gap-1 mb-2 text-slate-900 dark:text-white">
                  <span className="text-5xl md:text-6xl font-bold tracking-tighter">
                     {isAnnual ? "₹499" : "₹599"}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">/month</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mb-8">
                  {isAnnual ? "billed ₹5,988 annually (Save 20%)" : "billed monthly. best for flexibility."}
                </p>
                
                <hr className="border-primary/20 dark:border-white/10 border-dashed w-full mb-8 opacity-100 dark:opacity-50" />
                
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-14 mb-10 text-sm font-bold tracking-wide shadow-[0_0_20px_rgba(22,163,74,0.2)] transition-all">
                  Get Pro Membership
                </Button>

                <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300 font-medium tracking-wide">
                  <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary shrink-0" /> <span>Unlimited Lesson Plans & Quizzes</span></li>
                  <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary shrink-0" /> <span><strong>100 Credits/month</strong> for premium</span></li>
                  <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary shrink-0" /> <span>AI-powered evaluation tools</span></li>
                  <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary shrink-0" /> <span>Cancel anytime</span></li>
                </ul>
              </div>

              {/* Card 3: Institute */}
              <div className="bg-white dark:bg-[#15181C] border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 lg:p-10 flex flex-col shadow-2xl dark:shadow-none hover:-translate-y-1 transition-transform duration-300">
                <h3 className="text-slate-900 dark:text-white text-2xl font-bold mb-2 tracking-tight">Institute</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 h-10 leading-relaxed">For schools and educational institutions needing scale.</p>
                
                <div className="flex items-baseline gap-1 mb-2 text-slate-900 dark:text-white">
                  <span className="text-5xl md:text-6xl font-bold tracking-tighter">Custom</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mb-8">tailored to your organization</p>
                
                <hr className="border-slate-200 dark:border-white/10 border-dashed w-full mb-8 opacity-100 dark:opacity-50" />
                
                <Button className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-full h-14 mb-10 text-sm font-bold tracking-wide transition-colors">
                  Contact Sales
                </Button>

                <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300 font-medium tracking-wide">
                  <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary shrink-0" /> <span>All Pro features for every user</span></li>
                  <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary shrink-0" /> <span><strong>Unlimited credits</strong> globally</span></li>
                  <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary shrink-0" /> <span>Admin dashboard & analytics</span></li>
                  <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary shrink-0" /> <span>Cancel anytime</span></li>
                </ul>
              </div>

            </div>
          </section>

          <section id="testimonials" className="container py-16 md:py-24 lg:py-28 relative z-10 overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-start max-w-7xl mx-auto w-full">
              
              {/* Left side: Brand-aligned Heading & Stats */}
              <div className="w-full lg:w-5/12 flex flex-col pt-8 lg:pt-12 lg:sticky lg:top-32">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-semibold text-primary text-sm mb-6 w-fit shadow-sm">
                  <Heart className="mr-2 h-4 w-4" /> User Stories
                </div>
                <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
                  Real impact in real <span className="text-primary drop-shadow-sm">classrooms.</span>
                </h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-md">
                  See how Learnivo AI is helping teachers across India reclaim their weekends and spark joy in learning.
                </p>

                {/* Stat Box replacing the giant dark image wrapper */}
                <div className="bg-white dark:bg-zinc-900/50 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-white/10 relative overflow-hidden group shadow-xl shadow-slate-200/40 dark:shadow-none w-full max-w-sm">
                   <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
                     <Clock className="w-32 h-32" />
                   </div>
                   <div className="relative z-10 flex flex-col justify-between h-full">
                     <div className="h-14 w-14 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-6 border border-primary/20">
                       <Clock className="w-7 h-7 text-primary" />
                     </div>
                     <div>
                        <p className="text-4xl font-headline font-black text-slate-900 dark:text-white mb-1 tracking-tight">10,000+</p>
                        <p className="text-base font-semibold text-slate-500 dark:text-slate-400">Hours Saved Monthly</p>
                     </div>
                   </div>
                </div>
              </div>

              {/* Right side: Scrolling Glass Testimonials */}
              <div className="w-full lg:w-7/12 h-[600px] md:h-[700px] overflow-hidden relative mt-8 lg:mt-0" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}>
                <div className="flex flex-col gap-6 animate-marquee-vertical hover:[animation-play-state:paused] pt-10 px-2 lg:px-6">
                   {[
                      {
                        quote: "Learnivo has completely transformed my weekends. What used to take 4 hours of lesson planning now takes 20 minutes.",
                        name: "Priya Sharma",
                        role: "Science Teacher, Delhi Public School",
                        avatar: "https://picsum.photos/seed/priya/80/80"
                      },
                      {
                        quote: "The Math Helper tool generates incredible word problems that relate to Indian contexts. My students are far more engaged than ever before.",
                        name: "Rahul Verma",
                        role: "Math Teacher, St. Xavier's",
                        avatar: "https://picsum.photos/seed/rahul/80/80"
                      },
                      {
                        quote: "It evaluates open-ended answers with such precision. This is the first AI tool I've seen that actually understands the CBSE grading rubric.",
                        name: "Sunita Kulkarni",
                        role: "History Teacher, Kendriya Vidyalaya",
                        avatar: "https://picsum.photos/seed/sunita/80/80"
                      },
                      {
                        quote: "The ability to generate content in regional languages is what sets Learnivo AI apart. My students feel more connected to the material. It's a wonderful assistant for any Indian teacher.",
                        name: "Arjun Rao",
                        role: "English Teacher, DAV Public School",
                        avatar: "https://picsum.photos/seed/arjun/80/80"
                      }
                   ].map((t, i) => (
                      <div key={`dup1-${i}`} className="bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 flex flex-col gap-5 shrink-0 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 group">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                          ))}
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic relative z-10 text-lg">
                          "{t.quote}"
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                          <Avatar className="h-12 w-12 border-2 border-white dark:border-zinc-800 shadow-sm group-hover:border-primary/30 transition-colors">
                            <AvatarImage src={t.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">{t.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">{t.name}</p>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">{t.role}</p>
                          </div>
                        </div>
                      </div>
                   ))}
                   {/* Duplicate set for seamless infinite scrolling */}
                   {[
                      {
                        quote: "Learnivo has completely transformed my weekends. What used to take 4 hours of lesson planning now takes 20 minutes.",
                        name: "Priya Sharma",
                        role: "Science Teacher, Delhi Public School",
                        avatar: "https://picsum.photos/seed/priya/80/80"
                      },
                      {
                        quote: "The Math Helper tool generates incredible word problems that relate to Indian contexts. My students are far more engaged than ever before.",
                        name: "Rahul Verma",
                        role: "Math Teacher, St. Xavier's",
                        avatar: "https://picsum.photos/seed/rahul/80/80"
                      },
                      {
                        quote: "It evaluates open-ended answers with such precision. This is the first AI tool I've seen that actually understands the CBSE grading rubric.",
                        name: "Sunita Kulkarni",
                        role: "History Teacher, Kendriya Vidyalaya",
                        avatar: "https://picsum.photos/seed/sunita/80/80"
                      },
                      {
                        quote: "The ability to generate content in regional languages is what sets Learnivo AI apart. My students feel more connected to the material. It's a wonderful assistant for any Indian teacher.",
                        name: "Arjun Rao",
                        role: "English Teacher, DAV Public School",
                        avatar: "https://picsum.photos/seed/arjun/80/80"
                      }
                   ].map((t, i) => (
                      <div key={`dup2-${i}`} className="bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 flex flex-col gap-5 shrink-0 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 group">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                          ))}
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic relative z-10 text-lg">
                          "{t.quote}"
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                          <Avatar className="h-12 w-12 border-2 border-white dark:border-zinc-800 shadow-sm group-hover:border-primary/30 transition-colors">
                            <AvatarImage src={t.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">{t.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">{t.name}</p>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">{t.role}</p>
                          </div>
                        </div>
                      </div>
                   ))}
                </div>
              </div>
            </div>
          </section>

          <section className="py-24 bg-background">
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
