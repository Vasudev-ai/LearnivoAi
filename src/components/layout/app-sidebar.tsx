
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  DraftingCompass,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Library,
  Mail,
  Map,
  Notebook,
  Pencil,
  Scale,
  ScanLine,
  Settings,
  Layers,
  User,
  BookText,
  View,
  Calculator,
  Home,
  BookCopy,
  BarChart,
} from "lucide-react";

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  Sidebar,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUser } from "@/firebase";

const teacherMenuItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/library",
    icon: Library,
    label: "My Library",
  },
  {
    href: "/workspace",
    icon: Notebook,
    label: "My Workspace",
  },
  {
    href: "/lesson-planner",
    icon: DraftingCompass,
    label: "Lesson Planner",
  },
   {
    href: "/paper-digitizer",
    icon: ScanLine,
    label: "Paper Digitizer",
  },
  {
    href: "/visual-aids",
    icon: Layers,
    label: "Visual Aids",
  },
  {
    href: "/math-helper",
    icon: Calculator,
    label: "Math Helper",
  },
  {
    href: "/hyper-local-content",
    icon: Map,
    label: "Hyper-Local Content",
  },
   {
    href: "/story-generator",
    icon: BookText,
    label: "Story Generator",
  },
  {
    href: "/knowledge-base",
    icon: BrainCircuit,
    label: "Knowledge Base",
  },
  {
    href: "/parent-communication",
    icon: Mail,
    label: "Parent Mails",
  },
  {
    href: "/quiz-generator",
    icon: HelpCircle,
    label: "Quiz Generator",
  },
  {
    href: "/rubric-generator",
    icon: Scale,
    label: "Rubric Generator",
  },
  {
    href: "/debate-topic-generator",
    icon: GraduationCap,
    label: "Debate Topics",
  },
];

const studentMenuItems = [
    {
        href: "/student/dashboard",
        icon: Home,
        label: "Dashboard",
    },
    {
      href: "/library",
      icon: Library,
      label: "My Library",
    },
    {
      href: "/workspace",
      icon: Notebook,
      label: "My Workspace",
    },
    {
        href: "/student/assignments",
        icon: BookCopy,
        label: "Assignments",
    },
    {
        href: "/student/grades",
        icon: BarChart,
        label: "Grades",
    },
     {
        href: "/knowledge-base",
        icon: BrainCircuit,
        label: "Knowledge Base",
    },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { profile } = useUser();

  const menuItems = profile?.role === 'Student' ? studentMenuItems : teacherMenuItems;
  const homePath = profile?.role === 'Student' ? '/student/dashboard' : '/dashboard';

  return (
    <>
      <SidebarHeader className="h-20 flex items-center justify-center border-b border-white/5">
        <Link href={homePath} className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-[0_0_15px_hsl(var(--primary)/0.2)]">
            <BookOpen className="h-6 w-6" />
          </div>
          <span className="font-headline text-2xl font-bold tracking-tight group-data-[collapsible=icon]:hidden">
            Learnivo <span className="text-primary">AI</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarRail />
      <SidebarContent className="group/sidebar-content pt-4">
        <SidebarMenu className="group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
       <SidebarFooter className="mt-auto items-center pb-4" />
    </>
  );
}
