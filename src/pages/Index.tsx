
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { JournalPrompt } from "@/components/journal/JournalPrompt";
import { ACCESS_CODE } from "@/constants/auth";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

// Updated type definition for accessCode to allow empty string
const accessCodeSchema = z.object({
  accessCode: z.string().refine(code => code === ACCESS_CODE || code === "", {
    message: "Invalid access code"
  })
});

type AuthFormValues = z.infer<typeof authSchema>;
type AccessCodeFormValues = z.infer<typeof accessCodeSchema>;

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [accessCodeVerified, setAccessCodeVerified] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const accessCodeForm = useForm<AccessCodeFormValues>({
    resolver: zodResolver(accessCodeSchema),
    defaultValues: {
      accessCode: ""
    }
  });

  const forgotPasswordForm = useForm({
    resolver: zodResolver(z.object({
      email: z.string().email("Please enter a valid email address")
    })),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              email_confirmed: true
            }
          }
        });
        if (error) throw error;

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password
        });
        if (signInError) throw signInError;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password
        });
        if (error) throw error;
      }
    } catch (error: any) {
      console.log("Authentication error:", error.message);
      toast({
        title: "Authentication error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (values: { email: string; }) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/`
      });
      if (error) throw error;
      toast({
        title: "Password reset email sent",
        description: "Check your email for a password reset link"
      });

      setIsForgotPassword(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAccessCode = (values: AccessCodeFormValues) => {
    if (values.accessCode === ACCESS_CODE) {
      setAccessCodeVerified(true);
      toast({
        title: "Access code verified",
        description: "You can now sign up for an account",
      });
    } else {
      toast({
        title: "Invalid access code",
        description: "Please enter a valid access code",
        variant: "destructive"
      });
    }
  };

  if (user) {
    return <>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css" />
        <main className="flex flex-col items-center gap-4 min-h-screen w-full bg-[#F3EFEC] px-0 py-0">
          <JournalPrompt />
        </main>
      </>;
  }

  return <main className="flex justify-center items-center min-h-screen bg-[#F3EFEC] p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center mt-4 mb-16 py-0">
            <img alt="DayNote Logo" src="/lovable-uploads/ba89942c-401e-44ea-8dc1-91b26d2dc38a.png" className="h-16" />
          </div>
        </div>

        {!isForgotPassword ? (
          isSignUp ? (
            accessCodeVerified ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Sign Up"}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...accessCodeForm}>
                <form onSubmit={accessCodeForm.handleSubmit(verifyAccessCode)} className="space-y-4">
                  <FormField control={accessCodeForm.control} name="accessCode" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter access code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Verify Access Code"}
                  </Button>
                </form>
              </Form>
            )
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Sign In"}
                </Button>
              </form>
            </Form>
          )
        ) : (
          <Form {...forgotPasswordForm}>
            <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
              <FormField control={forgotPasswordForm.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Send Reset Link"}
              </Button>
            </form>
          </Form>
        )}

        <div className="text-center pt-4">
          {!isForgotPassword ? (
            <>
              <button onClick={() => {
                setIsSignUp(!isSignUp);
                if (!isSignUp) {
                  setAccessCodeVerified(false);
                  accessCodeForm.reset();
                }
              }} 
              className="text-sm hover:underline mb-2 block w-full text-gray-500">
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
              <button onClick={() => setIsForgotPassword(true)} 
                className="text-sm text-gray-500 hover:text-gray-700 hover:underline mt-2 block w-full">
                Forgot password?
              </button>
            </> 
          ) : (
            <button onClick={() => setIsForgotPassword(false)} 
              className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </main>;
};

export default Index;
