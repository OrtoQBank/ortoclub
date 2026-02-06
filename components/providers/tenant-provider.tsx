"use client";

import { createContext, ReactNode, useContext } from "react";

interface TenantContextType {
  tenantDisplayName: string;
  tenantLogoUrl: string;
}

const TenantContext = createContext<TenantContextType>({
  tenantDisplayName: "Ortoclub",
  tenantLogoUrl: "/logo.webp",
});

interface TenantProviderProps {
  children: ReactNode;
  displayName?: string;
  logoUrl?: string;
}

export function TenantProvider({
  children,
  displayName = "Ortoclub",
  logoUrl = "/logo.webp",
}: TenantProviderProps) {
  return (
    <TenantContext.Provider
      value={{ tenantDisplayName: displayName, tenantLogoUrl: logoUrl }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
