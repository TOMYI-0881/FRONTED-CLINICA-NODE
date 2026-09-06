import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/custom/ConfirmDialog";
import type { Appointment } from "@/interfaces/appointment.interface";
import type { Doctor } from "@/interfaces/doctor.interface";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import { formatDateTimeLocal } from "@/lib/format-date";
import { useCancelAppointment } from "../hooks/useCancelAppointment";
import { todayApiDate } from "@/lib/format-date";
import { Radio, X } from "lucide-react";

interface Props {
  appointment: Appointment;
  doctor?: Doctor;
}

export const AppointmentRow = ({ appointment, doctor }: Props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const cancelMutation = useCancelAppointment();

  const isToday = appointment.startTime.slice(0, 10) === todayApiDate();
  const canCancel = appointment.status === "CONFIRMED";

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-foreground">
            {doctor?.name ?? "Doctor"}
          </p>
          <p className="text-sm text-muted-foreground">{doctor?.specialty}</p>
          <p className="mt-1 text-sm text-foreground">
            {formatDateTimeLocal(appointment.startTime)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AppointmentStatusBadge status={appointment.status} />

          {appointment.status === "CONFIRMED" && isToday && (
            <Link to={`/doctors/${appointment.doctorId}/queue`}>
              <Button variant="outline" size="sm">
                <Radio className="size-4" />
                Check-in
              </Button>
            </Link>
          )}

          {canCancel && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setConfirmOpen(true)}
            >
              <X className="size-4" />
              Cancelar
            </Button>
          )}
        </div>
      </CardContent>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="¿Cancelar este turno?"
        description="Esta acción cancela tu turno de inmediato y libera el horario para otro paciente."
        confirmLabel="Sí, cancelar"
        variant="destructive"
        onConfirm={() => {
          cancelMutation.mutate(appointment.id);
          setConfirmOpen(false);
        }}
      />
    </Card>
  );
};
