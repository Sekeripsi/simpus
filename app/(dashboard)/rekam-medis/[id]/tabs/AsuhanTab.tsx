import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { AsuhanValues } from "./types";

interface AsuhanTabProps {
  values: AsuhanValues;
  onChange: (field: keyof AsuhanValues, value: string) => void;
}

export function AsuhanTab({ values, onChange }: AsuhanTabProps) {
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="bg-secondary/10">
        <CardTitle className="text-md font-medium text-secondary py-2">
          Asuhan Keperawatan
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="diagnosaData"
            className="text-xs uppercase tracking-wide text-gray-500 font-semibold"
          >
            Data Diagnosa
          </Label>
          <Textarea
            id="diagnosaData"
            value={values.diagnosaData}
            onChange={(event) => onChange("diagnosaData", event.target.value)}
            rows={3}
            placeholder="Masukkan data diagnosa"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="diagnosaAsuhan"
            className="text-xs uppercase tracking-wide text-gray-500 font-semibold"
          >
            Diagnosa
          </Label>
          <Textarea
            id="diagnosaAsuhan"
            value={values.diagnosa}
            onChange={(event) => onChange("diagnosa", event.target.value)}
            rows={3}
            placeholder="Masukkan diagnosa"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="intervensi"
            className="text-xs uppercase tracking-wide text-gray-500 font-semibold"
          >
            Intervensi
          </Label>
          <Textarea
            id="intervensi"
            value={values.intervensi}
            onChange={(event) => onChange("intervensi", event.target.value)}
            rows={3}
            placeholder="Masukkan intervensi"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="implementasi"
            className="text-xs uppercase tracking-wide text-gray-500 font-semibold"
          >
            Implementasi
          </Label>
          <Textarea
            id="implementasi"
            value={values.implementasi}
            onChange={(event) => onChange("implementasi", event.target.value)}
            rows={3}
            placeholder="Masukkan implementasi"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="evaluasi"
            className="text-xs uppercase tracking-wide text-gray-500 font-semibold"
          >
            Evaluasi
          </Label>
          <Textarea
            id="evaluasi"
            value={values.evaluasi}
            onChange={(event) => onChange("evaluasi", event.target.value)}
            rows={3}
            placeholder="Masukkan evaluasi"
          />
        </div>
      </CardContent>
    </Card>
  );
}
