
import { useToast } from "@/hooks/use-toast";

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = (context: string, error: unknown) => {
    console.error(`Error in ${context}:`, error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    toast({
      title: `${context} Error`,
      description: errorMessage,
      variant: "destructive",
    });
  };

  return { handleError };
};
