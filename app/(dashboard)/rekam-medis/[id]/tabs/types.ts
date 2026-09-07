/**
 * Type definitions for Rekam Medis detail page tabs
 * Updated for normalized schema with separate related tables
 */

export interface MedicalRecordDetail {
  id: string;
  pasienId: string;
  pendaftaranId: string;
  kajianAwalId: string;
  anamnesisId: string;
  pemeriksaanId: string;
  diagnosisId: string;
  tindakanId: string;
  pengobatanId: string;
  pulangRujukId: string;
  asuhanId: string;
  labId: string;
  catatanDokterId: string | null;
  status: "DRAFT" | "SELESAI";
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  pasien: {
    id: string;
    nik: string;
    noKk?: string;
    nama: string;
    jenisKelamin: string;
    tanggalLahir: Date | null;
    alamatTinggal: string | null;
    alamatKtp?: string | null;
    alamatDomisili?: string | null;
    pendidikan?: string | null;
    noTlp: string | null;
    email: string | null;
  };
  pendaftaran: {
    id: string;
    tglKunjungan: Date;
    noAntrian: string;
    unitLayanan: string;
    jenisLayanan: string;
    noRegis: string;
    poliklinik: string;
    kehadiran: string;
    targetStatus: string;
    pembayaran: string;
    catatan?: string | null;
  };
  kajianAwal: {
    id: string;
    alergi?: string | null;
    riwayatPenyakitDahulu?: string | null;
    riwayatPenyakitKeluarga?: string | null;
  };
  anamnesis: {
    id: string;
    keluhan?: string | null;
  };
  pemeriksaan: {
    id: string;
    keadaan?: string | null;
    kesadaran?: string | null;
    respirasi?: number | null;
    suhu?: number | null;
    nadi?: number | null;
    sistol?: number | null;
    diastol?: number | null;
  };
  diagnosis: {
    id: string;
    diagnosis?: string | null;
    kodeIcd?: string | null;
  };
  tindakan: {
    id: string;
    tindakan?: string | null;
  };
  pengobatan: {
    id: string;
    pengobatan?: unknown;
  };
  pulangRujuk: {
    id: string;
    tglPulang?: Date | null;
    statusPulang?: string | null;
    kie?: string | null;
    plan?: string | null;
    rencKunjBerikutnya?: Date | null;
    rencPemeriksaan6Bln?: Date | null;
    rujukInternal?: string | null;
    rujukEksternal?: string | null;
  };
  asuhan: {
    id: string;
    diagnosaData?: string | null;
    diagnosa?: string | null;
    intervensi?: string | null;
    implementasi?: string | null;
    evaluasi?: string | null;
  };
  lab: {
    id: string;
    permintaanPemeriksaan?: string | null;
  };
  catatanDokter: {
    id: string;
    catatan?: string | null;
    dokterId?: string | null;
    namaDokter?: string | null;
    createdAt?: Date | null;
  } | null;
}

export type DetailRow = {
  label: string;
  value: string;
};

export type KajianAwalValues = {
  alergi: string;
  riwayatPenyakitDahulu: string;
  riwayatPenyakitKeluarga: string;
};

export type DiagnosisValues = {
  diagnosis: string;
  kodeIcd: string;
};

export type PemeriksaanValues = {
  keadaan: string;
  kesadaran: string;
  respirasi: string;
  suhu: string;
  nadi: string;
  sistol: string;
  diastol: string;
};

export type TerapiObatRow = {
  rSlash: string;
  kode: string;
  nama: string;
  rDalam: string;
  rLuar: string;
  caraPakai: string;
  keterangan: string;
};

export const EMPTY_TERAPI_OBAT_ROW: TerapiObatRow = {
  rSlash: "",
  kode: "",
  nama: "",
  rDalam: "",
  rLuar: "",
  caraPakai: "",
  keterangan: "",
};

export type PulangRujukValues = {
  tglPulang: string;
  statusPulang: string;
  kie: string;
  plan: string;
  rencKunjBerikutnya: string;
  rencPemeriksaan6Bln: string;
  rujukInternal: string;
  rujukEksternal: string;
};

export type AsuhanValues = {
  diagnosaData: string;
  diagnosa: string;
  intervensi: string;
  implementasi: string;
  evaluasi: string;
};
