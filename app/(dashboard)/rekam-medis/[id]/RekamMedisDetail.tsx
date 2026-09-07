"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Info, CheckCircle, AlertTriangle } from "lucide-react";
import { AnamnesisTab } from "./tabs/AnamnesisTab";
import { AsuhanTab } from "./tabs/AsuhanTab";
import { CatatanDokterTab } from "./tabs/CatatanDokterTab";
import { DataPasienTab } from "./tabs/DataPasienTab";
import { DetailRowsTable } from "./tabs/DetailRowsTable";
import { DiagnosisTab } from "./tabs/DiagnosisTab";
import { KajianAwalTab } from "./tabs/KajianAwalTab";
import { LabTab } from "./tabs/LabTab";
import { PemeriksaanTab } from "./tabs/PemeriksaanTab";
import { PengobatanTab } from "./tabs/PengobatanTab";
import { PulangRujukTab } from "./tabs/PulangRujukTab";
import { TindakanTab } from "./tabs/TindakanTab";
import {
  type AsuhanValues,
  type DiagnosisValues,
  EMPTY_TERAPI_OBAT_ROW,
  type KajianAwalValues,
  type MedicalRecordDetail,
  type PemeriksaanValues,
  type PulangRujukValues,
  type TerapiObatRow,
} from "./tabs/types";
import {
  calculateSelisihHari,
  getDataPasienRows,
  getInformasiPasienRows,
} from "./tabs/utils";

interface RekamMedisDetailProps {
  record: MedicalRecordDetail;
  initialView: string;
}

const TAB_ITEMS = [
  { value: "data-pasien", label: "Data Pasien" },
  { value: "kajian-awal", label: "Kajian Awal" },
  { value: "anamnesis", label: "Anamnesis" },
  { value: "pemeriksaan", label: "Pemeriksaan" },
  { value: "diagnosis", label: "Diagnosis" },
  { value: "catatan-dokter", label: "Catatan Dokter" },
  { value: "tindakan", label: "Tindakan" },
  { value: "pengobatan", label: "Pengobatan" },
  { value: "pulang-rujuk", label: "Pulang/Rujuk" },
  { value: "asuhan", label: "Asuhan" },
  { value: "lab", label: "Lab" },
] as const;

type TabValue = (typeof TAB_ITEMS)[number]["value"];

const DEFAULT_TAB: TabValue = "data-pasien";

function normalizeInitialView(initialView: string): TabValue {
  if (TAB_ITEMS.some((tab) => tab.value === initialView)) {
    return initialView as TabValue;
  }

  return DEFAULT_TAB;
}

