
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

export function useSignIn() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Specifically handle email not confirmed error
        if (error.message.includes("Email not confirmed")) {
          throw new Error("Email not confirmed");
        }
        throw error;
      }

      if (data?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        }
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta.",
        });
        
        // Redirect to the index page instead of profile
        navigate('/');
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
      throw error; // Rethrow so the Login component can handle specific errors
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    setLoading(true);
    try {
      console.log("Starting Google OAuth sign-in, redirect URL:", `${window.location.origin}/`);
      
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        console.error("Google sign-in error:", error);
        throw error;
      }
      
      console.log("Google sign-in successful, data:", data);
      return true;
    } catch (error: any) {
      console.error("Google sign-in exception:", error);
      toast({
        title: "Erro no login com Google",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signInWithGoogle,
    loading,
    setLoading
  };
}
