"use client";

import { LandingHeader } from "@/components/layout/landing-header";
import { LandingFooter } from "@/components/layout/landing-footer";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { User, HelpCircle, ChevronDown, Search, MessageCircle, Zap, ShieldCheck, CreditCard, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";

const faqs = [
  {
    category: "The Basics",
    icon: <BookOpen className="h-5 w-5" />,
    items: [
      {
        question: "What exactly is Learnivo AI?",
        answer: "Learnivo AI is the flagship educational intelligence platform of Vasudev AI. It serves as a comprehensive ‘Operating System’ for teachers, automating lesson planning, assessment generation, and administrative reporting through enterprise-grade machine learning models."
      },
      {
        question: "Who is behind Learnivo?",
        answer: "Learnivo is engineered and maintained by Vasudev AI, a leading research laboratory dedicated to building high-performance artificial intelligence solutions. Our team consists of elite software architects, data scientists, and veteran educators."
      }
    ]
  },
  {
    category: "Security & Ethics",
    icon: <ShieldCheck className="h-5 w-5" />,
    items: [
      {
        question: "Is student data protected?",
        answer: "Data security is our primary pillar. Learnivo AI employs AES-256 bank-level encryption and adheres to strict PII (Personally Identifiable Information) protection protocols. We never sell data to third parties."
      },
      {
        question: "Does the AI replace teachers?",
        answer: "Never. Learnivo AI is designed as a ‘Co-Pilot’. It handles the mechanical and repetitive aspects of teaching, allowing educators to focus on the deeply human aspects of mentorship, emotional support, and inspiration."
      }
    ]
  },
  {
    category: "Billing & Credits",
    icon: <CreditCard className="h-5 w-5" />,
    items: [
      {
        question: "How does the credit system work?",
        answer: "High-performance AI generation requires significant compute power. We use a credit-based system to allocate these resources. Different tasks (like a simple quiz vs. a full curriculum plan) consume different amounts of credits."
      }
    ]
  }
];

export default function FAQPage() {
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
            <div className="max-w-6xl mx-auto space-y-10 relative z-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-2">
                    <HelpCircle className="h-4 w-4" />
                    <span>Resource Center</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-headline font-bold tracking-tight leading-[1.05]">
                    Knowledge <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">Unlocked.</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                    Everything you need to know about Learnivo's ecosystem, security, and potential.
                </p>
              </div>

              <div className="relative max-w-2xl group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                 <Input 
                    placeholder="Search for answers (e.g. security, billing, credits)..." 
                    className="h-16 pl-16 pr-8 rounded-2xl bg-card border-white/10 text-lg shadow-2xl shadow-primary/5 focus:ring-primary/20"
                 />
              </div>
            </div>
          </section>

          <section className="py-24 px-6 sm:px-12 lg:px-24">
            <div className="max-w-4xl mx-auto space-y-20">
              {faqs.map((group, gIdx) => (
                <div key={gIdx} className="space-y-8">
                   <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        {group.icon}
                      </div>
                      <h2 className="text-2xl font-bold font-headline uppercase tracking-widest opacity-80">{group.category}</h2>
                   </div>
                   <Accordion type="single" collapsible className="w-full space-y-4">
                     {group.items.map((faq, index) => (
                       <AccordionItem 
                           key={index} 
                           value={`item-${gIdx}-${index}`}
                           className="border border-white/10 rounded-3xl bg-card px-8 py-2 hover:border-primary/50 transition-all data-[state=open]:border-primary/50 data-[state=open]:shadow-[0_30px_60px_-15px_rgba(var(--primary-rgb),0.1)] overflow-hidden"
                       >
                         <AccordionTrigger className="text-xl font-bold hover:no-underline py-6 text-left">
                           {faq.question}
                         </AccordionTrigger>
                         <AccordionContent className="text-muted-foreground leading-relaxed text-lg pt-2 pb-8">
                           {faq.answer}
                         </AccordionContent>
                       </AccordionItem>
                     ))}
                   </Accordion>
                </div>
              ))}
            </div>
          </section>

          {/* Support CTA */}
          <section className="py-24 px-6 mb-24 max-w-6xl mx-auto">
             <div className="p-16 rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground relative overflow-hidden text-center space-y-8">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-[100px] -mr-48 -mt-48 rounded-full"></div>
                <Zap className="h-16 w-16 mx-auto opacity-50" />
                <h2 className="text-4xl md:text-6xl font-bold font-headline">Still curious?</h2>
                <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
                  Our dedicated support engineers are available 24/7 for institutional clients. Join the vanguard of education today.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
                    <Button size="lg" variant="secondary" className="rounded-full h-16 px-12 text-xl font-bold shadow-2xl" asChild>
                        <a href="/contact">Message Support</a>
                    </Button>
                    <Button size="lg" variant="ghost" className="rounded-full h-16 px-12 text-xl font-bold border-white/20 hover:bg-white/5" asChild>
                        <Link href="/partner">Partner Portal</Link>
                    </Button>
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
