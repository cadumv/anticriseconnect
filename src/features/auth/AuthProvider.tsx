
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContext } from '@/hooks/useAuth';
import { AuthProviderProps } from './types';
import { useSignIn } from './useSignIn';
import { useSignUp } from './useSignUp';
import { useAccountManagement } from './useAccountManagement';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const signInHook = useSignIn();
  const signUpHook = useSignUp();
  const accountManagementHook = useAccountManagement();

  const projectName = "Anticrise connect";

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

  const contextValue = {
    user,
    session,
    signUp: signUpHook.signUp,
    signIn: signInHook.signIn,
    signInWithGoogle: signInHook.signInWithGoogle,
    signOut: accountManagementHook.signOut,
    resetPassword: accountManagementHook.resetPassword,
    deleteAccount: accountManagementHook.deleteAccount,
    loading: loading || signInHook.loading || signUpHook.loading || accountManagementHook.loading,
    projectName
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
