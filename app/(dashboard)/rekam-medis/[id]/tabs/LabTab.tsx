import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface LabTabProps {
  value: string;
  onChange: (value: string) => void;
}

export function LabTab({ value, onChange }: LabTabProps) {
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="bg-secondary/10">
        <CardTitle className="text-md font-medium text-secondary py-2">
          Permintaan Pemeriksaan Laboratorium
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex flex-col gap-2">
        <Label
          htmlFor="permintaanPemeriksaanLaboratorium"
          className="text-xs uppercase tracking-wide text-gray-500 font-semibold"
        >
          Permintaan Pemeriksaan Laboratorium
        </Label>
        <Textarea
          id="permintaanPemeriksaanLaboratorium"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          placeholder="Masukkan permintaan pemeriksaan laboratorium"
        />
      </CardContent>
    </Card>
  );
}