function parseJsonValue(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getObjectValue(value: unknown): Record<string, unknown> {
  const parsedValue = parseJsonValue(value);

  if (
    parsedValue !== null
    && typeof parsedValue === "object"
    && !Array.isArray(parsedValue)
  ) {
    return parsedValue as Record<string, unknown>;
  }

  return {};
}

function getStringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function getKajianAwalValues(record: MedicalRecordDetail): KajianAwalValues {
  return {
    alergi: record.kajianAwal?.alergi || "",
    riwayatPenyakitDahulu: record.kajianAwal?.riwayatPenyakitDahulu || "",
    riwayatPenyakitKeluarga: record.kajianAwal?.riwayatPenyakitKeluarga || "",
  };
}

function getPemeriksaanValues(record: MedicalRecordDetail): PemeriksaanValues {
  return {
    keadaan: record.pemeriksaan?.keadaan || "",
    kesadaran: record.pemeriksaan?.kesadaran || "",
    respirasi: record.pemeriksaan?.respirasi?.toString() || "",
    suhu: record.pemeriksaan?.suhu?.toString() || "",
    nadi: record.pemeriksaan?.nadi?.toString() || "",
    sistol: record.pemeriksaan?.sistol?.toString() || "",
    diastol: record.pemeriksaan?.diastol?.toString() || "",
  };
}

function getTerapiObatRows(value: unknown): TerapiObatRow[] {
  const parsedValue = parseJsonValue(value);

  if (!Array.isArray(parsedValue)) {
    return [{ ...EMPTY_TERAPI_OBAT_ROW }];
  }

  const rows = parsedValue.map((rowValue) => {
    const source = getObjectValue(rowValue);

    return {
      rSlash: getStringValue(source.rSlash),
      kode: getStringValue(source.kode),
      nama: getStringValue(source.nama),
      rDalam: getStringValue(source.rDalam),
      rLuar: getStringValue(source.rLuar),
      caraPakai: getStringValue(source.caraPakai),
      keterangan: getStringValue(source.keterangan),
    };
  });

  return rows.length > 0 ? rows : [{ ...EMPTY_TERAPI_OBAT_ROW }];
}

function getPulangRujukValues(record: MedicalRecordDetail): PulangRujukValues {
  return {
    tglPulang: record.pulangRujuk?.tglPulang?.toString() || "",
    statusPulang: record.pulangRujuk?.statusPulang || "",
    kie: record.pulangRujuk?.kie || "",
    plan: record.pulangRujuk?.plan || "",
    rencKunjBerikutnya: record.pulangRujuk?.rencKunjBerikutnya?.toString() || "",
    rencPemeriksaan6Bln: record.pulangRujuk?.rencPemeriksaan6Bln?.toString() || "",
    rujukInternal: record.pulangRujuk?.rujukInternal || "",
    rujukEksternal: record.pulangRujuk?.rujukEksternal || "",
  };
}

function getAsuhanValues(record: MedicalRecordDetail): AsuhanValues {
  return {
    diagnosaData: record.asuhan?.diagnosaData || "",
    diagnosa: record.asuhan?.diagnosa || "",
    intervensi: record.asuhan?.intervensi || "",
    implementasi: record.asuhan?.implementasi || "",
    evaluasi: record.asuhan?.evaluasi || "",
  };
}

function buildAllPayload(
  kajianAwalValues: KajianAwalValues,
  keluhanValue: string,
  pemeriksaanValues: PemeriksaanValues,
  diagnosisValues: DiagnosisValues,
  tindakanValue: string,
  terapiObatRows: TerapiObatRow[],
  pulangRujukValues: PulangRujukValues,
  asuhanValues: AsuhanValues,
  permintaanPemeriksaanLaboratorium: string,
  catatanDokterValue: string
): Record<string, unknown> {
  return {
    kajianAwal: kajianAwalValues,
    anamnesis: { keluhan: keluhanValue },
    pemeriksaan: {
      keadaan: pemeriksaanValues.keadaan,
      kesadaran: pemeriksaanValues.kesadaran || undefined,
      respirasi: pemeriksaanValues.respirasi ? parseInt(pemeriksaanValues.respirasi, 10) : undefined,
      suhu: pemeriksaanValues.suhu ? parseFloat(pemeriksaanValues.suhu) : undefined,
      nadi: pemeriksaanValues.nadi ? parseInt(pemeriksaanValues.nadi, 10) : undefined,
      sistol: pemeriksaanValues.sistol ? parseInt(pemeriksaanValues.sistol, 10) : undefined,
      diastol: pemeriksaanValues.diastol ? parseInt(pemeriksaanValues.diastol, 10) : undefined,
    },
    diagnosis: {
      diagnosis: diagnosisValues.diagnosis,
      kodeIcd: diagnosisValues.kodeIcd,
    },
    tindakan: { tindakan: tindakanValue },
    pengobatan: { pengobatan: terapiObatRows },
    pulangRujuk: {
      tglPulang: pulangRujukValues.tglPulang || undefined,
      statusPulang: pulangRujukValues.statusPulang || undefined,
      kie: pulangRujukValues.kie,
      plan: pulangRujukValues.plan,
      rencKunjBerikutnya: pulangRujukValues.rencKunjBerikutnya || undefined,
      rencPemeriksaan6Bln: pulangRujukValues.rencPemeriksaan6Bln || undefined,
      rujukInternal: pulangRujukValues.rujukInternal,
      rujukEksternal: pulangRujukValues.rujukEksternal,
    },
  asuhan: asuhanValues,
  lab: { permintaanPemeriksaan: permintaanPemeriksaanLaboratorium },
  catatanDokter: { catatan: catatanDokterValue },
};
}

export function RekamMedisDetail({
  record,
  initialView,
}: RekamMedisDetailProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabValue>(
    normalizeInitialView(initialView)
  );
  const [kajianAwalValues, setKajianAwalValues] = useState<KajianAwalValues>(
    () => getKajianAwalValues(record)
  );
  const [keluhanValue, setKeluhanValue] = useState(record.anamnesis?.keluhan?.trim() || "");
  const [diagnosisValues, setDiagnosisValues] = useState<DiagnosisValues>({
    diagnosis: record.diagnosis?.diagnosis?.trim() || "",
    kodeIcd: record.diagnosis?.kodeIcd?.trim() || "",
  });
  const [catatanDokterValue, setCatatanDokterValue] = useState(
    record.catatanDokter?.catatan?.trim() || ""
  );
  const [tindakanValue, setTindakanValue] = useState(record.tindakan?.tindakan?.trim() || "");
  const [pemeriksaanValues, setPemeriksaanValues] = useState<PemeriksaanValues>(
    () => getPemeriksaanValues(record)
  );
  const [terapiObatRows, setTerapiObatRows] = useState<TerapiObatRow[]>(
    () => getTerapiObatRows(record.pengobatan?.pengobatan)
  );
  const [pulangRujukValues, setPulangRujukValues] = useState<PulangRujukValues>(
    () => getPulangRujukValues(record)
  );
  const [asuhanValues, setAsuhanValues] = useState<AsuhanValues>(
    () => getAsuhanValues(record)
  );
  const [permintaanPemeriksaanLaboratorium, setPermintaanPemeriksaanLaboratorium] =
    useState(record.lab?.permintaanPemeriksaan?.trim() || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showSelesaiWarning, setShowSelesaiWarning] = useState(false);
  const [isSelesai, setIsSelesai] = useState(record.status === "SELESAI");

  const handleTerapiObatChange = (
    rowIndex: number,
    field: keyof TerapiObatRow,
    value: string
  ) => {
    setTerapiObatRows((prev) =>
      prev.map((row, index) =>
        index === rowIndex ? { ...row, [field]: value } : row
      )
    );
  };

  const addTerapiObatRow = () => {
    setTerapiObatRows((prev) => [...prev, { ...EMPTY_TERAPI_OBAT_ROW }]);
  };

  const updatePulangRujukValue = (
    field: keyof PulangRujukValues,
    value: string
  ) => {
    setPulangRujukValues((prev) => ({ ...prev, [field]: value }));
  };

  const updateAsuhanValue = (field: keyof AsuhanValues, value: string) => {
    setAsuhanValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveActiveTab = async () => {
    if (activeTab === "data-pasien") {
      return;
    }

    const payloadByTab: Record<TabValue, Record<string, unknown>> = {
      "data-pasien": {},
      "kajian-awal": { kajianAwal: kajianAwalValues },
      anamnesis: { anamnesis: { keluhan: keluhanValue } },
      pemeriksaan: {
        pemeriksaan: {
          keadaan: pemeriksaanValues.keadaan,
          kesadaran: pemeriksaanValues.kesadaran || undefined,
          respirasi: pemeriksaanValues.respirasi ? parseInt(pemeriksaanValues.respirasi, 10) : undefined,
          suhu: pemeriksaanValues.suhu ? parseFloat(pemeriksaanValues.suhu) : undefined,
          nadi: pemeriksaanValues.nadi ? parseInt(pemeriksaanValues.nadi, 10) : undefined,
          sistol: pemeriksaanValues.sistol ? parseInt(pemeriksaanValues.sistol, 10) : undefined,
          diastol: pemeriksaanValues.diastol ? parseInt(pemeriksaanValues.diastol, 10) : undefined,
        }
      },
      diagnosis: {
        diagnosis: {
          diagnosis: diagnosisValues.diagnosis,
          kodeIcd: diagnosisValues.kodeIcd,
        }
      },
      "catatan-dokter": { catatanDokter: { catatan: catatanDokterValue } },
      tindakan: { tindakan: { tindakan: tindakanValue } },
      pengobatan: { pengobatan: { pengobatan: terapiObatRows } },
      "pulang-rujuk": {
        pulangRujuk: {
          tglPulang: pulangRujukValues.tglPulang || undefined,
          statusPulang: pulangRujukValues.statusPulang || undefined,
          kie: pulangRujukValues.kie,
          plan: pulangRujukValues.plan,
          rencKunjBerikutnya: pulangRujukValues.rencKunjBerikutnya || undefined,
          rencPemeriksaan6Bln: pulangRujukValues.rencPemeriksaan6Bln || undefined,
          rujukInternal: pulangRujukValues.rujukInternal,
          rujukEksternal: pulangRujukValues.rujukEksternal,
        }
      },
      asuhan: { asuhan: asuhanValues },
      lab: { lab: { permintaanPemeriksaan: permintaanPemeriksaanLaboratorium } },
    };

    setSaveError(null);
    setIsSaving(true);

    try {
      const response = await fetch(`/api/rekam-medis/${record.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadByTab[activeTab]),
      });

      if (!response.ok) {
        let errorMsg = "Gagal menyimpan data rekam medis"
        try {
          const errorData = await response.json() as { error?: string; message?: string }
          errorMsg = errorData.error || errorData.message || errorMsg
        } catch { }
        throw new Error(errorMsg)
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelesai = async (force = false) => {
    if (isSelesai) return;

    if (!force) {
      const pulangKosong = pulangRujukValues.tglPulang === "" && pulangRujukValues.statusPulang === "";
      if (pulangKosong) {
        setShowSelesaiWarning(true);
        return;
      }
    }

    setSaveError(null);
    setIsSaving(true);

    try {
      const payload = buildAllPayload(
        kajianAwalValues,
        keluhanValue,
        pemeriksaanValues,
        diagnosisValues,
        tindakanValue,
        terapiObatRows,
        pulangRujukValues,
        asuhanValues,
        permintaanPemeriksaanLaboratorium,
        catatanDokterValue
      );

      const saveResponse = await fetch(`/api/rekam-medis/${record.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!saveResponse.ok) {
        let errorMsg = "Gagal menyimpan data rekam medis";
        try {
          const errorData = await saveResponse.json() as { error?: string; message?: string };
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch { }
        throw new Error(errorMsg);
      }

      const selesaiResponse = await fetch(`/api/rekam-medis/${record.id}/selesai`, {
        method: "POST",
      });

      if (!selesaiResponse.ok) {
        let errorMsg = "Gagal menyelesaikan rekam medis";
        try {
          const errorData = await selesaiResponse.json() as { error?: string; message?: string };
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch { }
        throw new Error(errorMsg);
      }

      setIsSelesai(true);
      router.push("/rekam-medis");
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Gagal menyelesaikan rekam medis. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const selisihHari = calculateSelisihHari(
    pulangRujukValues.tglPulang,
    pulangRujukValues.rencKunjBerikutnya
  );

  const informasiPasienRows = getInformasiPasienRows(record);
  const dataPasienRows = getDataPasienRows(record);

  const renderTabContent = (tabValue: TabValue) => {
    switch (tabValue) {
      case "data-pasien":
        return <DataPasienTab rows={dataPasienRows} />;
      case "kajian-awal":
        return (
          <KajianAwalTab
            values={kajianAwalValues}
            onChange={(field, value) =>
              setKajianAwalValues((prev) => ({ ...prev, [field]: value }))
            }
          />
        );
      case "anamnesis":
        return (
          <AnamnesisTab
            keluhan={keluhanValue}
            onKeluhanChange={setKeluhanValue}
          />
        );
      case "pemeriksaan":
        return (
          <PemeriksaanTab
            values={pemeriksaanValues}
            onChange={(field, value) =>
              setPemeriksaanValues((prev) => ({ ...prev, [field]: value }))
            }
          />
        );
      case "diagnosis":
        return (
          <DiagnosisTab
            values={diagnosisValues}
            onChange={(field, value) =>
              setDiagnosisValues((prev) => ({ ...prev, [field]: value }))
            }
          />
        );
      case "catatan-dokter":
        return (
          <CatatanDokterTab
            value={catatanDokterValue}
            namaDokter={record.catatanDokter?.namaDokter || ""}
            onChange={setCatatanDokterValue}
          />
        );
      case "tindakan":
        return <TindakanTab value={tindakanValue} onChange={setTindakanValue} />;
      case "pengobatan":
        return (
          <PengobatanTab
            rows={terapiObatRows}
            onChange={handleTerapiObatChange}
            onAddRow={addTerapiObatRow}
          />
        );
      case "pulang-rujuk":
        return (
          <PulangRujukTab
            values={pulangRujukValues}
            selisihHari={selisihHari}
            onChange={updatePulangRujukValue}
          />
        );
      case "asuhan":
        return <AsuhanTab values={asuhanValues} onChange={updateAsuhanValue} />;
      case "lab":
        return (
          <LabTab
            value={permintaanPemeriksaanLaboratorium}
            onChange={setPermintaanPemeriksaanLaboratorium}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col transition-all duration-500">
      <main className="flex flex-col gap-2 flex-1 w-full">
        <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden py-0 gap-0">
          <CardHeader className="py-2 bg-primary/10">
            <CardTitle className="font-bold text-secondary text-lg flex items-center gap-2">
              <Icon icon={Info} size="sm" className="text-main-blue" />
              Informasi Pasien
              {isSelesai && (
                <Badge
                  variant="outline"
                  className="ml-auto bg-success-100 text-success-700 border-success-300 text-xs"
                >
                  <Icon icon={CheckCircle} size="sm" />
                  Selesai
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <DetailRowsTable rows={informasiPasienRows} />
          </CardContent>
        </Card>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabValue)}
        >
          <TabsList
            className="w-full bg-white border border-gray-100 justify-start"
          >
            {TAB_ITEMS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="font-medium text-gray-500 transition-colors hover:text-secondary data-active:text-primary data-active:border-primary hover:cursor-pointer"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {TAB_ITEMS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden py-0 gap-0">
                <CardHeader className="py-2 bg-primary/10">
                  <CardTitle className="font-bold text-secondary text-lg">
                    {tab.label}
                  </CardTitle>
                </CardHeader>
                <div className="p-2 space-y-3">
                  {renderTabContent(tab.value)}
                  {tab.value !== "data-pasien" && tab.value === activeTab && (
                    <div className="space-y-1">
                      {saveError && (
                        <p className="text-sm text-danger-600" role="alert">
                          {saveError}
                        </p>
                      )}
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={() => {
                            void handleSaveActiveTab();
                          }}
                          disabled={isSaving}
                        >
                          {isSaving ? "Menyimpan..." : `Simpan ${tab.label}`}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex items-center justify-between rounded-2xl shadow-sm">
          <div className="flex items-center gap-2">
            {isSelesai ? (
              <Badge
                variant="outline"
                className="bg-success-100 text-success-700 border-success-300"
              >
                <Icon icon={CheckCircle} size="sm" />
                Rekam Medis Selesai
              </Badge>
            ) : (
              <span className="text-sm text-gray-500">
                Pastikan semua data sudah terisi sebelum menyelesaikan
              </span>
            )}
          </div>
          <Button
            type="button"
            variant="default"
            className="bg-primary hover:bg-success-600 text-white font-semibold"
            disabled={isSaving || isSelesai}
            onClick={() => { void handleSelesai(); }}
          >
            {isSaving ? "Menyimpan..." : isSelesai ? "Selesai" : "Selesai"}
          </Button>
        </div>

        <AlertDialog open={showSelesaiWarning} onOpenChange={setShowSelesaiWarning}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Icon icon={AlertTriangle} size="sm" className="text-warning-500" />
                Data Pulang/Rujuk Belum Diisi
              </AlertDialogTitle>
              <AlertDialogDescription>
                Data Pulang/Rujuk (Tgl Pulang dan Status Pulang) belum diisi.
                Apakah Anda yakin ingin tetap menyelesaikan rekam medis ini?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Kembali Isi Data</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setShowSelesaiWarning(false);
                  void handleSelesai(true);
                }}
              >
                Tetap Selesaikan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
