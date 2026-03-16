
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
import { Settings, HelpCircle, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { WorkspaceProvider } from "@/context/workspace-context";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { AIAssistant } from "@/components/ai-assistant";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { Loader2 } from "lucide-react";

function RightSidebar({ onAssistantClick }: { onAssistantClick: () => void }) {
  return (
    <div className="sticky top-20 hidden h-[calc(100vh-5rem)] w-16 flex-col items-center gap-4 bg-sidebar py-4 lg:flex">
      <ThemeToggle />
      <NotificationPanel />
      <Button variant="ghost" size="icon" asChild>
        <Link href="/settings">
            <Settings className="h-5 w-5" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon">
        <HelpCircle className="h-5 w-5" />
      </Button>
      <div className="mt-auto flex flex-col items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onAssistantClick}>
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
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
    const isOnboarded = profile?.hasCompletedOnboarding === true || (hasRole && pathname !== '/onboarding');

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
        <div className="flex min-h-screen">
          {/* Main Sidebar */}
          <Sidebar>
            <AppSidebar />
          </Sidebar>

          <div className="flex flex-1 flex-col relative">
            <div className="flex flex-1 overflow-hidden">
              <main className="flex-1 p-0 overflow-hidden">
                <div className="h-full w-full overflow-auto rounded-tl-[2.5rem] bg-card p-4 sm:p-8 m-0 border-t border-l border-white/5 shadow-[-20px_0_40px_rgba(0,0,0,0.3)] mt-[3px]">
                  <div className="">
                    {children}
                  </div>
                </div>
              </main>
              <RightSidebar onAssistantClick={() => setIsAssistantOpen(true)} />
            </div>
          </div>
        </div>
        <AIAssistant isOpen={isAssistantOpen} onOpenChange={setIsAssistantOpen} />
      </SidebarProvider>
    </WorkspaceProvider>
  );
}
