import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { medicalRecordIdSchema } from "@/lib/validations/rekam-medis";
import { getBackendUrl } from "@/lib/config/api";
import { logger } from "@/lib/logger";
import { getServerToken } from "@/lib/auth";
import { RekamMedisDetail } from "./RekamMedisDetail";
import type { MedicalRecordDetail } from "./tabs/types";

export const metadata: Metadata = {
  title: "Lihat Rekam Medis",
};

interface RekamMedisPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ view?: string }>;
}

const API_BASE_URL = getBackendUrl();

export default async function RekamMedisDetailPage({
  params,
  searchParams,
}: RekamMedisPageProps) {
  const { id } = await params;
  const query = await searchParams;

  const validationResult = medicalRecordIdSchema.safeParse({ id });
  if (!validationResult.success) {
    logger.warn("Invalid medical record ID format", { attemptedId: id });
    notFound();
  }

  let medicalRecord: MedicalRecordDetail | null = null;
  try {
    const token = await getServerToken()
    const headers: HeadersInit = {}
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const res = await fetch(`${API_BASE_URL}/rekam-medis/${id}`, { headers, cache: "no-store" });
    if (!res.ok) {
      notFound();
    }
    const json = await res.json();
    medicalRecord = json.data ?? null;
  } catch {
    notFound();
  }

  if (!medicalRecord) {
    logger.warn("Medical record not found", { medicalRecordId: id });
    notFound();
  }

  logger.info("Medical record detail page loaded", {
    medicalRecordId: id,
    viewMode: query.view || "detail",
  });

  return (
    <RekamMedisDetail
      record={medicalRecord}
      initialView={query.view || "detail"}
    />
  );
}
