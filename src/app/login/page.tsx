
"use client";

import { useState, useRef, useEffect, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";
import { useAuth, useFirestore, setDocumentNonBlocking, useUser } from "@/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, signInWithRedirect } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { doc } from "firebase/firestore";

const SpotlightCard = ({ children, className, ...props }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    }
  };

  return (
    <Card
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn("spotlight-card", className)}
      {...props}
    >
      {children}
    </Card>
  );
};


export default function LoginPage() {
  const authGraphic = PlaceHolderImages.find((img) => img.id === "auth-graphic");
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

      // Ensure profile doc exists (to avoid infinite loader if missing)
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
      // First, try to sign in with a popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Ensure user profile exists on login
      const userProfileRef = doc(firestore, 'userProfiles', user.uid);
      setDocumentNonBlocking(userProfileRef, {
        id: user.uid,
        email: user.email,
        name: user.displayName,
        profilePicture: user.photoURL
      }, { merge: true });

      toast({
        title: "Signed In",
        description: "Welcome!",
        variant: "success",
      });
      router.push("/dashboard");
    } catch (error: any) {
      // Handle popup-related errors by falling back to redirect
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


  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-4 sm:p-8">
      <SpotlightCard className="w-full max-w-4xl mx-auto rounded-2xl bg-card shadow-2xl grid md:grid-cols-2 overflow-hidden">
        
        {/* Left Side: Form */}
        <div className="px-8 sm:px-12 py-12">
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="font-headline text-3xl font-bold text-foreground">Sign In</h1>
              <p className="text-muted-foreground mt-2">Enter your credentials to access your account.</p>
            </div>

            <form className="space-y-4" onSubmit={handleEmailSignIn}>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="h-11 bg-input pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-input pl-10 pr-10"
                  />
                  {password.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  )}
                </div>
                 <div className="flex justify-end">
                    <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
                      <DialogTrigger asChild>
                        <button type="button" className="text-sm font-medium text-muted-foreground hover:text-primary">
                            Forgot password?
                        </button>
                      </DialogTrigger>
                       <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="font-headline text-2xl">Reset Password</DialogTitle>
                            <DialogDescription>
                              Enter your email address and we'll send you a link to reset your password.
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
              </div>

              <Button
                type="submit"
                className="w-full !mt-8 h-11 font-semibold"
                disabled={isLoading}
              >
                 {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or continue with</span></div>
            </div>

            <Button variant="outline" className="w-full h-11" onClick={handleGoogleSignIn} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :
                 <>
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-72.2 72.2C322 104 288.1 88 248 88c-79.5 0-144 64.5-144 144s64.5 144 144 144c88.8 0 119.2-66.2 122.8-99.1H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path>
                    </svg>
                    Sign In with Google
                 </>
                }
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup/teacher" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Image and Branding */}
        <div className="hidden md:flex relative items-center justify-center p-8 bg-muted/30 rounded-r-2xl">
          {authGraphic && (
            <div className="relative w-full h-full">
              <Image
                src={authGraphic.imageUrl}
                alt={authGraphic.description}
                fill
                className="object-cover"
                data-ai-hint={authGraphic.imageHint}
              />
            </div>
          )}
        </div>
      </SpotlightCard>
    </div>
  );
}
