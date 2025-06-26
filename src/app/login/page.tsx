
"use client";

import type { NextPage } from 'next';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LogIn, Loader2 } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type FormData = z.infer<typeof formSchema>;

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: FormData) => {
    setError(null);
    startTransition(async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
        
        if (!userCredential.user.emailVerified) {
          setError("Please verify your email address before logging in. Check your inbox for a verification link.");
          toast({
            title: "Email Not Verified",
            description: "A new verification email can be sent if needed.",
            variant: "destructive",
          });
          // Optionally, add logic here to resend verification email
          return;
        }

        toast({
          title: "Login Successful!",
          description: "Welcome back to your dashboard.",
          variant: "success",
        });
        router.push('/dashboard');
      } catch (err: any) {
        let errorMessage = "An unknown error occurred.";
        switch (err.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                errorMessage = "Invalid email or password. Please try again.";
                break;
            case 'auth/too-many-requests':
                errorMessage = "Too many login attempts. Please try again later.";
                break;
            default:
                errorMessage = "Failed to log in. Please check your credentials.";
                break;
        }
        setError(errorMessage);
        toast({
            title: "Login Failed",
            description: errorMessage,
            variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl flex items-center justify-center gap-2"><LogIn size={28} /> Member Login</CardTitle>
            <CardDescription>Access your Ecoho Gold account and dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <Alert variant="destructive">
                      <AlertTitle>Login Error</AlertTitle>
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
                        <Input type="email" placeholder="you@example.com" {...field} disabled={isPending} />
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
                        <Input type="password" placeholder="••••••••" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isPending}>
                  {isPending ? <Loader2 className="animate-spin" /> : 'Login'}
                </Button>
              </form>
            </Form>
            <p className="text-sm text-muted-foreground text-center mt-6">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
