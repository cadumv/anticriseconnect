
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { sendCustomEmail } from '@/utils/authEmailUtils';

export function useAccountManagement() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      setLoading(true);
      console.log("Signing out...");
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during sign out:", error);
        throw error;
      }
      
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado do sistema."
      });
      
      // Always navigate to login page, even if there was an error
      navigate('/login', { replace: true });
    } catch (error: any) {
      console.error("Exception during sign out:", error);
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive",
      });
      
      // Still navigate to login page even on error
      navigate('/login', { replace: true });
    } finally {
      setLoading(false);
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

  return {
    resetPassword,
    signOut,
    deleteAccount,
    loading,
    setLoading
  };
}
