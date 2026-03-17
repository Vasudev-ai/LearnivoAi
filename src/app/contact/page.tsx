"use client";

import { LandingHeader } from "@/components/layout/landing-header";
import { LandingFooter } from "@/components/layout/landing-footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, MapPin, Send, MessageSquare, Headphones, Globe2, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
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
          {/* Hero Section */}
          <section className="py-24 px-6 sm:px-12 lg:px-24 border-b border-white/5 relative overflow-hidden">
            <div className="max-w-6xl mx-auto space-y-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-2">
                <Headphones className="h-4 w-4" />
                <span>Global Support Network</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-headline font-bold tracking-tight leading-[1.05]">
                Let's Build the <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">Future Together.</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                Whether you're a single teacher or a global institution, the Learnivo team is here to ensure your AI journey is seamless.
              </p>
            </div>
          </section>

          <section className="py-24 px-6 sm:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Contact Info */}
              <div className="lg:col-span-5 space-y-12">
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold font-headline">Contact Channels</h2>
                  <div className="space-y-6">
                    <div className="group flex items-center gap-6 p-8 rounded-2xl bg-card border border-white/5 hover:border-primary/30 transition-all duration-500 shadow-xl shadow-black/10">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Mail className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">General Queries</p>
                        <p className="text-xl font-bold">info@learnivo.app</p>
                      </div>
                    </div>

                    <div className="group flex items-center gap-6 p-8 rounded-2xl bg-card border border-white/5 hover:border-primary/30 transition-all duration-500 shadow-xl shadow-black/10">
                      <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                        <Phone className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Support Line</p>
                        <p className="text-xl font-bold">+91 9719205268</p>
                      </div>
                    </div>

                    <div className="group flex items-center gap-6 p-8 rounded-2xl bg-card border border-white/5 hover:border-primary/30 transition-all duration-500 shadow-xl shadow-black/10">
                      <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                        <MapPin className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Headquarters</p>
                        <p className="text-xl font-bold">Uttar Pradesh, India</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-10 rounded-3xl bg-primary/5 border border-primary/20 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16"></div>
                  <Globe2 className="h-10 w-10 text-primary" />
                  <h3 className="text-2xl font-bold">Global Partnerships</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Looking for institutional collaboration? Our dedicated sales team handles complex deployments for schools with 500+ users.
                  </p>
                  <Button variant="link" className="p-0 text-primary font-bold h-auto gap-2 group" asChild>
                    <a href="mailto:info@vasudev.online">
                      Email Partnership Team <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-7">
                <div className="p-12 rounded-3xl bg-card border border-white/10 shadow-2xl shadow-primary/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"></div>
                  <div className="relative z-10 space-y-10">
                    <div className="space-y-4">
                      <h2 className="text-3xl font-bold">Inquiry Form</h2>
                      <p className="text-muted-foreground">Fill in the details below and our AI engineer will reach out shortly.</p>
                    </div>
                    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                          <Input placeholder="Johnathan Doe" className="rounded-2xl border-white/10 bg-white/5 focus:ring-primary h-14 px-6 text-lg" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                          <Input type="email" placeholder="john@learnivo.app" className="rounded-2xl border-white/10 bg-white/5 focus:ring-primary h-14 px-6 text-lg" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Subject</label>
                        <Input placeholder="Institutional Collaboration / Support" className="rounded-2xl border-white/10 bg-white/5 focus:ring-primary h-14 px-6 text-lg" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Detailed Message</label>
                        <Textarea placeholder="How can we help you transform your school?" className="rounded-3xl border-white/10 bg-white/5 focus:ring-primary min-h-[200px] p-6 text-lg" />
                      </div>
                      <Button className="w-full h-16 rounded-2xl gap-3 text-xl font-bold shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] transition-all hover:scale-[1.02] active:scale-95">
                        <Send className="h-6 w-6" /> Dispatch Inquiry
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Map Preview / Global Presence CTA */}
          <section className="py-24 px-6 text-center max-w-4xl mx-auto space-y-10">
            <div className="inline-flex h-20 w-20 rounded-3xl bg-primary/10 items-center justify-center text-primary mb-4">
              <MessageSquare className="h-10 w-10" />
            </div>
            <h2 className="text-4xl md:text-5xl font-headline font-bold">Preferred Support Hub</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              All inquiries are prioritized based on urgeny. Standard response time is 2 hours for Pro users and 24 hours for Basic users.
            </p>
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
