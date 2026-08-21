import React, { createContext, useContext, useMemo, useState } from "react";

import { AdminAccount, AdminAuthSession } from "@/api/admin";
import { AuthSession, Trainee } from "@/api/auth";
import { USE_MOCK_DATA } from "@/config/dataSource";
import { DEMO_AUTH_SESSION } from "@/data/mockData";

// On mock data, start already "logged in" as the demo trainee so screens
// like /session show real values without requiring a register/login round-trip.
const INITIAL_SESSION: AuthSession | null = USE_MOCK_DATA
  ? (DEMO_AUTH_SESSION as AuthSession)
  : null;

type AuthContextValue = {
  trainee: Trainee | null;
  token: string | null;
  isAuthenticated: boolean;
  setSession: (session: AuthSession) => void;
  logout: () => void;

  admin: AdminAccount | null;
  adminToken: string | null;
  isAdminAuthenticated: boolean;
  setAdminSession: (session: AdminAuthSession) => void;
  adminLogout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(INITIAL_SESSION);
  const [adminSession, setAdminSessionState] = useState<AdminAuthSession | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      trainee: session?.trainee ?? null,
      token: session?.access_token ?? null,
      isAuthenticated: !!session,
      setSession: setSessionState,
      logout: () => setSessionState(null),

      admin: adminSession?.admin ?? null,
      adminToken: adminSession?.access_token ?? null,
      isAdminAuthenticated: !!adminSession,
      setAdminSession: setAdminSessionState,
      adminLogout: () => setAdminSessionState(null),
    }),
    [session, adminSession]
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
