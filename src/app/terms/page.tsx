"use client";

import { LandingHeader } from "@/components/layout/landing-header";
import { LandingFooter } from "@/components/layout/landing-footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { User, Gavel, Scale, FileCheck, ShieldAlert, Zap, Globe, Cpu } from "lucide-react";

export default function TermsPage() {
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
          <section className="py-24 px-6 sm:px-12 lg:px-24 border-b border-white/5 relative overflow-hidden text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-2">
                  <Gavel className="h-4 w-4" />
                  <span>Service Agreement</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-headline font-bold">Terms of Usage</h1>
              <p className="text-xl text-muted-foreground uppercase tracking-[0.2em] font-medium">Agreement between the User & Vasudev AI</p>
            </div>
          </section>

          <section className="py-24 px-6 sm:px-12 lg:px-24">
            <div className="max-w-4xl mx-auto space-y-16">
              
              {/* Quality Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                 <div className="p-10 rounded-3xl bg-card border border-white/5 space-y-4 shadow-xl shadow-black/10">
                    <Zap className="h-8 w-8 text-primary" />
                    <h3 className="text-2xl font-bold font-headline">Service Uptime</h3>
                    <p className="text-muted-foreground leading-relaxed">We target 99.9% uptime for Pro and Institutional tenants, ensuring your classroom never stops learning.</p>
                 </div>
                 <div className="p-10 rounded-3xl bg-card border border-white/5 space-y-4 shadow-xl shadow-black/10">
                    <Cpu className="h-8 w-8 text-blue-500" />
                    <h3 className="text-2xl font-bold font-headline">AI Integrity</h3>
                    <p className="text-muted-foreground leading-relaxed">Users agree to use our AI generators ethically, avoiding the creation of harmful or misleading academic content.</p>
                 </div>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none space-y-20">
                <section className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                         <span className="text-xl font-black">01</span>
                      </div>
                      <h2 className="text-3xl font-bold font-headline m-0">Acceptance of Vision</h2>
                   </div>
                   <p className="text-lg text-muted-foreground leading-relaxed">
                     By accessing Learnivo AI, you are not just using software; you are participating in a global vision for augmented education. Use of the platform signifies your acceptance of these Terms and any future modifications designed to enhance service delivery.
                   </p>
                </section>

                <section className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                         <span className="text-xl font-black">02</span>
                      </div>
                      <h2 className="text-3xl font-bold font-headline m-0">License & Intellectual Property</h2>
                   </div>
                   <p className="text-lg text-muted-foreground leading-relaxed">
                     Vasudev AI grants you a personal, worldwide, royalty-free, non-assignable license to use the Learnivo dashboard. All artifacts generated—lesson plans, emails, diagrams—remain your intellectual property, though we retain the rights to the underlying models and algorithms that facilitate their creation.
                   </p>
                </section>

                <section className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                         <ShieldAlert className="h-6 w-6" />
                      </div>
                      <h2 className="text-3xl font-bold font-headline m-0 text-orange-500">3. Fair Use & Limitations</h2>
                   </div>
                   <p className="text-lg text-muted-foreground leading-relaxed">
                     Automated scraping, reverse engineering of models, or any attempt to bypass credit limits constitutes a breach of service. Vasudev AI reserves the right to terminate access immediately for accounts exhibiting anomalous usage patterns.
                   </p>
                </section>
              </div>

              {/* Final Compliance Check */}
              <div className="mt-20 p-16 rounded-[2.5rem] bg-primary text-primary-foreground text-center space-y-8 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
                  <FileCheck className="h-16 w-16 mx-auto opacity-50" />
                  <h3 className="text-3xl md:text-4xl font-bold font-headline">Compliance & Arbitration</h3>
                  <p className="text-xl opacity-90 max-w-2xl mx-auto">
                    Any disputes arising from the use of Learnivo AI shall be governed by the laws of India and subject to the exclusive jurisdiction of the courts in Uttar Pradesh.
                  </p>
                  <p className="font-bold text-2xl tracking-widest pt-4">© 2026 VASUDEV AI LABS</p>
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
