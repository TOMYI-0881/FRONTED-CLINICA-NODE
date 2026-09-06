import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyAppointments } from "@/appointments/hooks/useMyAppointments";
import { AppointmentStatusBadge } from "@/appointments/components/AppointmentStatusBadge";
import { RequestCancellationDialog } from "@/appointments/components/RequestCancellationDialog";
import { formatDateTimeLocal } from "@/lib/format-date";

export const DoctorAppointmentsPage = () => {
  const { data: appointments, isLoading } = useMyAppointments();
  const [targetId, setTargetId] = useState<string | null>(null);

  const sorted = [...(appointments ?? [])].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );

  return (
    <div className="max-w-3xl space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Mis citas
        </h1>
        <p className="text-sm text-muted-foreground">
          Elegí una cita confirmada para pedir su cancelación.
        </p>
      </div>

      <div className="space-y-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}

        {!isLoading && sorted.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No tenés citas registradas.
          </p>
        )}

        {sorted.map((appointment) => (
          <Card key={appointment.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-foreground">
                  {formatDateTimeLocal(appointment.startTime)}
                </p>
                {appointment.patientEmail && (
                  <p className="truncate text-xs text-muted-foreground">
                    {appointment.patientEmail}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <AppointmentStatusBadge status={appointment.status} />
                {appointment.status === "CONFIRMED" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setTargetId(appointment.id)}
                  >
                    Pedir cancelación
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {targetId && (
        <RequestCancellationDialog
          open={!!targetId}
          onOpenChange={(open) => !open && setTargetId(null)}
          appointmentId={targetId}
        />
      )}
    </div>
  );
};
