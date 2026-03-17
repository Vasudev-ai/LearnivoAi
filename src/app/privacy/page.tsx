"use client";

import { LandingHeader } from "@/components/layout/landing-header";
import { LandingFooter } from "@/components/layout/landing-footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { User, Shield, Lock, Eye, FileText, Scale, Gavel, CheckCircle2, History, AlertCircle } from "lucide-react";

export default function PrivacyPage() {
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
          {/* Minimalist Hero */}
          <section className="py-24 px-6 sm:px-12 lg:px-24 border-b border-white/5 relative overflow-hidden text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-2">
                  <Shield className="h-4 w-4" />
                  <span>Verified Legal Document</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-headline font-bold">Privacy Protocol</h1>
              <p className="text-xl text-muted-foreground">Version 2.0 • Last Revised: March 2026</p>
            </div>
          </section>

          <section className="py-24 px-6 sm:px-12 lg:px-24">
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-1 gap-16">
              {/* Table of Contents / Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                 <div className="p-6 rounded-2xl bg-card border border-white/5 space-y-3">
                    <Eye className="h-6 w-6 text-primary" />
                    <h3 className="font-bold">Transparency</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">No hidden tracking. No data siloing.</p>
                 </div>
                 <div className="p-6 rounded-2xl bg-card border border-white/5 space-y-3">
                    <Lock className="h-6 w-6 text-orange-500" />
                    <h3 className="font-bold">Encryption</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">AES-256 standard across all repositories.</p>
                 </div>
                 <div className="p-6 rounded-2xl bg-card border border-white/5 space-y-3">
                    <Scale className="h-6 w-6 text-blue-500" />
                    <h3 className="font-bold">Rights</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">GDPR & DPDP compliant data rights.</p>
                 </div>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none space-y-16">
                <section className="space-y-6">
                  <div className="flex items-center gap-4 border-l-4 border-primary pl-6 py-2">
                      <h2 className="text-3xl font-bold font-headline m-0">1. Data Architecture</h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    At Learnivo AI, we operate on a "Principle of Least Privilege." We only collect the bare minimum telemetry required to fuel your school's AI models. Our architecture is designed to prevent data leakage and ensure that institutional intelligence remains isolated and secure within your tenant.
                  </p>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4 border-l-4 border-primary pl-6 py-2">
                      <h2 className="text-3xl font-bold font-headline m-0">2. Model Training Ethics</h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Vasudev AI does not use your proprietary teaching materials, student assessments, or private documents to train public base models. Your academic intellectual property (IP) is protected through cryptographically signed access layers.
                  </p>
                  <div className="p-8 rounded-2xl bg-primary/5 border border-primary/20 flex gap-6 items-start">
                     <AlertCircle className="h-8 w-8 text-primary shrink-0" />
                     <p className="text-base text-muted-foreground m-0 italic font-medium">
                        "Your content is used exclusively for YOUR classroom experience. We do not recycle teacher creativity for external profit."
                     </p>
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4 border-l-4 border-primary pl-6 py-2">
                      <h2 className="text-3xl font-bold font-headline m-0">3. Global Standards</h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    As a global brand, we comply with the most stringent data protection acts, including the Indian Digital Personal Data Protection (DPDP) Act, ensuring that educators in India have the same level of protection as global counterparts.
                  </p>
                </section>
              </div>

              {/* Contact / Legal Team */}
              <div className="mt-20 p-12 rounded-2xl bg-card border border-white/5 text-center space-y-6">
                  <History className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="text-2xl font-bold font-headline">Legal Inquiries</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">For detailed DPA (Data Processing Agreements) or legal audits, please contact our legal counsel.</p>
                  <p className="text-primary font-bold text-xl">info@vasudev.online</p>
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
