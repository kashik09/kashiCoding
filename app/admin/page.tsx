import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth/session";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const isAuthenticated = await verifySession();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}
