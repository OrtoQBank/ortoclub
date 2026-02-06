import { redirect } from "next/navigation";
import { requireAdminServer } from "@/lib/server-auth";

// Force dynamic rendering for admin routes (requires authentication)
export const dynamic = "force-dynamic";

/**
 * Server-side admin layout with role-based authorization
 * This layout enforces that only admins can access admin routes
 *
 * SECURITY: This runs on the server and validates the user's role
 * before rendering any admin content
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdminServer();
  } catch {
    redirect("/sign-in");
  }

  return <div className="space-y-6">{children}</div>;
}
