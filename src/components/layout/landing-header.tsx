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
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20 rounded-full bg-slate-200 dark:bg-white/20" />
          <Skeleton className="h-9 w-28 rounded-full bg-slate-200 dark:bg-white/20" />
        </div>
      );
    }
    
    if (user) {
      return (
        <>
          <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10 rounded-full h-9 px-4 text-sm font-medium transition-colors" asChild>
            <Link href={profile?.role === 'Student' ? "/student/dashboard" : "/dashboard"}>Dashboard</Link>
          </Button>
          <div className="pl-2">
            <UserNav hideDetails />
          </div>
        </>
      );
    }

    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10 rounded-full h-9 px-4 text-sm font-medium transition-colors hidden sm:flex" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <DialogTrigger asChild>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black font-medium transition-colors rounded-full shadow-md h-9 px-5 ml-1">Get Started</Button>
        </DialogTrigger>
      </div>
    );
  }

  return (
    <div className="fixed top-6 left-0 right-0 z-[999] px-4 pointer-events-none flex justify-center">
      <header className="w-full max-w-5xl pointer-events-auto rounded-full bg-white/90 border-slate-200 dark:bg-[#1A1A1A] border dark:border-white/10 shadow-lg dark:shadow-2xl backdrop-blur-xl transition-all duration-300 px-3 py-2">
        <div className="flex items-center justify-between h-10">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 pl-2 group">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-headline text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white hidden sm:block">
              Learnivo AI
            </span>
          </Link>
          
          {/* Middle: Nav Links (Desktop) */}
          <nav className="hidden md:flex flex-1 justify-center items-center gap-6">
              <Link href="/#features" className="text-[14px] font-medium text-slate-600 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white transition-all">
                Features
              </Link>
              <Link href="/#pricing" className="text-[14px] font-medium text-slate-600 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white transition-all">
                Pricing
              </Link>
              <Link href="/about" className="text-[14px] font-medium text-slate-600 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white transition-all">
                About Us
              </Link>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center">
            <div className="flex items-center gap-1 sm:gap-2">
              <AuthButtons />
            </div>
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10 ml-2 rounded-full h-9 w-9">
                  <Menu className="h-5 w-5" />
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
                    <Button variant="outline" asChild className="w-full justify-start rounded-full">
                      <Link href="/login">Login</Link>
                    </Button>
                    {/* The Get Started triggers signup modal, handled by parent component. In mobile maybe it needs its own Dialog trigger but standard AuthButtons here won't pop up right unless the modal root is above this Sheet. We'll leave it as is or hide GetStarted in mobile menu if tricky, but standard link is safe */}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </div>
  );
}
