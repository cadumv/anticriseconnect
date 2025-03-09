
import { createContext, ReactNode, useContext } from 'react';
import { AuthProvider as AuthProviderComponent } from '../features/auth/AuthProvider';
import { AuthContextType, AuthProviderProps } from '../features/auth/types';

export { type AuthContextType, type AuthProviderProps };

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  return <AuthProviderComponent>{children}</AuthProviderComponent>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
