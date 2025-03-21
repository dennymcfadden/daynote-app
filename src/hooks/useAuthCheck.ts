
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useAuthCheck = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkAuth = (action: string): boolean => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: `Please sign in to ${action}`,
        variant: "destructive",
      });
      navigate("/auth");
      return false;
    }
    return true;
  };

  return { checkAuth, isAuthenticated: !!user };
};
