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
import { Header } from "@/components/journal/Header";
import { useAuth } from "@/hooks/useAuth";
import { JournalPrompt } from "@/components/journal/JournalPrompt";
import { JournalEntries } from "@/components/journal/JournalEntries";
const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
type AuthFormValues = z.infer<typeof authSchema>;
const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: ""
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
        // Using signInWithPassword directly for new users
        // This skips email verification completely
        const {
          error
        } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              email_confirmed: true // Force email to be confirmed
            }
          }
        });
        if (error) throw error;

        // Sign in immediately after signup
        const {
          error: signInError
        } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password
        });
        if (signInError) throw signInError;
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword({
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
  const handleForgotPassword = async (values: {
    email: string;
  }) => {
    setIsLoading(true);
    try {
      const {
        error
      } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/`
      });
      if (error) throw error;
      toast({
        title: "Password reset email sent",
        description: "Check your email for a password reset link"
      });

      // Return to login form after successful password reset request
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
  if (user) {
    return <>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css" />
        <main className="flex flex-col items-center gap-4 min-h-screen w-full bg-[#F3EFEC] px-0 py-6">
          <Header />
          <JournalPrompt />
          <JournalEntries />
        </main>
      </>;
  }
  return <main className="flex justify-center items-center min-h-screen bg-[#F3EFEC] p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center mt-4 mb-16 py-0">
            <img src="/lovable-uploads/0f6d6781-8b08-4247-b881-2f68e9e04791.png" alt="DayNote Logo" className="h-12" />
          </div>
        </div>

        {!isForgotPassword ?
      // Regular login/signup form
      <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="email" render={({
            field
          }) => <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              <FormField control={form.control} name="password" render={({
            field
          }) => <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
              </Button>
            </form>
          </Form> :
      // Forgot password form
      <Form {...forgotPasswordForm}>
            <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
              <FormField control={forgotPasswordForm.control} name="email" render={({
            field
          }) => <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Send Reset Link"}
              </Button>
            </form>
          </Form>}

        <div className="text-center pt-4">
          {!isForgotPassword ? <>
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm hover:underline mb-2 block w-full text-gray-500">
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
              <button onClick={() => setIsForgotPassword(true)} className="text-sm text-gray-500 hover:text-gray-700 hover:underline mt-2 block w-full">
                Forgot password?
              </button>
            </> : <button onClick={() => setIsForgotPassword(false)} className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
              Back to sign in
            </button>}
        </div>
      </div>
    </main>;
};
export default Index;