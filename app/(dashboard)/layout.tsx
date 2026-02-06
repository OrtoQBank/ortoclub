"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import {
  SessionProvider,
  useSession,
} from "@/components/providers/session-provider";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { MobileBottomNav } from "@/components/nav/mobile-bottom-nav";

import { api } from "@/convex/_generated/api";

// Inner component that uses useSidebar - must be inside SidebarProvider
function SidebarContent({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();

  return (
    <>
      {/* Sidebar visible only on md and larger screens */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      <main className="via-brand-blue/10 min-h-screen w-full bg-gradient-to-b from-slate-50 to-indigo-100">
        {/* Sidebar trigger - follows sidebar position */}
        <SidebarTrigger
          className={`hidden md:inline-flex fixed top-2 h-6 w-6 text-black hover:text-black hover:bg-gray-100 transition-[left] duration-200 ease-linear z-10 ${state === "collapsed"
              ? "left-[calc(var(--sidebar-width-icon)+0.25rem)]"
              : "left-[calc(var(--sidebar-width)+0.25rem)]"
            }`}
        />

        {/* Add padding-bottom for mobile nav, remove for desktop */}
        <div className="mx-auto">{children}</div>
      </main>

      {/* Mobile bottom nav visible only on screens smaller than md */}
      <MobileBottomNav />
    </>
  );
}

function DashboardGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useQuery(api.users.current);
  const { hasAccess, isLoading } = useSession();

  const isAuthenticated = user !== null;
  const isUserLoading = user === undefined;

  useEffect(() => {
    if (isUserLoading || isLoading) return;

    // If not authenticated, redirect to home (Clerk will handle sign-in)
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    // If user doesn't have paid access, redirect to purchase
    if (!hasAccess) {
      router.push("/purchase");
      return;
    }
  }, [isUserLoading, isLoading, isAuthenticated, hasAccess, router]);

  // Show loading
  if (isUserLoading || isLoading) {
    return (
      <div className="from-brand-blue/10 flex min-h-screen items-center justify-center bg-gradient-to-br to-indigo-100">
        <div className="text-center">
          <div className="border-brand-blue mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting (user doesn't have access)
  if (!isAuthenticated || !hasAccess) {
    return (
      <div className="from-brand-blue/10 flex min-h-screen items-center justify-center bg-gradient-to-br to-indigo-100">
        <div className="text-center">
          <div className="border-brand-blue mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider defaultOpen={false}>
        <DashboardGuard>
          <SidebarContent>{children}</SidebarContent>
        </DashboardGuard>
      </SidebarProvider>
    </SessionProvider>
  );
}
