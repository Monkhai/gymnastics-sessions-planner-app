import { supabase } from '@/config/initSupabase';
import { Session, User } from '@supabase/supabase-js';
import React, { PropsWithChildren, useContext, useEffect, useState } from 'react';
import { createContext } from 'react';

type AuthProps = {
  user: User | null;
  session: Session | null;
  initialized?: boolean;
  signOut: () => void;
};

export const AuthContext = createContext<Partial<AuthProps>>({});

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
      setSession(session);
      setUser(session ? session.user : null);
      setInitialized(true);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const signOut = () => {
    supabase.auth.signOut();
  };

  const contextValue = {
    user,
    session,
    initialized,
    signOut,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
