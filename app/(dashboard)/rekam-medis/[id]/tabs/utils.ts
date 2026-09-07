import type { DetailRow, MedicalRecordDetail } from "./types";

export function calculateSelisihHari(
  tglPulang: string,
  rencKunjBerikutnya: string
): string {
  if (!tglPulang || !rencKunjBerikutnya) {
    return "";
  }

  const pulangDate = new Date(tglPulang);
  const kunjDate = new Date(rencKunjBerikutnya);
  const diffTime = Math.abs(kunjDate.getTime() - pulangDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays.toString();
}

function calculateAge(birthDate: Date | null): number {
  if (!birthDate) return 0;
  const today = new Date();
  const born = new Date(birthDate);
  let age = today.getFullYear() - born.getFullYear();
  const monthDiff = today.getMonth() - born.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < born.getDate())) {
    age--;
  }

  return age;
}

function formatDate(date: Date | string | null): string {
  if (!date) return "-";
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}

function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  const hour = d.getHours().toString().padStart(2, "0");
  const minute = d.getMinutes().toString().padStart(2, "0");

  return `${day}-${month}-${year} ${hour}:${minute}`;
}

function toShortNumericId(id: string): string {
  const digits = id.replace(/\D/g, "");
  return digits.slice(0, 5).padEnd(5, "0");
}

function getClinicDisplay(clinic: string): string {
  const clinics: Record<string, string> = {
    LANSIA: "Poliklinik Lansia",
    INFEKSIUS_A: "Poliklinik Infeksius A",
    INFEKSIUS_B: "Poliklinik Infeksius B",
    INFEKSIUS_C: "Poliklinik Infeksius C",
    NON_INFEKSIUS_A: "Poliklinik Non-Infeksius A",
    NON_INFEKSIUS_B: "Poliklinik Non-Infeksius B",
    NON_INFEKSIUS_C: "Poliklinik Non-Infeksius C",
    UGD: "UGD",
    GIGI: "Poliklinik Gigi & Mulut",
    KIA: "KIA / KB",
    UMUM: "Poliklinik Umum",
  };

  return clinics[clinic] || clinic;
}

function getPaymentDisplay(method: string): string {
  switch (method?.toUpperCase()) {
    case "BPJS":
      return "BPJS";
    case "MANDIRI":
      return "Mandiri";
    case "ASURANSI":
      return "Asuransi";
    default:
      return method || "-";
  }
}

function getPrbDisplay(targetStatus: string): string {
  switch (targetStatus?.toUpperCase()) {
    case "HT_DM":
      return "HT/DM";
    case "HT":
      return "HT";
    case "DM":
      return "DM";
    default:
      return "-";
  }
}

function formatOptional(value?: string | null): string {
  if (!value) return "-";
  const trimmed = value.trim();

  return trimmed || "-";
}

function formatClinicJenisUrut(record: MedicalRecordDetail): string {
  const clinic = getClinicDisplay(record.pendaftaran.poliklinik);
  const serviceType = record.pendaftaran.jenisLayanan?.trim() || "-";
  const queueNumber = record.pendaftaran.noAntrian || "-";

  return `${clinic} / ${serviceType} / ${queueNumber}`;
}

export function getInformasiPasienRows(record: MedicalRecordDetail): DetailRow[] {
  const age = calculateAge(record.pasien.tanggalLahir);

  return [
    { label: "Nama", value: record.pasien.nama || "-" },
    { label: "Tgl lahir", value: formatDate(record.pasien.tanggalLahir) },
    { label: "NIK", value: record.pasien.nik || "-" },
    {
      label: "Klinik/Tiket",
      value: `${getClinicDisplay(record.pendaftaran.poliklinik)} / ${record.pendaftaran.noAntrian || "-"}`,
    },
    { label: "Umur", value: `${age} tahun` },
    {
      label: "Psn ID / RM ID",
      value: `${toShortNumericId(record.pasien.id)} / ${toShortNumericId(record.id)}`,
    },
    { label: "PRB", value: getPrbDisplay(record.pendaftaran.targetStatus) },
  ];
}

export function getDataPasienRows(record: MedicalRecordDetail): DetailRow[] {
  const age = calculateAge(record.pasien.tanggalLahir);
  const genderLabel = record.pasien.jenisKelamin === "L" ? "Laki-laki" : "Perempuan";

  return [
    {
      label: "Unit layanan",
      value: record.pendaftaran.unitLayanan?.trim() || getClinicDisplay(record.pendaftaran.poliklinik),
    },
    { label: "Tgl/Jam daftar", value: formatDateTime(record.createdAt) },
    { label: "NIK/No KTP", value: formatOptional(record.pasien.nik) },
    { label: "Nama", value: record.pasien.nama || "-" },
    { label: "Tgl lahir", value: formatDate(record.pasien.tanggalLahir) },
    { label: "Alamat KTP", value: formatOptional(record.pasien.alamatKtp) },
    {
      label: "Alamat domisili",
      value: formatOptional(record.pasien.alamatDomisili || record.pasien.alamatTinggal),
    },
    { label: "Cara bayar", value: getPaymentDisplay(record.pendaftaran.pembayaran) },
    { label: "Klinik/Jenis/Urut", value: formatClinicJenisUrut(record) },
    {
      label: "No Reg/Reg ID",
      value: `${formatOptional(record.pendaftaran.noRegis)} / ${record.id}`,
    },
    {
      label: "Psn ID/RM ID",
      value: `${toShortNumericId(record.pasien.id)} / ${toShortNumericId(record.id)}`,
    },
    { label: "No KK", value: formatOptional(record.pasien.noKk) },
    { label: "Sex", value: genderLabel },
    { label: "Umur", value: `${age} tahun` },
    { label: "Pendidikan", value: formatOptional(record.pasien.pendidikan) },
  ];
}
