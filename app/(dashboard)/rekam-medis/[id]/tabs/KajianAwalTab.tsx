import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import type { KajianAwalValues } from "./types";

interface KajianAwalTabProps {
  values: KajianAwalValues;
  onChange: (field: keyof KajianAwalValues, value: string) => void;
}

export function KajianAwalTab({
  values,
  onChange,
}: KajianAwalTabProps) {
  return (
    <div className="flex flex-col gap-2">
      <Card className="p-0 gap-0">
        <CardHeader className="bg-secondary/10">
          <CardTitle className="text-md font-medium text-secondary py-2">
            Alergi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <Textarea
            value={values.alergi}
            onChange={(event) => onChange("alergi", event.target.value)}
            placeholder="Masukkan alergi"
            rows={5}
          />
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-2">
        <Card className="p-0 gap-0">
          <CardHeader className="bg-secondary/10">
            <CardTitle className="text-md font-medium text-secondary py-2">
              Riwayat Penyakit Dahulu
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <Textarea
              value={values.riwayatPenyakitDahulu}
              onChange={(event) => onChange("riwayatPenyakitDahulu", event.target.value)}
              placeholder="Masukkan riwayat penyakit"
              rows={5}
            />
          </CardContent>
        </Card>
        <Card className="p-0 gap-0">
          <CardHeader className="bg-secondary/10">
            <CardTitle className="text-md font-medium text-secondary py-2">
              Riwayat Penyakit Keluarga
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <Textarea
              value={values.riwayatPenyakitKeluarga}
              onChange={(event) => onChange("riwayatPenyakitKeluarga", event.target.value)}
              placeholder="Masukkan riwayat penyakit keluarga"
              rows={5}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
