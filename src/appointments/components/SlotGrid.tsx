import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Slot } from "@/interfaces/appointment.interface";
import { formatTimeLocal } from "@/lib/format-date";

interface Props {
  slots: Slot[];
  isLoading: boolean;
  selected: Slot | null;
  onSelect: (slot: Slot) => void;
}

export const SlotGrid = ({ slots, isLoading, selected, onSelect }: Props) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay horarios disponibles para esta fecha.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {slots.map((slot) => (
        <Button
          key={slot.startTime}
          type="button"
          variant={selected?.startTime === slot.startTime ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(slot)}
        >
          {formatTimeLocal(slot.startTime)}
        </Button>
      ))}
    </div>
  );
};
