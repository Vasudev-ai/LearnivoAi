"use client";

import { useState, useCallback } from "react";
import { useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { checkUserCredits, deductCredits, getCreditCost } from "@/lib/credit-service";
import { WaitForResetModal } from "@/components/wait-for-reset-modal";

export interface CreditCheckResult {
  success: boolean;
  creditsUsed: number;
  remainingCredits: number;
  isPremium: boolean;
}

export function useCreditCheck() {
  const { profile } = useUser();
  const { toast } = useToast();
  const [showWaitModal, setShowWaitModal] = useState(false);

  const checkAndDeduct = useCallback(async (toolName: string): Promise<boolean> => {
    if (!profile?.id) {
      toast({
        title: "Not logged in",
        description: "Please log in to use this feature",
        variant: "destructive",
      });
      return false;
    }

    const creditCheck = await checkUserCredits(profile.id, toolName);

    if (!creditCheck.hasEnough) {
      setShowWaitModal(true);
      return false;
    }

    // ACTUAL DEDUCTION MOVED TO SERVER ACTIONS FOR SECURITY
    // This hook now only acts as a pre-flight check so the UI can show the modal immediately.
    
    return true;
  }, [profile?.id, toast]);

  const showCreditToast = useCallback((creditsUsed: number, remaining: number) => {
    toast({
      title: "Content Generated",
      description: `Used ${creditsUsed} credits. ${remaining} credits remaining.`,
      duration: 5000,
    });
  }, [toast]);

  const InsufficientModal = (
    <WaitForResetModal
      isOpen={showWaitModal}
      onClose={() => setShowWaitModal(false)}
    />
  );

  return {
    checkAndDeduct,
    showCreditToast,
    InsufficientModal,
    getToolCost: getCreditCost,
  };
}
