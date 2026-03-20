"use client";

import { memo, useState, useEffect } from "react";
import { Clock, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WaitForResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaitForResetModal = memo(function WaitForResetModal({
  isOpen,
  onClose,
}: WaitForResetModalProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-border/50 bg-gradient-to-b from-background to-background/95 backdrop-blur-xl">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <DialogTitle className="text-xl font-semibold">
              Credits Exhausted
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              You&apos;ve used all your daily credits. New credits will be available at midnight.
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="bg-muted/40 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
            <p className="text-xs text-muted-foreground text-center mb-4 uppercase tracking-wider font-medium">
              Time until reset
            </p>
            <div className="flex justify-center items-center gap-3">
              <TimeBlock value={formatNumber(timeLeft.hours)} label="Hours" />
              <span className="text-3xl font-bold text-muted-foreground/50 -mt-5">:</span>
              <TimeBlock value={formatNumber(timeLeft.minutes)} label="Minutes" />
              <span className="text-3xl font-bold text-muted-foreground/50 -mt-5">:</span>
              <TimeBlock value={formatNumber(timeLeft.seconds)} label="Seconds" />
            </div>
          </div>

          {/* Info */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Reset at 12:00 AM • 30 credits daily</span>
          </div>

          {/* Close button */}
          <Button 
            onClick={onClose} 
            className="w-full"
            size="lg"
          >
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

function TimeBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="bg-background/80 rounded-xl px-5 py-3 border border-border/50 shadow-sm">
        <span className="text-4xl font-bold tabular-nums">
          {value}
        </span>
      </div>
      <span className="text-xs text-muted-foreground mt-2 block">
        {label}
      </span>
    </div>
  );
}
