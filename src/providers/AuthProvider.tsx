import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { AuthContext, AuthProviderProps } from '@/contexts/AuthContext';
import { sendCustomEmail } from '@/utils/authEmailUtils';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const projectName = "Conecta Engenharia";

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: { name?: string, phone?: string }) => {
    setLoading(true);
    try {
      const redirectURL = `${window.location.origin}/auth/confirm`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: redirectURL
        }
      });
      
      if (error) throw error;
      
      if (data?.user && !data.user.confirmed_at) {
        try {
          const token = "token";
          const confirmationURL = `${redirectURL}?token=${token}`;
          
          await sendCustomEmail("signup", email, confirmationURL);
          
          toast({
            title: "Cadastro realizado com sucesso!",
            description: "Um email de confirmação personalizado foi enviado para o seu endereço.",
          });
        } catch (emailError: any) {
          console.error("Custom email failed, but signup was successful:", emailError);
          toast({
            title: "Cadastro realizado com sucesso!",
            description: "Um email de confirmação foi enviado para o seu endereço (usando sistema padrão).",
          });
        }
      } else {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Um email de confirmação foi enviado para o seu endereço.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

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
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    setLoading(true);
    try {
      console.log("Starting Google OAuth sign-in, redirect URL:", `${window.location.origin}/profile`);
      
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile`,
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
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectURL = `${window.location.origin}/reset-password`;
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectURL,
      });
      
      if (error) throw error;
      
      try {
        const resetURL = `${redirectURL}?token=placeholder`;
        await sendCustomEmail("recovery", email, resetURL);
        
        toast({
          title: "Email personalizado enviado com sucesso",
          description: "Verifique sua caixa de entrada para redefinir sua senha.",
        });
      } catch (emailError: any) {
        console.error("Custom email failed, but password reset was initiated:", emailError);
        toast({
          title: "Email enviado com sucesso",
          description: "Verifique sua caixa de entrada para redefinir sua senha (usando sistema padrão).",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao enviar email",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Logout realizado com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteAccount = async () => {
    try {
      const { error } = await supabase.rpc('delete_user');
      
      if (error) throw error;
      toast({
        title: "Conta excluída com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir conta",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const contextValue = {
    user,
    session,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    deleteAccount,
    loading,
    projectName
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
