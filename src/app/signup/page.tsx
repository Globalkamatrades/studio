"use client";

import type { NextPage } from 'next';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UserPlus, Loader2 } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // path of error
});

type FormData = z.infer<typeof formSchema>;

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" className="h-4 w-4 mr-2">
        <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.27 1.44-1.14 3.73-4.01 3.73-2.43 0-4.4-2.02-4.4-4.54s1.97-4.54 4.4-4.54c1.35 0 2.33.58 2.86 1.06l2.28-2.28C17.13 6.1 14.91 5 12.48 5c-3.73 0-6.75 3.02-6.75 6.75s3.02 6.75 6.75 6.75c3.36 0 5.96-2.28 5.96-6.12 0-.45-.05-.9-.12-1.34H12.48z"></path>
    </svg>
);


const SignupPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: FormData) => {
    setError(null);
    startTransition(async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await sendEmailVerification(userCredential.user);

        toast({
          title: "Account Created!",
          description: "A verification email has been sent. Please check your inbox to complete registration.",
          variant: "success",
        });
        router.push('/login');
      } catch (err: any) {
        let errorMessage = "An unknown error occurred.";
        switch (err.code) {
          case 'auth/email-already-in-use':
            errorMessage = "This email address is already in use by another account.";
            break;
          case 'auth/weak-password':
            errorMessage = "The password is too weak. Please use a stronger password.";
            break;
          default:
            errorMessage = "Failed to create an account. Please try again.";
            break;
        }
        setError(errorMessage);
        toast({
            title: "Sign Up Failed",
            description: errorMessage,
            variant: "destructive",
        });
      }
    });
  };

  const handleGoogleSignIn = () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    startGoogleTransition(async () => {
      try {
        await signInWithPopup(auth, provider);
        toast({
          title: "Sign-in Successful!",
          description: "Welcome to your dashboard.",
          variant: "success",
        });
        router.push('/dashboard');
      } catch (err: any) {
        let errorMessage = "An unknown error occurred with Google Sign-In.";
        if (err.code === 'auth/popup-closed-by-user') {
          errorMessage = "Google Sign-In was cancelled.";
        } else if (err.code === 'auth/account-exists-with-different-credential') {
          errorMessage = "An account already exists with this email address. Please sign in with the original method.";
        }
        setError(errorMessage);
        toast({
          title: "Google Sign-In Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    });
  };

  const anyPending = isPending || isGooglePending;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl flex items-center justify-center gap-2"><UserPlus size={28} /> Create Account</CardTitle>
            <CardDescription>Join the Ecoho Gold community.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <Alert variant="destructive">
                      <AlertTitle>Sign Up Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} disabled={anyPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} disabled={anyPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} disabled={anyPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={anyPending}>
                  {isPending ? <Loader2 className="animate-spin" /> : 'Create Account'}
                </Button>
              </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or sign up with
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={anyPending}>
              {isGooglePending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Sign up with Google
            </Button>
            
            <p className="text-sm text-muted-foreground text-center mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default SignupPage;
