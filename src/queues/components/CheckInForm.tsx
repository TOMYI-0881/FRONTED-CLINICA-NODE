import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { TurnPriority } from "@/interfaces/queue.interface";
import { useCheckIn } from "../hooks/useCheckIn";

interface Props {
  doctorId: string;
  appointmentId?: string;
  title?: string;
}

export const CheckInForm = ({ doctorId, appointmentId, title }: Props) => {
  const [patientName, setPatientName] = useState("");
  const [priority, setPriority] = useState<TurnPriority>("normal");
  const checkIn = useCheckIn(doctorId);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!patientName.trim()) return;

    checkIn.mutate(
      { doctorId, patientName: patientName.trim(), priority, appointmentId },
      { onSuccess: () => setPatientName("") },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border p-4">
      {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}

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
          className="flex gap-4"
        >
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="normal" /> Normal
          </label>
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="preferente" /> Preferente
          </label>
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full" disabled={checkIn.isPending}>
        {checkIn.isPending ? "Enviando..." : "Hacer check-in"}
      </Button>
    </form>
  );
};
