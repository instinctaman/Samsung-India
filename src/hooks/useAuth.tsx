import React, { createContext, useContext, useMemo, useState } from "react";

import { AuthSession, Trainee } from "@/api/auth";

type AuthContextValue = {
  trainee: Trainee | null;
  token: string | null;
  isAuthenticated: boolean;
  setSession: (session: AuthSession) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      trainee: session?.trainee ?? null,
      token: session?.access_token ?? null,
      isAuthenticated: !!session,
      setSession: setSessionState,
      logout: () => setSessionState(null),
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
