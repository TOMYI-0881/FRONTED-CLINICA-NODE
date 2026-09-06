import { useParams } from "react-router";
import { useAuthStore } from "@/auth/store/auth.store";
import { useDoctors } from "@/doctors/hooks/useDoctors";
import { useMyAppointments } from "@/appointments/hooks/useMyAppointments";
import { useQueue } from "@/queues/hooks/useQueue";
import { CurrentTurnCard } from "@/queues/components/CurrentTurnCard";
import { WaitingList } from "@/queues/components/WaitingList";
import { CheckInForm } from "@/queues/components/CheckInForm";
import { todayApiDate } from "@/lib/format-date";

export const QueueLivePage = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { data: doctors } = useDoctors();
  const doctor = doctors?.find((d) => d.id === doctorId);

  const isPatient = useAuthStore((state) => state.user?.role === "PATIENT");
  const { data: myAppointments } = useMyAppointments(isPatient);

  const today = todayApiDate();
  const { data: queue, isLoading } = useQueue(doctorId, today);

  const todaysAppointment = myAppointments?.find(
    (apt) =>
      apt.doctorId === doctorId &&
      apt.status === "CONFIRMED" &&
      apt.startTime.slice(0, 10) === today,
  );

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Cola en vivo{doctor ? ` · ${doctor.name}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground">
          Se actualiza automáticamente en tiempo real.
        </p>
      </div>

      <div className="space-y-6">
        <CurrentTurnCard turn={isLoading ? null : (queue?.current ?? null)} />

        <div>
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            En espera
          </h2>
          <WaitingList waiting={queue?.waiting ?? []} />
        </div>

        {isPatient && doctorId && (
          <CheckInForm
            doctorId={doctorId}
            appointmentId={todaysAppointment?.id}
            title={
              todaysAppointment
                ? "Hacer check-in con tu cita de hoy"
                : "Hacer check-in sin cita previa"
            }
          />
        )}
      </div>
    </div>
  );
};
