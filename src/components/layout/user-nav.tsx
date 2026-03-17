
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settings-store";
import {
  User,
  CreditCard,
  Settings,
  Keyboard,
  LogOut,
  LifeBuoy,
  ChevronsUpDown,
  Sun,
  Moon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import * as React from "react";
import { useEffect, useState } from "react";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useSidebar, SidebarContext } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";

export function UserNav() {
  const { profile } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const sidebarContext = React.useContext(SidebarContext);
  const isCollapsed = sidebarContext ? sidebarContext.state === "collapsed" : false;
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/');
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
            variant="ghost" 
            className="h-10 w-10 rounded-full p-0 transition-all hover:bg-white/5 border border-white/10 shrink-0"
        >
          <Avatar className="h-full w-full rounded-full overflow-hidden">
            {profile?.profilePicture && (
              <AvatarImage
                src={profile.profilePicture}
                alt={profile.name || "User avatar"}
              />
            )}
            <AvatarFallback className="rounded-full bg-primary/10 text-primary">
              {profile?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {profile?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <DropdownMenuShortcut>Ctrl+P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <DropdownMenuShortcut>Ctrl+S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? (
            <Sun className="mr-2 h-4 w-4" />
          ) : (
            <Moon className="mr-2 h-4 w-4" />
          )}
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/support">
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>Ctrl+Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
