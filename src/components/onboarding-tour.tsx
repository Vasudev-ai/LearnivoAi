"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ChevronLeft, ChevronRight, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const TOUR_STORAGE_KEY = "learnivo-onboarding-tour-completed";

type TourStep = {
  id: string;
  page: string;
  title: string;
  description: string;
  targetSelector?: string;
  targetPosition?: "top" | "bottom" | "left" | "right" | "center";
  action?: (element: HTMLElement) => void;
};

const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    page: "/dashboard",
    title: "Welcome to Learnivo!",
    description: "Your AI-powered teaching assistant. Let me show you how to create your first lesson plan in just 2 minutes.",
    targetPosition: "center",
  },
  {
    id: "dashboard-tools",
    page: "/dashboard",
    title: "Your AI Teaching Tools",
    description: "Here are all your teaching tools. From lesson plans to quizzes, everything is just one click away.",
    targetSelector: '[data-tour="platform-grid"]',
    targetPosition: "top",
  },
  {
    page: "/dashboard",
    title: "Lesson Planner",
    description: "Click on Lesson Planner to create your first lesson plan. I'll take you there!",
    targetSelector: '[data-tour="lesson-planner-btn"]',
    targetPosition: "right",
  },
  {
    id: "subject-select",
    page: "/lesson-planner",
    title: "Select Your Subject",
    description: "First, select the subject you teach. This helps AI create relevant content for your students.",
    targetSelector: '[data-tour="subject-select"]',
    targetPosition: "bottom",
    action: (el) => {
        const select = el.querySelector('button');
        if (select) select.click();
    }
  },
  {
    id: "grade-select",
    page: "/lesson-planner",
    title: "Choose Grade Level",
    description: "Select the grade or class you teach. This ensures the content difficulty matches your students.",
    targetSelector: '[data-tour="grade-select"]',
    targetPosition: "bottom",
    action: (el) => {
        const select = el.querySelector('button');
        if (select) select.click();
    }
  },
  {
    id: "chapter-input",
    page: "/lesson-planner",
    title: "Enter Chapter Name",
    description: "Type the chapter or topic you want to create a lesson plan for.",
    targetSelector: '[data-tour="chapter-input"]',
    targetPosition: "bottom",
    action: (el) => {
        const input = el.querySelector('input');
        if (input) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
            nativeInputValueSetter?.call(input, "The Solar System");
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
  },
  {
    id: "generate-button",
    page: "/lesson-planner",
    title: "Generate Your Plan",
    description: "Click Generate and watch the magic! AI will create a complete lesson plan in seconds.",
    targetSelector: '[data-tour="generate-btn"]',
    targetPosition: "top",
  },
  {
    page: "/dashboard",
    title: "All Saved Here",
    description: "Your lesson plans are automatically saved to Workspace. Access them anytime!",
    targetSelector: 'a[href="/workspace"]#workspace-link',
    targetPosition: "right",
  },
  {
    id: "complete",
    page: "/dashboard",
    title: "You're All Set!",
    description: "That's it! You're ready to transform your teaching with AI. Explore other tools and join our WhatsApp group for tips!",
    targetPosition: "center",
  },
];

interface TourContextType {
  isTourOpen: boolean;
  currentStep: number;
  step: TourStep;
  totalSteps: number;
  targetRect: DOMRect | null;
  isNavigating: boolean;
  startTour: () => void;
  skipTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  completeTour: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function useOnboardingTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useOnboardingTour must be used within OnboardingTourProvider");
  }
  return context;
}

