
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type AuthFormValues = z.infer<typeof authSchema>;

interface SignInFormProps {
  onToggleMode: () => void;
  onForgotPassword: () => void;
}

export const SignInForm = ({ onToggleMode, onForgotPassword }: SignInFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
      });
      
      if (error) throw error;
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

  return (
    <>
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

      <div className="text-center pt-4">
        <button 
          onClick={onToggleMode} 
          className="text-sm hover:underline mb-2 block w-full text-gray-500"
        >
          Don't have an account? Sign up
        </button>
        <button 
          onClick={onForgotPassword} 
          className="text-sm text-gray-500 hover:text-gray-700 hover:underline mt-2 block w-full"
        >
          Forgot password?
        </button>
      </div>
    </>
  );
};
