
"use client";

import { useState, useEffect, type ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { UserNav } from "@/components/layout/user-nav";
import {
  SidebarProvider,
  Sidebar,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspaceProvider } from "@/context/workspace-context";
import { AIAssistant } from "@/components/ai-assistant";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { Loader2 } from "lucide-react";
export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, profile, isUserLoading, isProfileLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  useEffect(() => {
    if (isUserLoading || isProfileLoading || pathname === '/') return;

    if (!user) {
      // Only redirect to login if we are NOT on the landing page
      if (pathname !== '/') {
        router.replace("/login");
      }
      return;
    }

    // Determine if the user should be treated as "Onboarded"
    // We treat them as onboarded if they've finished it, OR if they already have a role (existing users)
    const isTeacher = profile?.role === 'Teacher';
    const isStudent = profile?.role === 'Student';
    const hasRole = isTeacher || isStudent;
    const isOnboarded = profile?.hasCompletedOnboarding === true || (profile?.hasCompletedOnboarding === undefined && hasRole);

    // Case 1: User is onboarded but on the wrong path (Only redirect if they land on onboarding or auth pages)
    if (isOnboarded || hasRole) {
      if (isStudent && (pathname === '/onboarding')) {
        router.replace('/student/dashboard');
        return;
      } 
      if (isTeacher && (pathname === '/onboarding' || pathname.startsWith('/student'))) {
        router.replace('/dashboard');
        return;
      }
    }

    // Case 2: User explicitly needs onboarding
    if (profile?.hasCompletedOnboarding === false && pathname !== '/onboarding') {
      router.replace('/onboarding');
      return;
    }
    
    // Case 3: No profile document yet and not on onboarding
    if (!profile && pathname !== '/onboarding') {
        router.replace('/onboarding');
        return;
    }

  }, [isUserLoading, isProfileLoading, user, profile, router, pathname]);

  const showLoader = isUserLoading || isProfileLoading || !user;

  if (showLoader) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <WorkspaceProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {/* Main Sidebar */}
          <Sidebar>
            <AppSidebar />
          </Sidebar>

          <div className="flex flex-1 flex-col relative w-full overflow-hidden bg-sidebar">
            <div className="flex flex-1 overflow-hidden w-full">
              <main className="flex-1 p-0 overflow-hidden w-full">
                <div className="h-full w-[calc(100%-4px)] overflow-auto rounded-t-[1.5rem] bg-card px-4 py-4 sm:py-8 m-0 border-t border-l border-r border-white/5 shadow-[-10px_0_30px_rgba(0,0,0,0.2)] mt-[3px] mr-[3px] ml-[1px]">
                  <div className="w-full">
                    {children}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>

        {/* Floating AI Assistant Button */}
        <div className="fixed bottom-6 right-6 z-50">
            <Button 
                onClick={() => setIsAssistantOpen(true)}
                size="icon"
                className="h-14 w-14 rounded-full shadow-2xl bg-primary text-primary-foreground hover:scale-110 transition-transform shadow-primary/20 border border-white/10"
            >
                <Bot className="h-7 w-7" />
            </Button>
        </div>

        <AIAssistant isOpen={isAssistantOpen} onOpenChange={setIsAssistantOpen} />
      </SidebarProvider>
    </WorkspaceProvider>
  );
}
