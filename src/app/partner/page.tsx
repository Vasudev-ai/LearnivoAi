"use client";

import { LandingHeader } from "@/components/layout/landing-header";
import { LandingFooter } from "@/components/layout/landing-footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { User, Handshake, Building2, Users2, MapPin, Send, Mail, Briefcase, Cpu, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PartnerPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"teacher" | "student" | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleRoleSelect = (role: "teacher" | "student") => {
    setSelectedRole(role);
    if (role === 'teacher') {
      router.push('/signup/teacher');
    } else {
      router.push('/signup/student');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setFormSubmitted(true);
    // In a real app, you'd send this to a backend or use an email service
  };

  if (formSubmitted) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background text-foreground relative">
        <LandingHeader />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-xl w-full p-12 rounded-3xl bg-card border border-primary/20 text-center space-y-8 shadow-2xl shadow-primary/10">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-4xl font-bold font-headline">Request Dispatched!</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Our Institutional Partnership team has received your details. An executive will reach out to <span className="text-foreground font-bold italic">info@vasudev.online</span> on your behalf or contact you directly within 24 hours.
            </p>
            <Button size="lg" className="rounded-full w-full h-14 font-bold" onClick={() => router.push('/')}>
              Return to Home
            </Button>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="flex min-h-screen w-full flex-col bg-background text-foreground relative">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
        
        <LandingHeader />

        <main className="flex-1">
          {/* Partnership Hero */}
          <section className="py-24 px-6 sm:px-12 lg:px-24 border-b border-white/5 relative overflow-hidden">
            <div className="max-w-6xl mx-auto space-y-8 relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-2">
                <Handshake className="h-4 w-4" />
                <span>Institutional Collaboration Program</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-headline font-bold tracking-tight leading-[1.05]">
                Partner with <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">Learnivo AI.</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Join the vanguard of the AI revolution in education. We collaborate with forward-thinking schools to deploy enterprise-grade intelligence.
              </p>
            </div>
          </section>

          <section className="py-24 px-6 sm:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
              
              {/* Value Props for Partners */}
              <div className="lg:col-span-5 space-y-12 pt-12">
                 <div className="space-y-4">
                    <h2 className="text-3xl font-bold font-headline">Why Partner with Us?</h2>
                    <p className="text-muted-foreground leading-relaxed">We don't just sell software; we build a legacy for your institution.</p>
                 </div>

                 <div className="space-y-8">
                    {[
                        { icon: <Building2 className="h-6 w-6" />, title: "Campus-Wide Deployment", desc: "Unified AI access for every teacher, student, and admin." },
                        { icon: <Briefcase className="h-6 w-6" />, title: "Custom Training", desc: "On-site workshops to ensure 100% technology adoption." },
                        { icon: <MapPin className="h-6 w-6" />, title: "Localized Content", desc: "AI models mapped exactly to your school's unique curriculum." }
                    ].map((item, id) => (
                        <div key={id} className="flex gap-6 group">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                              {item.icon}
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xl font-bold">{item.title}</h4>
                                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                 </div>

                  <div className="p-8 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
                     <Cpu className="h-8 w-8 text-primary" />
                     <h3 className="text-xl font-bold italic">Engineering by Vasudev AI</h3>
                    <p className="text-sm text-muted-foreground">
                      Partners receive direct access to our core engineering team for custom feature development and priority support.
                    </p>
                 </div>
              </div>

              {/* Partnership Form */}
              <div className="lg:col-span-7">
                <div className="p-12 rounded-3xl bg-card border border-white/10 shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"></div>
                   <div className="relative z-10 space-y-10">
                      <div className="space-y-4">
                         <h2 className="text-3xl font-bold">Partnership Inquiry</h2>
                         <p className="text-muted-foreground italic">Strictly for Institution Leaders & Decision Makers.</p>
                      </div>

                      <form className="space-y-8" onSubmit={handleSubmit}>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                               <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Institution Name</label>
                               <div className="relative">
                                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                  <Input placeholder="Global International School" className="rounded-2xl border-white/10 bg-white/5 h-14 pl-12 pr-6 text-lg" required />
                               </div>
                            </div>
                            <div className="space-y-3">
                               <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Contact Person</label>
                               <div className="relative">
                                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                  <Input placeholder="Director / Principal" className="rounded-2xl border-white/10 bg-white/5 h-14 pl-12 pr-6 text-lg" required />
                               </div>
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                               <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Official Email</label>
                               <div className="relative">
                                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                  <Input type="email" placeholder="admin@school.com" className="rounded-2xl border-white/10 bg-white/5 h-14 pl-12 pr-6 text-lg" required />
                               </div>
                            </div>
                            <div className="space-y-3">
                               <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Student Strength</label>
                               <div className="relative">
                                  <Users2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                  <Input placeholder="Roughly 500+" className="rounded-2xl border-white/10 bg-white/5 h-14 pl-12 pr-6 text-lg" required />
                               </div>
                            </div>
                         </div>

                         <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Specific Collaboration Needs</label>
                            <Textarea 
                                placeholder="Describe your vision for AI implementation in your campus..." 
                                className="rounded-2xl border-white/10 bg-white/5 min-h-[160px] p-6 text-lg"
                                required
                            />
                         </div>

                         <Button size="lg" className="w-full h-16 rounded-2xl gap-3 text-xl font-bold shadow-2xl transition-all hover:scale-[1.01] active:scale-95">
                            <Send className="h-6 w-6" /> Submit Proposal
                         </Button>
                         
                         <p className="text-center text-xs text-muted-foreground">
                            By submitting, you agree to be contacted by <span className="text-foreground font-bold">info@vasudev.online</span>.
                         </p>
                      </form>
                   </div>
                </div>
              </div>
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
