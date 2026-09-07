import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { PemeriksaanValues } from "./types";

interface PemeriksaanTabProps {
  values: PemeriksaanValues;
  onChange: (field: keyof PemeriksaanValues, value: string) => void;
}

export function PemeriksaanTab({ values, onChange }: PemeriksaanTabProps) {
  return (
    <div className="flex flex-col gap-2">
      <Card className="p-0 gap-0">
        <CardHeader className="bg-secondary/10">
          <CardTitle className="text-md font-medium text-secondary py-2">
            Keadaan Umum
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <Textarea
            id="keadaan"
            value={values.keadaan}
            onChange={(event) => onChange("keadaan", event.target.value)}
            placeholder="Masukkan keadaan umum"
            rows={3}
          />
        </CardContent>
      </Card>

      <Card className="p-0 gap-0">
        <CardHeader className="bg-secondary/10">
          <CardTitle className="text-md font-medium text-secondary py-2">
            Kesadaran
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <Select
            value={values.kesadaran}
            onValueChange={(value) => onChange("kesadaran", value || "")}
          >
            <SelectTrigger id="kesadaran">
              <SelectValue placeholder="Pilih tingkat kesadaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="COMPOS_MENTIS">Compos Mentis</SelectItem>
              <SelectItem value="APATIS">Apatis</SelectItem>
              <SelectItem value="SOMNOLEN">Somnolen</SelectItem>
              <SelectItem value="SOPOR">Sopor</SelectItem>
              <SelectItem value="KOMA">Koma</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="p-0 gap-0">
        <CardHeader className="bg-secondary/10">
          <CardTitle className="text-md font-medium text-secondary py-2">
            Vital Signs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="respirasi" className="text-sm text-gray-700">
                Respirasi (kali/menit)
              </Label>
              <Input
                id="respirasi"
                type="number"
                min="0"
                value={values.respirasi}
                onChange={(event) => onChange("respirasi", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="suhu" className="text-sm text-gray-700">
                Suhu (°C)
              </Label>
              <Input
                id="suhu"
                type="number"
                min="0"
                step="0.1"
                value={values.suhu}
                onChange={(event) => onChange("suhu", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="nadi" className="text-sm text-gray-700">
                Nadi (kali/menit)
              </Label>
              <Input
                id="nadi"
                type="number"
                min="0"
                value={values.nadi}
                onChange={(event) => onChange("nadi", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-gray-700">Sistol/Diastol (mmHg)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="sistol"
                  type="number"
                  min="0"
                  value={values.sistol}
                  onChange={(event) => onChange("sistol", event.target.value)}
                  placeholder="Sistol"
                />
                <span className="text-gray-500">/</span>
                <Input
                  id="diastol"
                  type="number"
                  min="0"
                  value={values.diastol}
                  onChange={(event) => onChange("diastol", event.target.value)}
                  placeholder="Diastol"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