export function OnboardingTourProvider({ children }: { children: ReactNode }) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const hasNavigatedRef = useRef(false);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const hasCompletedTour = localStorage.getItem(TOUR_STORAGE_KEY);
    console.log('[Tour] Checking localStorage:', hasCompletedTour ? 'Tour completed before' : 'No previous tour');
    
    if (!hasCompletedTour) {
      console.log('[Tour] Starting tour in 1.5 seconds...');
      const timer = setTimeout(() => {
        console.log('[Tour] Tour is now OPEN');
        setIsTourOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!isTourOpen) return;
    
    const currentTourStep = TOUR_STEPS[currentStep];
    if (!currentTourStep) return;
    
    if (currentTourStep.page !== pathname && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      setIsNavigating(true);
      router.push(currentTourStep.page);
      setTimeout(() => {
        hasNavigatedRef.current = false;
        setIsNavigating(false);
      }, 1000);
    }
  }, [currentStep, pathname, router, isTourOpen]);

  useEffect(() => {
    if (!isTourOpen) return;
    
    const currentTourStep = TOUR_STEPS[currentStep];
    if (!currentTourStep?.targetSelector) {
      setTargetRect(null);
      return;
    }

    const updateRect = () => {
      const element = document.querySelector(currentTourStep.targetSelector!);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          const rect = element.getBoundingClientRect();
          setTargetRect(rect);
        }, 500);
      }
    };

    const timeout = setTimeout(updateRect, 600);
    return () => clearTimeout(timeout);
  }, [currentStep, pathname, isTourOpen]);

  const startTour = useCallback(() => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    setCurrentStep(0);
    setIsTourOpen(true);
  }, []);

  const skipTour = useCallback(() => {
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
    setIsTourOpen(false);
  }, []);

  const nextStep = useCallback(() => {
    hasNavigatedRef.current = false;
    
    // Execute action for current step if it exists
    const currentTourStep = TOUR_STEPS[currentStep];
    if (currentTourStep?.targetSelector) {
        const el = document.querySelector(currentTourStep.targetSelector);
        if (el && currentTourStep.action) {
            currentTourStep.action(el as HTMLElement);
        }
    }

    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      skipTour();
    }
  }, [currentStep, skipTour]);

  const prevStep = useCallback(() => {
    hasNavigatedRef.current = false;
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const completeTour = useCallback(() => {
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
    setIsTourOpen(false);
  }, []);

  const value: TourContextType = {
    isTourOpen,
    currentStep,
    step: TOUR_STEPS[currentStep],
    totalSteps: TOUR_STEPS.length,
    targetRect,
    isNavigating,
    startTour,
    skipTour,
    nextStep,
    prevStep,
    completeTour,
    isLastStep: currentStep === TOUR_STEPS.length - 1,
    isFirstStep: currentStep === 0,
  };

  return (
    <TourContext.Provider value={value}>
      {children}
      {isTourOpen && (
        <>
          {console.log('[Tour Overlay] Rendering at step:', currentStep, 'of', TOUR_STEPS.length)}
          <OnboardingOverlay
            step={TOUR_STEPS[currentStep]}
            currentStep={currentStep}
            totalSteps={TOUR_STEPS.length}
            targetRect={targetRect}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === TOUR_STEPS.length - 1}
            onSkip={skipTour}
            onNext={nextStep}
            onPrev={prevStep}
            onComplete={completeTour}
          />
        </>
      )}
    </TourContext.Provider>
  );
}

interface OnboardingOverlayProps {
  step: TourStep;
  currentStep: number;
  totalSteps: number;
  targetRect: DOMRect | null;
  isFirstStep: boolean;
  isLastStep: boolean;
  onSkip: () => void;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
}

