'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { applyActionCode, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle, KeyRound } from 'lucide-react';
import Link from 'next/link';

type ActionState = 'loading' | 'success' | 'error' | 'reset-password';

function AuthActionContent() {
  const searchParams = useSearchParams();
  const auth = useAuth();

  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');

  const [state, setState] = useState<ActionState>('loading');
  const [message, setMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setState('error');
      setMessage('Invalid or missing action code. Please try again.');
      return;
    }

    const handleAction = async () => {
      try {
        switch (mode) {
          case 'verifyEmail':
            await applyActionCode(auth, oobCode);
            setState('success');
            setMessage('Your email has been verified successfully! You can now continue to the app.');
            break;

          case 'resetPassword':
            await verifyPasswordResetCode(auth, oobCode);
            setState('reset-password');
            break;

          default:
            setState('error');
            setMessage('Unknown action type. Please try again.');
        }
      } catch (error: any) {
        console.error('Auth action error:', error);
        setState('error');

        if (error.code === 'auth/expired-action-code') {
          setMessage('This link has expired. Please request a new one.');
        } else if (error.code === 'auth/invalid-action-code') {
          setMessage('This link is invalid or has already been used. Please request a new one.');
        } else if (error.code === 'auth/user-not-found') {
          setMessage('No user found for this action. Please try signing up again.');
        } else {
          setMessage(error.message || 'An unexpected error occurred. Please try again.');
        }
      }
    };

    handleAction();
  }, [mode, oobCode, auth]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPwd) {
      setMessage('Passwords do not match.');
      return;
    }
    if (!oobCode) return;

    setIsSubmitting(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setState('success');
      setMessage('Your password has been reset successfully! You can now sign in with your new password.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      setState('error');
      if (error.code === 'auth/expired-action-code') {
        setMessage('This link has expired. Please request a new password reset.');
      } else if (error.code === 'auth/weak-password') {
        setMessage('Password is too weak. Please use at least 6 characters.');
      } else {
        setMessage(error.message || 'Failed to reset password. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          {state === 'loading' && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
              <CardTitle className="font-headline text-2xl">Processing...</CardTitle>
              <CardDescription>Please wait while we verify your request.</CardDescription>
            </>
          )}

          {state === 'success' && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <CardTitle className="font-headline text-2xl text-green-600 dark:text-green-400">
                {mode === 'verifyEmail' ? 'Email Verified!' : 'Password Reset!'}
              </CardTitle>
              <CardDescription className="text-base mt-2">{message}</CardDescription>
            </>
          )}

          {state === 'error' && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <XCircle className="h-8 w-8" />
              </div>
              <CardTitle className="font-headline text-2xl text-red-600 dark:text-red-400">
                Something went wrong
              </CardTitle>
              <CardDescription className="text-base mt-2">{message}</CardDescription>
            </>
          )}

          {state === 'reset-password' && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <KeyRound className="h-8 w-8" />
              </div>
              <CardTitle className="font-headline text-2xl">Reset Password</CardTitle>
              <CardDescription>Enter your new password below.</CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent>
          {state === 'reset-password' && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              {message && (
                <p className="text-sm text-red-500 text-center">{message}</p>
              )}
              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setMessage(''); }}
                required
                minLength={6}
                className="h-11"
              />
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPwd}
                onChange={(e) => { setConfirmPwd(e.target.value); setMessage(''); }}
                required
                minLength={6}
                className="h-11"
              />
              <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Reset Password'}
              </Button>
            </form>
          )}

          {(state === 'success' || state === 'error') && (
            <div className="flex flex-col gap-3">
              {mode === 'verifyEmail' && state === 'success' && (
                <Button asChild className="w-full h-11">
                  <Link href="/onboarding">Continue to App</Link>
                </Button>
              )}
              {state === 'success' && mode === 'resetPassword' && (
                <Button asChild className="w-full h-11">
                  <Link href="/login">Go to Sign In</Link>
                </Button>
              )}
              {state === 'error' && (
                <Button asChild variant="outline" className="w-full h-11">
                  <Link href="/login">Back to Sign In</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthActionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      }
    >
      <AuthActionContent />
    </Suspense>
  );
}
