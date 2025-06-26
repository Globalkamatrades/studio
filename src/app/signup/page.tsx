
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
    <svg role="img" viewBox="0 0 24 24" className="h-5 w-5 mr-2">
      <path
        fill="#4285F4"
        d="M22.045 12.158c0-.82-.073-1.614-.21-2.382H12v4.494h5.64c-.244 1.46-1.025 2.78-2.296 3.65v2.894h3.71c2.174-2.002 3.42-4.936 3.42-8.656Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.72 0 5.01-.893 6.68-2.42l-3.71-2.895c-.9.605-2.07.96-3.28.96-2.58 0-4.77-1.74-5.55-4.08H1.555v2.984C3.12 19.944 7.23 22 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.45 13.64C6.2 12.943 6.08 12.2 6.08 11.4s.12-1.543.45-2.24l-3.9-3.03C1.65 7.9 1 9.58 1 11.4c0 1.82.65 3.5 1.65 4.87l3.8-2.63Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.92c1.47 0 2.75.507 3.77 1.45l3.29-3.29C17.003 2.18 14.72.998 12 .998 7.23.998 3.12 3.055 1.55 6.15l3.9 3.03c.78-2.34 2.97-4.08 5.55-4.08Z"
      />
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
            <Form {...form}>
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
            </Form>
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

            <Button variant="outline" className="w-full bg-card text-card-foreground hover:bg-card/90" onClick={handleGoogleSignIn} disabled={anyPending}>
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
