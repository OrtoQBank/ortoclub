"use client";

import { useQuery } from "convex/react";
import { createContext, ReactNode, useContext } from "react";

import { api } from "@/convex/_generated/api";

interface SessionContextType {
  /** Is user an admin */
  isAdmin: boolean;
  /** User's role (admin, user) */
  role: string | null;
  /** Does user have active paid access */
  hasAccess: boolean;
  isLoading: boolean;
}

interface SessionProviderProps {
  children: ReactNode;
}

const SessionContext = createContext<SessionContextType>({
  isAdmin: false,
  role: null,
  hasAccess: false,
  isLoading: true,
});

export function SessionProvider({ children }: SessionProviderProps) {
  const user = useQuery(api.users.current);

  const role = user?.role ?? null;
  const isAdmin = role === "admin";
  const hasAccess = user?.paid === true;
  const isLoading = user === undefined;

  const sessionValue: SessionContextType = {
    isAdmin,
    role,
    hasAccess,
    isLoading,
  };

  return (
    <SessionContext.Provider value={sessionValue}>
      {children}
    </SessionContext.Provider>
  );
}

// Custom hook to use session data
export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

// Backwards compatibility alias
export function useSessionRole() {
  const { isAdmin, role } = useSession();
  return { isAdmin, userRole: role };
}
