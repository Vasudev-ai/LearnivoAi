
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
import { Search, Settings, HelpCircle, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
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
      <div className="mt-auto">
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
    const isLoading = isUserLoading || isProfileLoading;
    if (!isLoading) {
      if (!user) {
        router.push("/login");
        return;
      }

      if (!profile && pathname !== '/onboarding') {
        router.replace('/onboarding');
        return;
      }
      
      if (profile && !profile.hasCompletedOnboarding && pathname !== '/onboarding') {
        router.replace('/onboarding');
        return;
      }
      
      if (user && !user.emailVerified && pathname !== '/onboarding') {
        router.replace('/onboarding');
        return;
      }

      if (profile?.hasCompletedOnboarding) {
        if (profile.role === 'Student' && !pathname.startsWith('/student') && pathname !== '/onboarding') {
          router.replace('/student/dashboard');
        } else if (profile.role === 'Teacher' && pathname.startsWith('/student')) {
          router.replace('/dashboard');
        }
      }
    }
  }, [isUserLoading, isProfileLoading, user, profile, router, pathname]);

  const showLoader = isUserLoading || isProfileLoading || !user || (!profile && pathname !== '/onboarding') || (profile && !profile.hasCompletedOnboarding && pathname !== '/onboarding') || (user && !user.emailVerified && pathname !== '/onboarding');

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
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between gap-4 bg-sidebar/50 backdrop-blur-md px-4 sm:px-6 border-b border-white/5 ml-auto">
            <div className="flex items-center gap-4 pl-[--sidebar-width-icon] md:pl-0">
              <SidebarTrigger className="-ml-1" />
            </div>
            <div className="flex flex-1 justify-center">
              <form>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search for tools, lessons..."
                    className="w-full appearance-none bg-card/50 pl-10 h-11 shadow-none md:w-80 lg:w-[32rem] transition-all focus:md:w-[36rem] border-white/10"
                  />
                </div>
              </form>
            </div>
            <UserNav />
          </header>
          <div className="flex flex-1">
            <Sidebar>
              <AppSidebar />
            </Sidebar>
            <div className="flex flex-1">
                <main className="flex-1 p-0 overflow-hidden">
                    <div className="h-full w-full overflow-auto rounded-tl-[2.5rem] bg-card p-4 sm:p-8 m-0 border-t border-l border-white/5">
                        {children}
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
