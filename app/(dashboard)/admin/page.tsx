import { AdminHub } from "./_components/admin-page";
import { requireAdminServer } from "@/lib/server-auth";

export default async function AdminPage() {
  // Explicit server-side authorization check (defense in depth)
  await requireAdminServer();

  return <AdminHub />;
}
