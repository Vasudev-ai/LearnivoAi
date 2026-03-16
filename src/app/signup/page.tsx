
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignupPage() {
  const router = useRouter();
  
  // Redirect to teacher signup by default if role is not specified
  useEffect(() => {
    router.replace("/signup/teacher");
  }, [router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <p>Redirecting...</p>
    </div>
  );
}
