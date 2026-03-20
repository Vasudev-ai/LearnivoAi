"use client";

import { memo, useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";
import { 
  getCreditPercentage,
  DAILY_CREDITS,
  MAX_CREDITS 
} from "@/lib/credit-service";

export const CreditCard = memo(function CreditCard({ className }: { className?: string }) {
  const { profile } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const credits = mounted && profile?.credits !== undefined ? profile.credits : DAILY_CREDITS;
  const isPremium = profile?.isPremium || false;
  const maxCredits = isPremium ? MAX_CREDITS : DAILY_CREDITS;
  const percentage = getCreditPercentage(credits, maxCredits);

  return (
    <div className={cn("rounded-lg border bg-gradient-to-br from-primary/10 to-primary/5 p-4 space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Credits</span>
          {isPremium && (
            <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-600">
              PRO
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          Daily reset
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Daily Credits</span>
          <span className="font-semibold tabular-nums">{credits} / {maxCredits}</span>
        </div>
        
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              percentage > 50 ? "bg-primary" : percentage > 20 ? "bg-yellow-500" : "bg-red-500"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {credits === 0 && (
        <div className="rounded-md bg-red-500/10 p-2 text-xs text-red-600 text-center">
          No credits remaining. Resets tomorrow!
        </div>
      )}

      {credits < 10 && credits > 0 && (
        <div className="rounded-md bg-yellow-500/10 p-2 text-xs text-yellow-600 text-center">
          Running low! Only {credits} credits left.
        </div>
      )}
    </div>
  );
});
