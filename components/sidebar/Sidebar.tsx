"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  FileText,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import LogoImage from "@/public/images/logo.png";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/home",
    icon: LayoutDashboard,
    matchPaths: ["/home"],
  },
  {
    label: "Pendaftaran",
    href: "/pendaftaran",
    icon: UserPlus,
    matchPaths: ["/pendaftaran"],
  },
  {
    label: "Rekam Medis",
    href: "/rekam-medis",
    icon: FileText,
    matchPaths: ["/rekam-medis"],
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const isRekamMedisRoute = pathname.startsWith("/rekam-medis");
  const [expanded, setExpanded] = useState(() => !isRekamMedisRoute);
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(matchPaths: readonly string[]) {
    return matchPaths.some((path) => pathname.startsWith(path));
  }

  const sidebarContent = (
    <>
      {/* Logo Section */}
      <div
        className={cn(
          "flex items-center transition-all duration-300",
          expanded ? "px-5 py-5 gap-3" : "px-3 py-5 justify-center"
        )}
      >
        <Link
          href="/home"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 group shrink-0"
        >
          <Image
            src={LogoImage}
            alt="Logo SIMPUS"
            width={36}
            height={36}
            className="rounded-lg"
          />
          {expanded && (
            <div className="flex flex-col overflow-hidden animate-fade-in">
              <span className="font-playfair text-lg font-semibold text-slate-800 tracking-tight leading-tight whitespace-nowrap">
                SIMPUS
              </span>
              <span className="text-[10px] text-slate-400 font-medium leading-none whitespace-nowrap">
                Sistem Informasi Puskesmas
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.matchPaths);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                setMobileOpen(false)
                setExpanded(false)
              }}
              title={item.label}
              className={cn(
                "group relative flex items-center rounded-lg transition-all duration-200",
                expanded ? "px-3 py-2.5 gap-3" : "px-0 py-2.5 justify-center",
                active
                  ? "bg-primary/10 text-(--primary-500)"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              )}
            >
              <Icon
                icon={item.icon}
                size="sm"
                className={cn(
                  "shrink-0 transition-colors duration-200",
                  active
                    ? "text-(--primary-500)"
                    : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {expanded && (
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {!expanded && (
                <div className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 shadow-lg">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle — Desktop only */}
      <div className="hidden lg:block border-t border-slate-100 px-3 py-3">
        <Button
          variant="ghost"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all duration-200"
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <Icon icon={expanded ? ChevronLeft : ChevronRight} size="sm" />
          {expanded && <span className="text-xs font-medium">Collapse</span>}
        </Button>
      </div>
    </>
  );

  return (
    <>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        {/* Mobile Toggle Button */}
        <SheetTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl bg-white shadow-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all duration-200"
              aria-label="Open navigation"
            >
              <Icon icon={Menu} size="sm" />
            </Button>
          }
        />

        {/* Mobile Sidebar Drawer */}
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[260px] gap-0 p-0 bg-white border-r border-slate-200 shadow-xl lg:hidden"
        >
          {/* Mobile close button */}
          <SheetClose
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Close navigation"
              >
                <Icon icon={X} size="sm" />
              </Button>
            }
          />
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        aria-hidden
        className={cn("hidden lg:block shrink-0", expanded ? "w-[240px]" : "w-[72px]")}
      />
      <aside
        className={cn(
          "hidden lg:flex fixed left-0 top-0 z-30 h-screen flex-col overflow-y-auto bg-white transition-all duration-300 ease-out",
          expanded ? "w-[240px]" : "w-[72px]"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
