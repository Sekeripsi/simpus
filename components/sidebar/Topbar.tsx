"use client";

import { usePathname } from "next/navigation";
import { ProfileDropdown } from "@/components/header/ProfileDropdown";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  userName?: string | null;
  userRole?: string | null;
}

const PAGE_TITLES: Record<string, string> = {
  "/home": "Dashboard",
  "/pendaftaran": "Pendaftaran",
  "/rekam-medis": "Rekam Medis",
};

function getPageTitle(pathname: string) {
  if (pathname === "/pendaftaran/pasien/baru") {
    return "Pendaftaran Pasien Baru";
  }

  if (pathname.startsWith("/pendaftaran/pasien/") && pathname.endsWith("/edit")) {
    return "Ubah Data Pasien";
  }

  if (pathname.startsWith("/rekam-medis/")) {
    return "Detail Rekam Medis";
  }

  return PAGE_TITLES[pathname] ?? "Dashboard";
}

export function Topbar({ userName, userRole }: TopbarProps) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname || "/home");

  return (
    <header className="sticky top-0 z-40 backdrop-blur-lg">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold text-slate-800">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          {userName ? (
            <ProfileDropdown userName={userName} userRole={userRole} />
          ) : (
            <Button
              render={<Link href="/login" />}
							nativeButton={false}
              className="h-auto px-4 py-2 rounded-lg bg-(--primary-500) text-white text-sm font-semibold hover:bg-(--primary-600) transition-colors duration-200"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
