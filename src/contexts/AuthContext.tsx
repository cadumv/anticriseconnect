
import { createContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, metadata?: { name?: string, phone?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export type AuthProviderProps = {
  children: ReactNode;
};
