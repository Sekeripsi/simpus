import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/sidebar/Topbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getAuth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const currentAuth = await getAuth()

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 min-h-0 min-w-0 overflow-y-auto">
        <div className="flex min-h-full flex-col">
          <Topbar userName={currentAuth?.name} userRole={currentAuth?.role as string} />
          <div className="flex-1 px-6">
            <Breadcrumbs />
            <main className="w-full flex flex-col">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
