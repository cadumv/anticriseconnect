
import { User, Session } from '@supabase/supabase-js';
import { ReactNode } from 'react';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, metadata?: { name?: string, phone?: string, referrerId?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  loading: boolean;
  projectName: string;
}

export interface AuthProviderProps {
  children: ReactNode;
}
