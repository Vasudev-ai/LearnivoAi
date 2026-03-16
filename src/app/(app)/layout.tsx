
"use client";

import { useState, useEffect, type ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { UserNav } from "@/components/layout/user-nav";
import {
  SidebarProvider,
  Sidebar,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { BookOpen, MailCheck } from "lucide-react";
import { Search, Settings, HelpCircle, Sparkles, Bot } from "lucide-react";
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
    <div className="sticky top-16 hidden h-[calc(100vh-4rem)] w-16 flex-col items-center gap-4 bg-sidebar py-4 lg:flex">
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

function HeaderLogo() {
  const { toggleSidebar, open } = useSidebar();
  return (
    <div className="flex items-center gap-2">
      <button onClick={toggleSidebar}>
        <BookOpen className="h-8 w-8" />
      </button>
      <Link href="/dashboard">
        <span className="font-headline text-xl font-bold hidden lg:inline-block">
          Sahayak AI
        </span>
      </Link>
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
      
      if (profile && !profile.hasCompletedOnboarding && pathname !== '/onboarding') {
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

  const showLoader = isUserLoading || isProfileLoading || !user || !profile || (profile && !profile.hasCompletedOnboarding && pathname !== '/onboarding');

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
          <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between gap-4 bg-sidebar px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <HeaderLogo />
            </div>
            <div className="flex flex-1 justify-center">
              <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full appearance-none bg-card pl-8 shadow-none md:w-80 lg:w-[32rem]"
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
                <main className="flex-1 p-1 bg-sidebar">
                    <div className="h-full w-full overflow-auto rounded-3xl bg-card p-4 sm:p-6 m-2">
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
