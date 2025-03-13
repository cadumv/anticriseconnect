
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { sendCustomEmail } from '@/utils/authEmailUtils';

type UserMetadata = {
  name?: string;
  phone?: string;
  referrerId?: string;
};

export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const signUp = async (email: string, password: string, metadata?: UserMetadata) => {
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
        navigate('/login');
      } else {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Um email de confirmação foi enviado para o seu endereço.",
        });
        navigate('/login');
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

  return {
    signUp,
    loading,
    setLoading
  };
}
