"use client";

import Link from "next/link";
import { BookOpen, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUser } from "@/firebase";
import { UserNav } from "@/components/layout/user-nav";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

export function LandingHeader() {
  const { user, profile, isUserLoading, isProfileLoading } = useUser();
  const isLoading = useMemo(() => isUserLoading || isProfileLoading, [isUserLoading, isProfileLoading]);

  const AuthButtons = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      );
    }
    
    if (user) {
      return (
        <>
          <Button variant="ghost" asChild>
            <Link href={profile?.role === 'Student' ? "/student/dashboard" : "/dashboard"}>Dashboard</Link>
          </Button>
          <UserNav hideDetails />
        </>
      );
    }

    return (
      <>
        <Button variant="ghost" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <DialogTrigger asChild>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg shadow-primary/30">Get Started</Button>
        </DialogTrigger>
      </>
    );
  }

  return (
    <header className="sticky top-0 z-[999] w-full border-b border-white/10 bg-background/90 backdrop-blur-xl transition-all duration-300">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-all duration-300">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <span className="font-headline text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Learnivo AI
          </span>
        </Link>
        
        <div className="flex flex-1 justify-center">
          <nav className="hidden items-center gap-1 md:flex px-2 py-1.5 rounded-full bg-white/90 dark:bg-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-md border border-white/20 dark:border-white/10">
              <Link
                href="/#features"
                className="px-5 py-2 text-[13px] font-semibold text-slate-900 dark:text-slate-200 transition-all hover:text-primary rounded-full hover:bg-slate-50 dark:hover:bg-white/10"
              >
                Features
              </Link>
              <Link
                href="/#pricing"
                className="px-5 py-2 text-[13px] font-semibold text-slate-900 dark:text-slate-200 transition-all hover:text-primary rounded-full hover:bg-slate-50 dark:hover:bg-white/10"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="px-5 py-2 text-[13px] font-semibold text-slate-900 dark:text-slate-200 transition-all hover:text-primary rounded-full hover:bg-slate-50 dark:hover:bg-white/10"
              >
                About Us
              </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <AuthButtons />
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left flex items-center gap-2">
                   <BookOpen className="h-6 w-6 text-primary" />
                   Learnivo AI
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/#features" className="text-lg font-medium">Features</Link>
                <Link href="/#pricing" className="text-lg font-medium">Pricing</Link>
                <Link href="/about" className="text-lg font-medium">About Us</Link>
                <div className="flex flex-col gap-4 pt-4 border-t">
                   <AuthButtons />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
