import { LeadsPageComponent } from "./_components/leads-page";
import { requireAdminServer } from "@/lib/server-auth";

export default async function LeadsPage() {
    // Explicit server-side authorization check (defense in depth)
    await requireAdminServer();

    return <LeadsPageComponent />;
}