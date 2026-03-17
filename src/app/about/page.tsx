"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  Globe, 
  Heart, 
  Target, 
  Cpu, 
  History, 
  Lightbulb, 
  Users,
  Zap,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/layout/landing-header";
import { LandingFooter } from "@/components/layout/landing-footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

export default function AboutPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"teacher" | "student" | null>(null);

  const handleRoleSelect = (role: "teacher" | "student") => {
    setSelectedRole(role);
    if (role === 'teacher') {
      router.push('/signup/teacher');
    } else {
      router.push('/signup/student');
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="flex min-h-screen w-full flex-col bg-background text-foreground relative">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
        
        <LandingHeader />

        <main className="flex-1">
          {/* Header Hero Section */}
          <section className="py-24 px-6 sm:px-12 lg:px-24 border-b border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
            <div className="max-w-6xl mx-auto space-y-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-2">
                <Sparkles className="h-4 w-4" />
                <span>Revolutionizing Global Education</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-headline font-bold tracking-tight leading-[1.05]">
                Learnivo AI: The <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">Intelligence</span> Behind Modern Schools.
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl">
                We are building the world's most advanced AI operating system for educators. A product engineered by <span className="text-foreground font-bold underline decoration-primary/30">Vasudev AI</span> to bridge the gap between human potential and technological brilliance.
              </p>
            </div>
          </section>

          {/* Our Story / Genesis Section */}
          <section className="py-24 px-6 sm:px-12 lg:px-24 bg-card/10">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <History className="h-8 w-8" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold font-headline">The Genesis of Learnivo</h2>
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Learnivo AI didn't start in a boardroom; it started in a classroom. We witnessed teachers spending 70% of their time on administrative tasks—planning, grading, and reporting—leaving only 30% for actual teaching.
                  </p>
                  <p>
                    We realized that for education to evolve, the tools must first empower the primary catalyst of learning: <span className="text-foreground font-semibold">The Teacher</span>. Learnivo AI was born as a flagship product of <span className="text-foreground font-bold">Vasudev AI Research Lab</span> to eliminate the cognitive load of teaching, allowing educators to focus on what they do best: inspiring the next generation.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                   <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-primary/20 to-transparent border border-white/10 flex flex-col items-center justify-center p-8 text-center group hover:scale-105 transition-transform duration-500">
                      <Zap className="h-10 w-10 text-primary mb-4" />
                      <h4 className="font-bold text-xl">10x Speed</h4>
                      <p className="text-xs text-muted-foreground mt-2">In Lesson Planning</p>
                   </div>
                   <div className="aspect-square rounded-[2rem] bg-card border border-white/5 flex flex-col items-center justify-center p-8 text-center group hover:scale-105 transition-transform duration-500">
                      <Users className="h-10 w-10 text-primary mb-4" />
                      <h4 className="font-bold text-xl">5k+ Users</h4>
                      <p className="text-xs text-muted-foreground mt-2">Across India</p>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="aspect-square rounded-[2rem] bg-card border border-white/5 flex flex-col items-center justify-center p-8 text-center group hover:scale-105 transition-transform duration-500">
                      <Globe className="h-10 w-10 text-primary mb-4" />
                      <h4 className="font-bold text-xl">Vernacular</h4>
                      <p className="text-xs text-muted-foreground mt-2">12+ Languages</p>
                   </div>
                   <div className="aspect-[3/4] rounded-[2rem] bg-gradient-to-tr from-primary/10 via-card to-transparent border border-white/10 flex flex-col items-center justify-center p-8 text-center group hover:rotate-2 transition-all duration-500">
                      <BarChart3 className="h-10 w-10 text-primary mb-4" />
                      <h4 className="font-bold text-xl">Premium Analytics</h4>
                      <p className="text-xs text-muted-foreground mt-2">For Institutions</p>
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* The Power of Vasudev AI */}
          <section className="py-24 px-6 sm:px-12 lg:px-24 overflow-hidden relative">
            <div className="absolute left-0 bottom-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -ml-96 -mb-96"></div>
            <div className="max-w-6xl mx-auto space-y-16 relative z-10">
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-bold font-headline">A Product of <span className="text-primary italic">Vasudev AI</span></h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  As the flagship education product of Vasudev AI, Learnivo inherits a legacy of high-performance engineering and ethical AI development.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-10 rounded-3xl bg-card border border-white/5 hover:border-primary/30 transition-all duration-500 space-y-6 shadow-2xl shadow-black/20">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Cpu className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold">State-of-the-Art Core</h3>
                    <p className="text-muted-foreground">Powered by proprietary LLM orchestration that ensures accuracy, speed, and safety for educational contexts.</p>
                </div>
                <div className="p-10 rounded-3xl bg-card border border-white/5 hover:border-primary/30 transition-all duration-500 space-y-6 shadow-2xl shadow-black/20">
                    <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <ShieldCheck className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold">Privacy First</h3>
                    <p className="text-muted-foreground">We deploy zero-retention policies. Your data, your students' data, and your intellectual property remain yours.</p>
                </div>
                <div className="p-10 rounded-3xl bg-card border border-white/5 hover:border-primary/30 transition-all duration-500 space-y-6 shadow-2xl shadow-black/20">
                    <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Lightbulb className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold">Adaptive Logic</h3>
                    <p className="text-muted-foreground">Our AI understands cultural nuances, regional curricula (CBSE, ICSE, State), and local languages perfectly.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Mission & Vision Section */}
          <section className="py-24 px-6 sm:px-12 lg:px-24 bg-primary text-primary-foreground rounded-[2rem] mx-6 mb-24 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full -mr-96 -mt-96 blur-3xl"></div>
             <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-10">
                <div className="space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-6xl font-bold font-headline leading-tight">Our Vision for <br />the Year 2030</h2>
                        <p className="text-xl opacity-80 leading-relaxed font-medium">
                          We believe that by 2030, AI will be the fundamental backbone of every successful school. Not as a replacement for teachers, but as their greatest superpower.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-2 pb-6 border-b border-white/20">
                            <h4 className="text-2xl font-bold">Accessibility</h4>
                            <p className="opacity-70 text-sm">Empowering low-resource schools with global-standard AI tools.</p>
                        </div>
                        <div className="space-y-2 pb-6 border-b border-white/20">
                            <h4 className="text-2xl font-bold">Excellence</h4>
                            <p className="opacity-70 text-sm">Raising the quality of content and assessments across all boards.</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center space-y-12">
                   <div className="space-y-6 p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                        <Target className="h-10 w-10 mb-4" />
                        <h3 className="text-3xl font-bold">The Mission</h3>
                        <p className="text-lg opacity-90 leading-relaxed">
                          To serve 1 Million teachers by the end of 2026, saving them over 20 Million hours of work, and directly impacting the education of over 50 Million students globally.
                        </p>
                   </div>
                   <div className="flex items-center gap-8">
                       <Button size="lg" variant="secondary" className="rounded-full px-8 h-14 text-lg font-bold shadow-2xl shadow-black/20" asChild>
                          <Link href="https://vasudev.online" target="_blank">Partner with Us</Link>
                       </Button>
                       <div className="flex -space-x-4">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="h-12 w-12 rounded-full border-2 border-primary bg-slate-200 overflow-hidden shadow-xl">
                                    <img src={`https://picsum.photos/seed/face${i}/48/48`} alt="user" />
                                </div>
                            ))}
                            <div className="h-12 w-12 rounded-full border-2 border-primary bg-white/20 backdrop-blur-md flex items-center justify-center text-xs font-bold">+10k</div>
                       </div>
                   </div>
                </div>
             </div>
          </section>

          {/* CTA / Final Word */}
          <section className="py-24 px-6 text-center max-w-4xl mx-auto space-y-10">
             <Heart className="h-12 w-12 mx-auto text-primary animate-pulse" />
             <h2 className="text-4xl md:text-5xl font-bold font-headline">Join a Brand that Cares.</h2>
             <p className="text-xl text-muted-foreground leading-relaxed">
               Learnivo AI is not just a software; it's a commitment from <span className="text-foreground font-bold">Vasudev AI</span> to every educator who dreams of doing more. Be part of the most significant shift in EdTech history.
             </p>
             <div className="flex flex-col sm:flex-row justify-center gap-6">
                 <Button size="lg" className="rounded-full h-14 px-10 text-lg font-bold shadow-2xl shadow-primary/30" asChild>
                    <Link href="/">Try Learnivo AI Now</Link>
                 </Button>
                 <Button size="lg" variant="outline" className="rounded-full h-14 px-10 text-base" asChild>
                    <Link href="/contact">Speak to our Team</Link>
                 </Button>
             </div>
          </section>
        </main>

        <LandingFooter />

        <DialogContent className="p-0 border-none sm:max-w-2xl bg-transparent">
          <div className="animated-border rounded-lg">
            <div className="bg-background rounded-lg">
                <DialogHeader className="items-center text-center p-6 pb-0">
                  <p className="text-primary font-semibold">Onboarding</p>
                  <DialogTitle className="font-headline text-3xl font-bold">Choose Your Role</DialogTitle>
                  <DialogDescription className="max-w-md">
                      Select your role to personalize your experience.
                  </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 p-6">
                   <div className="animated-border rounded-xl">
                      <div
                          className={cn(
                              "border-2 border-transparent p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 h-full bg-card rounded-xl",
                              selectedRole === 'teacher' ? 'border-primary bg-primary/10 shadow-lg' : ''
                          )}
                          onClick={() => handleRoleSelect('teacher')}
                      >
                          <div className="flex items-center justify-center h-32 w-32 rounded-lg bg-muted/70 mb-4">
                          <User className="h-16 w-16 text-muted-foreground" />
                          </div>
                          <h3 className="font-bold text-lg">Teacher</h3>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
