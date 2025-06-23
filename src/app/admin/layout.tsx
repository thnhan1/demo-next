import type React from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = session?.user && (session.user as any).role;
  if (role !== "ADMIN") {
    redirect("/");
  }
  return <AdminLayout>{children}</AdminLayout>;
}
