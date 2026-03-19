"use client";

import React, { useRef, type MouseEvent, type ComponentProps, memo } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends ComponentProps<typeof Card> {
  onClick?: () => void;
}

const SpotlightCardComponent = ({ children, className, onClick, ...props }: SpotlightCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    }
  };

  return (
    <Card
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={cn("spotlight-card cursor-default", onClick && "cursor-pointer", className)}
      {...props}
    >
      {children}
    </Card>
  );
};

export const SpotlightCard = memo(SpotlightCardComponent);
