"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSession } from "./session-provider";

interface PaymentRequiredProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Client Component para verificar acesso pago.
 * Use isso para proteger conteúdo em Client Components.
 *
 * Para Server Components, use `requireVideoAccess()` de `@/lib/access`
 */
export function PaymentRequired({
  children,
  redirectTo = "/purchase",
}: PaymentRequiredProps) {
  const router = useRouter();
  const { hasAccess, isLoading } = useSession();

  useEffect(() => {
    // Only redirect if we have a definitive result from the server
    if (!isLoading && !hasAccess) {
      router.push(redirectTo);
    }
  }, [hasAccess, isLoading, router, redirectTo]);

  // Show nothing while we're checking payment status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // If no access, show nothing (will redirect)
  if (!hasAccess) {
    return null;
  }

  // User has access, show content
  return <>{children}</>;
}
