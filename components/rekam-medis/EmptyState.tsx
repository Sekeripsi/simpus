/**
 * EmptyState Component
 * Displayed when no search has been performed yet
 */

"use client";
import { Icon } from "@/components/shared/Icon";
import { Search } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <Icon icon={Search} size="xl" className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        Mulai Pencarian
      </h3>
      <p className="text-gray-600 text-sm max-w-md mx-auto">
        Gunakan filter di atas untuk mencari data rekam medis pasien. Anda dapat
        mencari berdasarkan nama, nomor RM, poliklinik, atau tanggal kunjungan.
      </p>
    </div>
  );
}
