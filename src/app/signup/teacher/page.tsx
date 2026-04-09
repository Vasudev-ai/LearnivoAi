
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Lock, Eye, EyeOff, Loader2, BookOpen, ArrowRight, Sparkles, Users, BarChart3 } from "lucide-react";
import { useAuth, useFirestore, setDocumentNonBlocking, useUser } from "@/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification, signInWithRedirect } from "firebase/auth";
import { doc } from "firebase/firestore";
import { Label } from "@/components/ui/label";
import { getDefaultUserProfile } from "@/lib/default-user-profile";

export default function TeacherSignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password) {
        toast({
            title: "Missing Details",
            description: "Please fill in your name, email, and password.",
            variant: "destructive",
        });
        return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await sendEmailVerification(user);

      const userProfileRef = doc(firestore, 'userProfiles', user.uid);
      const userProfileData = getDefaultUserProfile(
        user.email || email,
        fullName,
        'Teacher'
      );
      userProfileData.id = user.uid;
      setDocumentNonBlocking(userProfileRef, userProfileData, { merge: true });

      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account before you continue.",
        variant: "success",
        duration: 8000,
      });
      router.push("/onboarding");
    } catch (error: any) {
      console.error(error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email address is already in use.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "The password is too weak. Please use at least 6 characters.";
      }
      toast({
        title: "Sign Up Failed",
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
      const userProfileData = getDefaultUserProfile(
        user.email || '',
        user.displayName || 'Teacher User',
        'Teacher',
        user.photoURL || undefined
      );
      userProfileData.id = user.uid;
      setDocumentNonBlocking(userProfileRef, userProfileData, { merge: true });

      toast({
        title: "Signed In",
        description: "Welcome! Let's get you set up.",
        variant: "success",
      });
      router.push("/onboarding");
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

  const features = [
    { icon: Sparkles, text: "AI generates lesson plans in seconds" },
    { icon: Users, text: "Manage all your classes effortlessly" },
    { icon: BarChart3, text: "Track student progress with analytics" },
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

        {/* Grid overlay */}
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
                Start your journey
                <br />
                <span className="text-white/80">as an educator.</span>
              </h2>
              <p className="text-white/70 text-lg max-w-md leading-relaxed">
                Create your free account and access powerful AI tools — built for growth, precision, and real-time insight.
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
            No credit card required. Takes less than a minute.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12 bg-card relative overflow-y-auto">
        {/* Subtle pattern */}
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <Sparkles className="h-3 w-3" />
              Teacher Account
            </div>
            <h1 className="font-headline text-3xl font-bold text-foreground tracking-tight">
              Create your account
            </h1>
            <p className="text-muted-foreground mt-2 text-[15px]">
              Set up your educator profile to get started
            </p>
          </div>

          {/* Google Button */}
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
                Sign up with Google
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

          {/* Form */}
          <form className="space-y-5" onSubmit={handleEmailSignUp}>
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                Full name
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  className="h-12 pl-10 rounded-xl border-border/60 bg-card focus:bg-background transition-colors"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  id="email"
                  name="email"
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
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password (min 6 chars)"
                  required
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
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground/70 mt-3">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-foreground transition-colors">Terms</Link>
              {" "}and{" "}
              <Link href="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</Link>.
            </p>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
