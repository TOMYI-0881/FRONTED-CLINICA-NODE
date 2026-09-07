import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { TurnPriority } from "@/interfaces/queue.interface";
import { useCheckIn } from "../hooks/useCheckIn";
import { cn } from "@/lib/utils";
import { UserPlus } from "lucide-react";

interface Props {
  doctorId: string;
  title?: string;
}

const priorityPill = (selected: boolean) =>
  cn(
    "flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
    selected
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
  );

export const CheckInForm = ({ doctorId, title }: Props) => {
  const [patientName, setPatientName] = useState("");
  const [priority, setPriority] = useState<TurnPriority>("normal");
  const checkIn = useCheckIn(doctorId);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!patientName.trim()) return;

    checkIn.mutate(
      { doctorId, patientName: patientName.trim(), priority },
      { onSuccess: () => setPatientName("") },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[22px] border border-frost-edge bg-card p-6 shadow-sm backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-coral/15 text-coral">
          <UserPlus className="size-5" />
        </span>
        <div>
          <h3 className="font-display text-base font-bold text-foreground">
            {title ?? "Check-in walk-in"}
          </h3>
          <p className="text-xs text-muted-foreground">
            Sumá a un paciente sin cita previa.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <Label htmlFor="patientName" className="mb-2">
            Nombre del paciente
          </Label>
          <Input
            id="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Nombre y apellido"
            required
          />
        </div>

        <div>
          <Label className="mb-2">Prioridad</Label>
          <RadioGroup
            value={priority}
            onValueChange={(value) => setPriority(value as TurnPriority)}
            className="grid grid-cols-2 gap-2"
          >
            <label className={priorityPill(priority === "normal")}>
              <RadioGroupItem value="normal" className="sr-only" />
              Normal
            </label>
            <label className={priorityPill(priority === "preferente")}>
              <RadioGroupItem value="preferente" className="sr-only" />
              Preferente
            </label>
          </RadioGroup>
        </div>

        <Button
          type="submit"
          className="w-full rounded-full py-2.5"
          disabled={checkIn.isPending}
        >
          {checkIn.isPending ? "Enviando..." : "Hacer check-in"}
        </Button>
      </div>
    </form>
  );
};