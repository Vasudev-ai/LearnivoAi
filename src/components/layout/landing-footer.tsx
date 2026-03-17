"use client";

import Link from "next/link";
import { BookOpen, MessageCircle, GitBranch, Phone, MapPin, Mail as MailIcon } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t bg-card/30 pt-20 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-y-12 lg:gap-16 pb-20">
        <div className="col-span-12 lg:col-span-3">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-headline text-2xl font-bold tracking-tight">Learnivo AI</span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">Empowering Indian educators with the power of AI to transform classrooms across the nation.</p>
          <div className="mt-6 flex space-x-5">
              <Link href="#" className="hover:scale-110 transition-transform"><MessageCircle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" /></Link>
              <Link href="#" className="hover:scale-110 transition-transform"><GitBranch className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" /></Link>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-9 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">Support</h4>
            <ul className="space-y-4 text-muted-foreground text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/partner" className="hover:text-primary transition-colors">Partner with Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">Policy</h4>
            <ul className="space-y-4 text-muted-foreground text-sm">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">Discover</h4>
            <ul className="space-y-4 text-muted-foreground text-sm">
              <li><Link href="/#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>
          <div className="col-span-1 xs:col-span-1">
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-xs">Contact</h4>
            <ul className="space-y-4 text-muted-foreground text-sm">
              <li className="flex items-start gap-3 group">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span className="break-words pt-1.5 flex-1 min-w-0">+91 9719205268</span>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span className="pt-1.5 flex-1 min-w-0">Uttar Pradesh, India</span>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <MailIcon className="h-4 w-4 text-primary" />
                </div>
                <span className="break-all pt-1.5 flex-1 min-w-0">info@learnivo.app</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t py-12 text-center overflow-hidden">
        <div className="font-headline text-5xl sm:text-8xl md:text-9xl font-black tracking-[0.2em] uppercase text-foreground/[0.03] select-none whitespace-nowrap">
            Learnivo AI
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} Learnivo AI. All rights reserved.</p>
          <p className="flex items-center gap-1.5 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
            Built by <Link href="https://vasudev.online" target="_blank" className="font-bold text-foreground decoration-primary/30 underline decoration-2 underline-offset-4">Vasudev AI</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
