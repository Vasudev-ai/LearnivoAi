
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail, Lock, Loader2, BookOpen, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { useAuth, useFirestore, setDocumentNonBlocking, useUser } from "@/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, signInWithRedirect } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { doc } from "firebase/firestore";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const { user, profile, isUserLoading, isProfileLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && !isProfileLoading && user) {
        if (profile?.hasCompletedOnboarding) {
            const dashboardPath = profile?.role === 'Student' ? '/student/dashboard' : '/dashboard';
            router.push(dashboardPath);
        } else {
            router.push('/onboarding');
        }
    }
  }, [user, profile, isUserLoading, isProfileLoading, router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const signedInUser = credential.user;

      const userProfileRef = doc(firestore, 'userProfiles', signedInUser.uid);
      setDocumentNonBlocking(userProfileRef, {
        id: signedInUser.uid,
        email: signedInUser.email,
        name: signedInUser.displayName || signedInUser.email || 'Teacher',
      }, { merge: true });

      toast({
        title: "Signed In",
        description: "Welcome back!",
        variant: "success",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        errorMessage = "Invalid credentials. Please check your email and password.";
      }
      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userProfileRef = doc(firestore, 'userProfiles', user.uid);
      setDocumentNonBlocking(userProfileRef, {
        id: user.uid,
        email: user.email,
        name: user.displayName,
        ...(user.photoURL ? { profilePicture: user.photoURL } : {}),
      }, { merge: true });

      toast({
        title: "Signed In",
        description: "Welcome!",
        variant: "success",
      });
      router.push("/dashboard");
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        console.log("Popup closed, falling back to redirect.");
        await signInWithRedirect(auth, provider);
      } else {
        console.error("Google Sign-In Error:", error);
        toast({
          title: "Sign In Failed",
          description: error.message || "Could not sign in with Google. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your inbox (and spam folder) for instructions to reset your password.",
        variant: "success",
      });
      setIsForgotPasswordOpen(false);
      setResetEmail("");
    } catch (error: any) {
      console.error(error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
        errorMessage = "No user found with this email address.";
      }
      toast({
        title: "Password Reset Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const features = [
    { icon: Sparkles, text: "AI-Powered Lesson Plans" },
    { icon: Shield, text: "Secure & Private Data" },
    { icon: Zap, text: "Instant Student Insights" },
  ];

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-3 sm:p-4 md:p-6">
      <div className="w-full h-[calc(100vh-1.5rem)] sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] flex rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/30 border border-border/40 bg-card">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-[48%] relative auth-brand-panel overflow-hidden rounded-l-2xl sm:rounded-l-3xl">
        {/* Floating orbs */}
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`
        }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer z-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="font-headline text-xl font-bold tracking-tight text-white">
              Learnivo AI
            </span>
          </Link>

          {/* Main content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="font-headline text-4xl xl:text-5xl font-bold text-white leading-tight">
                Welcome back to your
                <br />
                <span className="text-white/80">teaching studio.</span>
              </h2>
              <p className="text-white/70 text-lg max-w-md leading-relaxed">
                Continue building brilliant lessons, tracking progress, and empowering every student with AI.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-col gap-3">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 w-fit transition-all hover:bg-white/15"
                >
                  <f.icon className="h-4 w-4 text-white/90" />
                  <span className="text-sm font-medium text-white/90">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Learnivo AI. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12 bg-card relative overflow-y-auto">
        {/* Subtle bg pattern */}
        <div className="absolute inset-0 bg-dot-pattern opacity-50" />
        
        <div className="w-full max-w-[440px] relative z-10 auth-form-enter">
          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2.5 mb-10 hover:opacity-90 transition-opacity cursor-pointer z-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="h-4.5 w-4.5 text-primary" />
            </div>
            <span className="font-headline text-lg font-bold tracking-tight text-foreground">
              Learnivo AI
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-headline text-3xl font-bold text-foreground tracking-tight">
              Sign in to your account
            </h1>
            <p className="text-muted-foreground mt-2 text-[15px]">
              Enter your credentials below to continue
            </p>
          </div>

          {/* Google Button - top for easy access */}
          <Button
            variant="outline"
            className="w-full h-12 text-sm font-medium border-border/60 bg-card hover:bg-muted/50 transition-all duration-200 rounded-xl shadow-sm"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
              <>
                <svg className="mr-2.5 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground/70 font-medium tracking-wider">or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form className="space-y-5" onSubmit={handleEmailSignIn}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="h-12 pl-10 rounded-xl border-border/60 bg-card focus:bg-background transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
                  <DialogTrigger asChild>
                    <button type="button" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                      Forgot password?
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-headline text-2xl">Reset Password</DialogTitle>
                      <DialogDescription>
                        Enter your email address and we&apos;ll send you a link to reset your password.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePasswordReset}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="reset-email" className="text-right">
                            Email
                          </Label>
                          <Input
                            id="reset-email"
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="col-span-3"
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isResetting}>
                          {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Send Reset Link
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-10 pr-11 rounded-xl border-border/60 bg-card focus:bg-background transition-colors"
                />
                {password.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-semibold rounded-xl text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 group"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/signup/teacher" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
