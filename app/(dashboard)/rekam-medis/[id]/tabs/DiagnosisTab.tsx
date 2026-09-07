import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { DiagnosisValues } from "./types";
import { Textarea } from "@/components/ui/textarea";

interface DiagnosisTabProps {
  values: DiagnosisValues;
  onChange: (field: keyof DiagnosisValues, value: string) => void;
}

export function DiagnosisTab({ values, onChange }: DiagnosisTabProps) {
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="bg-secondary/10">
        <CardTitle className="text-md font-medium text-secondary py-2">
          Diagnosis
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-2 p-2">
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="diagnosis"
            className="text-xs uppercase tracking-wide text-gray-500 font-semibold"
          >
            Diagnosis
          </Label>
          <Textarea
            id="diagnosis"
            value={values.diagnosis}
            onChange={(event) => onChange("diagnosis", event.target.value)}
            placeholder="Masukkan diagnosis"
            rows={3}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="kodeIcd"
            className="text-xs uppercase tracking-wide text-gray-500 font-semibold"
          >
            Kode ICD
          </Label>
          <Input
            id="kodeIcd"
            value={values.kodeIcd}
            onChange={(event) => onChange("kodeIcd", event.target.value)}
            placeholder="Masukkan kode ICD"
          />
        </div>
      </CardContent>
    </Card>
  );
}
