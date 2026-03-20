"use client";

import { memo } from "react";
import { AlertTriangle, Clock, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTimeUntilReset, getCreditCost } from "@/lib/credit-service";

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  currentCredits: number;
  onBuyCredits?: () => void;
}

export const InsufficientCreditsModal = memo(function InsufficientCreditsModal({
  isOpen,
  onClose,
  toolName,
  currentCredits,
  onBuyCredits,
}: InsufficientCreditsModalProps) {
  const requiredCredits = 5;
  const creditsNeeded = requiredCredits - currentCredits;
  const timeUntilReset = getTimeUntilReset();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-yellow-500/10 p-3">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <DialogTitle className="text-center">Insufficient Credits</DialogTitle>
          <DialogDescription className="text-center">
            You need more credits to generate this content
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Required for {toolName}</span>
              <span className="font-semibold">5 credits</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Your balance</span>
              <span className="font-semibold">{currentCredits} credits</span>
            </div>
            <div className="border-t pt-3 flex items-center justify-between">
              <span className="font-medium">You need</span>
              <span className="font-bold text-lg text-primary">
                {creditsNeeded} more credits
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Credits reset tomorrow at 12:00 AM</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Wait {timeUntilReset} to get {30} new credits
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
          <Button onClick={onBuyCredits} className="w-full sm:w-auto">
            <Zap className="mr-2 h-4 w-4" />
            Buy Credits
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
