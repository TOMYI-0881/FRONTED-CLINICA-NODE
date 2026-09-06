import { Input } from "@/components/ui/input";
import { todayApiDate } from "@/lib/format-date";

interface Props {
  value: string;
  onChange: (date: string) => void;
}

export const DateField = ({ value, onChange }: Props) => {
  return (
    <div>
      <label className="text-sm font-semibold">Fecha</label>
      <Input
        type="date"
        value={value}
        min={todayApiDate()}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-10 w-full max-w-[200px]"
      />
    </div>
  );
};
