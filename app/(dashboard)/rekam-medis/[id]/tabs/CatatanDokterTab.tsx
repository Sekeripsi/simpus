import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CatatanDokterTabProps {
  value: string;
  namaDokter: string;
  onChange: (value: string) => void;
}

export function CatatanDokterTab({
  value,
  namaDokter,
  onChange,
}: CatatanDokterTabProps) {
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="bg-secondary/10">
        <CardTitle className="text-md font-medium text-secondary py-2">
          Catatan Dokter
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex flex-col gap-2">
        <Label
          htmlFor="catatanDokter"
          className="text-xs uppercase tracking-wide text-gray-500 font-semibold"
        >
          Catatan Dokter
        </Label>
        <Textarea
          id="catatanDokter"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={6}
          placeholder="Masukkan catatan dokter untuk kunjungan ini"
        />
        {namaDokter && (
          <p className="text-xs text-gray-500">Dicatat oleh {namaDokter}</p>
        )}
      </CardContent>
    </Card>
  );
}
