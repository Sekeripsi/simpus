import type { Metadata } from "next";
import { searchRekamMedis } from "@/lib/actions/rekam-medis";
import { type SearchFilters, type RekamMedisResult } from "@/lib/types/rekam-medis";
import { HasilRekamMedisPage } from "@/components/rekam-medis/HasilRekamMedisPage";

export const metadata: Metadata = {
  title: "Rekam Medis",
};

interface PageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function RekamMedisServerPage(props: PageProps) {
  const searchParams = await props.searchParams;

  const allowedPageSizes = [10, 20, 30, 40, 50];
  const parsedPageSize = searchParams?.pageSize
    ? parseInt(searchParams.pageSize as string, 10)
    : 10;
  const pageSize = allowedPageSizes.includes(parsedPageSize) ? parsedPageSize : 10;

  const filters: SearchFilters = {
    name: searchParams?.name as string | undefined,
    nik: searchParams?.nik as string | undefined,
    layanan: searchParams?.layanan as string | undefined,
    tanggalRegistrasi: searchParams?.tanggalRegistrasi as string | undefined,
    enableTanggalRegistrasi: searchParams?.enableTanggalRegistrasi === "true",
    periodeStart: searchParams?.periodeStart as string | undefined,
    periodeEnd: searchParams?.periodeEnd as string | undefined,
    enablePeriodeRegistrasi: searchParams?.enablePeriodeRegistrasi === "true",
    pageSize: String(pageSize),
  };

  Object.entries(filters).forEach(([key, value]) => {
    if (value === "") {
      delete filters[key as keyof SearchFilters];
    }
  });

  const page = searchParams?.page ? parseInt(searchParams.page as string, 10) : 1;
  const response = await searchRekamMedis(filters, page, pageSize);

  return (
    <HasilRekamMedisPage
      filters={filters}
      results={(response.data?.results as unknown as RekamMedisResult[]) ?? []}
      pagination={response.data?.pagination ?? null}
      error={response.error ?? null}
    />
  );
}
