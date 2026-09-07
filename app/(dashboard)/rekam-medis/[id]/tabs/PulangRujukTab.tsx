import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { PulangRujukValues } from "./types";

interface PulangRujukTabProps {
  values: PulangRujukValues;
  selisihHari: string;
  onChange: (field: keyof PulangRujukValues, value: string) => void;
}

const STATUS_PULANG_OPTIONS = [
  { value: "SEMBUH", label: "Sembuh" },
  { value: "MEMBAIK", label: "Membaik" },
  { value: "KONTROL", label: "Kontrol" },
  { value: "RUJUK", label: "Rujuk" },
  { value: "MENINGGAL", label: "Meninggal" },
] as const;

export function PulangRujukTab({
  values,
  selisihHari,
  onChange,
}: PulangRujukTabProps) {
  return (
    <div className="flex flex-col gap-2">
      <Card className="p-0 gap-0">
        <CardHeader className="bg-secondary/10">
          <CardTitle className="text-md font-medium text-secondary py-2">
            Pulang
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="tglPulang"
                className="text-xs uppercase tracking-wide text-gray-500 font-semibold"
              >
                Tgl Pulang
              </Label>
              <Input
                id="tglPulang"
                type="date"
                value={values.tglPulang}
                onChange={(event) => onChange("tglPulang", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="statusPulang"
                className="text-xs uppercase tracking-wide text-gray-500 font-semibold"
              >
                Status Pulang
              </Label>
              <select
                id="statusPulang"
                aria-label="Status Pulang"
                value={values.statusPulang}
                onChange={(event) => onChange("statusPulang", event.target.value)}
                className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
              >
                <option value="">Pilih status pulang</option>
                {STATUS_PULANG_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-0 gap-0">
        <CardHeader className="bg-secondary/10">
          <CardTitle className="text-md font-medium text-secondary py-2">
            KIE dan Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="kie"
              className="text-xs uppercase tracking-wide text-gray-500 font-semibold"
            >
              KIE
            </Label>
            <Textarea
              id="kie"
              value={values.kie}
              onChange={(event) => onChange("kie", event.target.value)}
              rows={3}
              placeholder="Masukkan KIE"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="plan"
              className="text-xs uppercase tracking-wide text-gray-500 font-semibold"
            >
              Plan
            </Label>
            <Textarea
              id="plan"
              value={values.plan}
              onChange={(event) => onChange("plan", event.target.value)}
              rows={3}
              placeholder="Masukkan plan"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="rencKunjBerikutnya"
                className="text-xs uppercase tracking-wide text-gray-500 font-semibold"
              >
                Renc Kunj Berikutnya
              </Label>
              <Input
                id="rencKunjBerikutnya"
                type="date"
                value={values.rencKunjBerikutnya}
                onChange={(event) => onChange("rencKunjBerikutnya", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="selisihHari"
                className="text-xs uppercase tracking-wide text-gray-500 font-semibold"
              >
                Selisih Hari
              </Label>
              <Input id="selisihHari" value={selisihHari} readOnly />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="rencPemeriksaan6Bln"
                className="text-xs uppercase tracking-wide text-gray-500 font-semibold"
              >
                Rencana Pemeriksaan Lab 6 Bulan Sekali
              </Label>
              <Input
                id="rencPemeriksaan6Bln"
                type="date"
                value={values.rencPemeriksaan6Bln}
                onChange={(event) => onChange("rencPemeriksaan6Bln", event.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-0 gap-0">
        <CardHeader className="bg-secondary/10">
          <CardTitle className="text-md font-medium text-secondary py-2">
            Rujuk
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="rujukInternal"
                className="text-xs uppercase tracking-wide text-gray-500 font-semibold"
              >
                Rujuk Internal ke
              </Label>
              <Input
                id="rujukInternal"
                value={values.rujukInternal}
                onChange={(event) => onChange("rujukInternal", event.target.value)}
                placeholder="Masukkan rujukan internal"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="rujukEksternal"
                className="text-xs uppercase tracking-wide text-gray-500 font-semibold"
              >
                Rujuk Eksternal ke
              </Label>
              <Input
                id="rujukEksternal"
                value={values.rujukEksternal}
                onChange={(event) => onChange("rujukEksternal", event.target.value)}
                placeholder="Masukkan rujukan eksternal"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
