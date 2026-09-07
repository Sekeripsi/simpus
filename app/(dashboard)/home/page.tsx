import type { Metadata } from "next";
import { MenuCard } from "@/components/menu-card";
import { Icon } from "@/components/shared/Icon";
import { UserPlus, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard puskesmas dengan ringkasan aktivitas dan data pasien",
};

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
      <MenuCard
        href="/pendaftaran"
        icon={<Icon icon={UserPlus} size="lg" color="white" />}
        title="Pendaftaran"
        description="Kelola data pasien baru dan pendaftaran kunjungan poliklinik dengan cepat."
        backgroundColor="bg-secondary"
      />

      <MenuCard
        href="/rekam-medis"
        icon={<Icon icon={FileText} size="lg" color="white" />}
        title="Rekam Medis"
        description="Akses dan kelola riwayat kesehatan serta dokumen pemeriksaan medis pasien."
        backgroundColor="bg-primary"
      />
    </div>
  );
}
