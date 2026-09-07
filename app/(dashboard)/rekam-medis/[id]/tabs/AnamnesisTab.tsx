import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface AnamnesisTabProps {
  keluhan: string;
  onKeluhanChange: (value: string) => void;
}

export function AnamnesisTab({
  keluhan,
  onKeluhanChange,
}: AnamnesisTabProps) {
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="bg-secondary/10">
        <CardTitle className="text-md font-medium text-secondary py-2">
          Keluhan
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <Textarea
          value={keluhan}
          onChange={(event) => onKeluhanChange(event.target.value)}
          placeholder="Masukkan keluhan"
          rows={3}
        />
      </CardContent>
    </Card>
  );
}
