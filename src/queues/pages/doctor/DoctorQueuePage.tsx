import { useMyDoctorProfile } from "@/doctors/hooks/useMyDoctorProfile";
import { useQueue } from "@/queues/hooks/useQueue";
import { CurrentTurnCard } from "@/queues/components/CurrentTurnCard";
import { WaitingList } from "@/queues/components/WaitingList";
import { QueueControls } from "@/queues/components/QueueControls";
import { CheckInForm } from "@/queues/components/CheckInForm";
import { todayApiDate } from "@/lib/format-date";

export const DoctorQueuePage = () => {
  const { doctor, isLoading: isLoadingDoctor } = useMyDoctorProfile();
  const today = todayApiDate();
  const { data: queue, isLoading } = useQueue(doctor?.id, today);

  if (!isLoadingDoctor && !doctor) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No encontramos tu perfil de doctor.
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Mi cola de hoy
        </h1>
        <p className="text-sm text-muted-foreground">{doctor?.name}</p>
      </div>

      <CurrentTurnCard turn={isLoading ? null : (queue?.current ?? null)} />

      {doctor && <QueueControls doctorId={doctor.id} currentTurn={queue?.current ?? null} />}

      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground">En espera</h2>
        <WaitingList waiting={queue?.waiting ?? []} />
      </div>

      {doctor && (
        <CheckInForm doctorId={doctor.id} title="Check-in walk-in (sin cita previa)" />
      )}
    </div>
  );
};
