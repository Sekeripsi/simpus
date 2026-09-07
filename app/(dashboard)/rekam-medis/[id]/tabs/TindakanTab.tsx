import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TindakanTabProps {
  value: string;
  onChange: (value: string) => void;
}

export function TindakanTab({ value, onChange }: TindakanTabProps) {
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="bg-secondary/10">
        <CardTitle className="text-md font-medium text-secondary py-2">
          Terapi Tindakan
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex flex-col gap-2">
        <Label
          htmlFor="tindakan"
          className="text-xs uppercase tracking-wide text-gray-500 font-semibold"
        >
          Tindakan
        </Label>
        <Textarea
          id="tindakan"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Masukkan tindakan"
          rows={3}
        />
      </CardContent>
    </Card>
  );
}
