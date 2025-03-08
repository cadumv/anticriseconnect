import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, metadata?: { name?: string, phone?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to send custom emails
const sendCustomEmail = async (type: "signup" | "magiclink" | "recovery" | "invite", email: string, url: string) => {
  try {
    let data: Record<string, any> = {};
    
    switch (type) {
      case "signup":
        data = { confirmationURL: url };
        break;
      case "recovery":
        data = { recoveryURL: url };
        break;
      case "magiclink":
        data = { magicLinkURL: url };
        break;
      case "invite":
        data = { inviteURL: url };
        break;
    }
    
    const response = await supabase.functions.invoke("custom-auth-emails", {
      body: { type, email, data },
    });
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error sending custom ${type} email:`, error);
    throw error;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    resetPassword,
    deleteAccount,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