function OnboardingOverlay({
  step,
  currentStep,
  totalSteps,
  targetRect: initialTargetRect,
  isFirstStep,
  isLastStep,
  onSkip,
  onNext,
  onPrev,
  onComplete,
}: OnboardingOverlayProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });
  const [targetRect, setTargetRect] = useState<DOMRect | null>(initialTargetRect);

  // Sync targetRect from props
  useEffect(() => {
    setTargetRect(initialTargetRect);
  }, [initialTargetRect]);

  // Track popover size
  useEffect(() => {
    if (tooltipRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
           setTooltipSize({
             width: entry.contentRect.width,
             height: entry.target.getBoundingClientRect().height
           });
        }
      });
      resizeObserver.observe(tooltipRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [step.id]); // Re-observe when step changes

  const progress = ((currentStep + 1) / totalSteps) * 100;

  const getTooltipStyle = (): React.CSSProperties => {
    const padding = 16;
    const tooltipWidth = tooltipSize.width || Math.min(420, window.innerWidth - 32);
    const tooltipHeight = tooltipSize.height || 220;

    if (!targetRect || step.targetPosition === "center") {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: "min(420px, calc(100vw - 32px))",
      };
    }

    let top = 0;
    let left = 0;

    switch (step.targetPosition) {
      case "bottom":
        top = targetRect.bottom + padding;
        left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        
        // Overflow check bottom
        if (top + tooltipHeight + padding > window.innerHeight) {
            top = targetRect.top - tooltipHeight - padding;
        }
        break;
      case "top":
        top = targetRect.top - tooltipHeight - padding;
        left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        
        // Overflow check top
        if (top < padding) {
            top = targetRect.bottom + padding;
        }
        break;
      case "left":
        top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
        left = targetRect.left - tooltipWidth - padding;
        break;
      case "right":
        top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
        left = targetRect.right + padding;
        break;
      default:
        top = window.innerHeight / 2 - tooltipHeight / 2;
        left = window.innerWidth / 2 - tooltipWidth / 2;
    }

    // Secondary overflow checks (safety)
    if (top < padding) top = padding;
    if (top + tooltipHeight > window.innerHeight - padding) {
      top = window.innerHeight - tooltipHeight - padding;
    }
    if (left < padding) left = padding;
    if (left + tooltipWidth > window.innerWidth - padding) {
      left = window.innerWidth - tooltipWidth - padding;
    }

    return {
      position: "fixed",
      top,
      left,
      width: tooltipWidth > 0 ? `${tooltipWidth}px` : 'auto',
      maxWidth: "min(420px, calc(100vw - 32px))",
    };
  };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {targetRect && step.targetPosition !== "center" && (
        <>
          <div 
            className="absolute bg-black/60 pointer-events-auto"
            style={{ top: 0, left: 0, right: 0, bottom: targetRect.top }}
            onClick={onSkip}
          />
          <div 
            className="absolute bg-black/60 pointer-events-auto"
            style={{ top: targetRect.top, left: 0, width: targetRect.left, bottom: window.innerHeight - targetRect.bottom }}
            onClick={onSkip}
          />
          <div 
            className="absolute bg-black/60 pointer-events-auto"
            style={{ top: targetRect.top, right: 0, width: `calc(100% - ${targetRect.right}px)`, bottom: window.innerHeight - targetRect.bottom }}
            onClick={onSkip}
          />
          <div 
            className="absolute bg-black/70 pointer-events-auto backdrop-blur-[2px]"
            style={{ top: targetRect.bottom, left: 0, right: 0, bottom: 0 }}
            onClick={onSkip}
          />

          <div 
            className="absolute pointer-events-none"
            style={{
               top: targetRect.top - 8,
               left: targetRect.left - 8,
               width: targetRect.width + 16,
               height: targetRect.height + 16,
               borderRadius: "16px",
               boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.7)",
               zIndex: -1
            }}
          />
          
          <div
            className="absolute pointer-events-none"
            style={{
              top: targetRect.top - 4,
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
              borderRadius: "12px",
              border: "3px solid hsl(var(--primary))",
              boxShadow: "0 0 0 4px hsl(var(--primary) / 0.3), 0 0 30px hsl(var(--primary) / 0.5)",
              animation: "pulse-glow 2s ease-in-out infinite",
            }}
          />
        </>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="pointer-events-auto"
        style={getTooltipStyle()}
        ref={tooltipRef}
      >
        <Card className="shadow-2xl border-primary/50 overflow-hidden">
          <div className="h-1 bg-muted">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <button
            onClick={onSkip}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted transition-colors z-10"
            aria-label="Skip tour"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
          
          <CardContent className="pt-6 pb-5 px-5">
            <div className="mb-3 pr-8">
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <h2 className="text-lg font-headline font-bold mt-1">
                {step.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {step.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex gap-1">
                {TOUR_STEPS.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      index === currentStep ? "w-6 bg-primary" : "w-1.5 bg-muted"
                    )}
                  />
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                {!isFirstStep && (
                  <Button variant="ghost" size="sm" onClick={onPrev} className="h-8 px-2 text-xs">
                    <ChevronLeft className="h-3 w-3 mr-0.5" />
                    Back
                  </Button>
                )}
                {isLastStep ? (
                  <Button size="sm" onClick={onComplete} className="h-8 px-3 text-xs">
                    Get Started
                    <Check className="h-3 w-3 ml-1" />
                  </Button>
                ) : (
                  <Button size="sm" onClick={onNext} className="h-8 px-3 text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    Next
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="bg-muted/90 backdrop-blur-sm rounded-full px-4 py-2 text-xs text-muted-foreground flex items-center gap-2 shadow-lg">
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 bg-background rounded text-[10px] font-mono">Space</kbd>
          <span>or</span>
          <kbd className="px-1.5 py-0.5 bg-background rounded text-[10px] font-mono">Enter</kbd>
        </div>
      </div>

      <KeyboardHandler onNext={onNext} onPrev={onPrev} onSkip={onSkip} />
      
      <style jsx global>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 4px hsl(var(--primary) / 0.3), 0 0 30px hsl(var(--primary) / 0.5); }
          50% { box-shadow: 0 0 0 8px hsl(var(--primary) / 0.2), 0 0 50px hsl(var(--primary) / 0.7); }
        }
      `}</style>
    </div>
  );
}

function KeyboardHandler({ onNext, onPrev, onSkip }: { onNext: () => void; onPrev: () => void; onSkip: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        onNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrev, onSkip]);

  return null;
}
