"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserPlus,
  FileText,
  Search,
  ClipboardList,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Fragment } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";

/**
 * Route segment configuration for breadcrumbs.
 * Maps URL segments to human-readable labels and optional icons.
 */
const SEGMENT_CONFIG: Record<
  string,
  { label: string; icon?: LucideIcon }
> = {
  home: { label: "Dashboard", icon: LayoutDashboard },
  pendaftaran: { label: "Pendaftaran", icon: UserPlus },
  "rekam-medis": { label: "Rekam Medis", icon: FileText },
  hasil: { label: "Hasil Pencarian", icon: Search },
  pasien: { label: "Pasien" },
  baru: { label: "Tambah Baru" },
};

/**
 * Generates breadcrumb items from the current URL path.
 * Dynamic segments like [id] are shown as "Detail".
 */
function generateCrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  const crumbs: {
    label: string;
    href: string;
    icon?: LucideIcon;
    isLast: boolean;
  }[] = [];

  let currentHref = "";

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentHref += `/${segment}`;
    const isLast = i === segments.length - 1;

    const config = SEGMENT_CONFIG[segment];
    if (config) {
      crumbs.push({
        label: config.label,
        href: currentHref,
        icon: config.icon,
        isLast,
      });
    } else {
      crumbs.push({
        label: "Detail",
        href: currentHref,
        icon: ClipboardList,
        isLast,
      });
    }
  }

  return crumbs;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const crumbs = generateCrumbs(pathname);

  if (pathname === "/home") return null;

  return (
    <Breadcrumb className="mb-2">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {crumbs.map((crumb) => (
          <Fragment key={crumb.href}>
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!crumb.isLast && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
