
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ACCESS_CODE } from "@/constants/auth";

const accessCodeSchema = z.object({
  accessCode: z.string().refine(code => code === ACCESS_CODE || code === "", {
    message: "Invalid access code"
  })
});

type AccessCodeFormValues = z.infer<typeof accessCodeSchema>;

interface AccessCodeFormProps {
  onVerified: () => void;
}

export const AccessCodeForm = ({ onVerified }: AccessCodeFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<AccessCodeFormValues>({
    resolver: zodResolver(accessCodeSchema),
    defaultValues: {
      accessCode: ""
    },
    mode: "onChange"
  });

  const onSubmit = (values: AccessCodeFormValues) => {
    console.log("Verifying access code:", values.accessCode);
    setIsLoading(true);
    
    try {
      if (values.accessCode === ACCESS_CODE) {
        // Success toast removed
        onVerified();
      } else {
        toast({
          title: "Invalid access code",
          description: "Please enter a valid access code",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField 
          control={form.control} 
          name="accessCode" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access Code</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter access code" 
                  {...field} 
                  onChange={(e) => {
                    console.log("Input value:", e.target.value);
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify Access Code"}
        </Button>
      </form>
    </Form>
  );
};
