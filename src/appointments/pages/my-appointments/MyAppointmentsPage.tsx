import { useMyAppointments } from "@/appointments/hooks/useMyAppointments";
import { AppointmentRow } from "@/appointments/components/AppointmentRow";
import { useDoctors } from "@/doctors/hooks/useDoctors";
import { Skeleton } from "@/components/ui/skeleton";

export const MyAppointmentsPage = () => {
  const { data: appointments, isLoading } = useMyAppointments();
  const { data: doctors } = useDoctors();

  const sorted = [...(appointments ?? [])].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
  );

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Mis turnos
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Historial de tus reservas, incluidas las canceladas.
      </p>

      <div className="mt-6 space-y-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}

        {!isLoading && sorted.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Todavía no reservaste ningún turno.
          </p>
        )}

        {sorted.map((appointment) => (
          <AppointmentRow
            key={appointment.id}
            appointment={appointment}
            doctor={doctors?.find((d) => d.id === appointment.doctorId)}
          />
        ))}
      </div>
    </div>
  );
};
