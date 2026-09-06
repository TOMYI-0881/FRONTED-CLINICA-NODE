import { useSearchParams } from "react-router";
import { AdminTitle } from "@/admin/components/AdminTitle";
import { useDoctors } from "@/doctors/hooks/useDoctors";
import { useQueue } from "@/queues/hooks/useQueue";
import { CurrentTurnCard } from "@/queues/components/CurrentTurnCard";
import { WaitingList } from "@/queues/components/WaitingList";
import { QueueControls } from "@/queues/components/QueueControls";
import { CheckInForm } from "@/queues/components/CheckInForm";
import { todayApiDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

export const AdminQueueControlPage = () => {
  const { data: doctors, isLoading: isLoadingDoctors } = useDoctors();
  const [searchParams, setSearchParams] = useSearchParams();
  const doctorId = searchParams.get("doctorId") ?? undefined;
  const doctor = doctors?.find((d) => d.id === doctorId);
  const today = todayApiDate();

  const { data: queue, isLoading } = useQueue(doctorId, today);

  return (
    <div className="p-4 md:p-8">
      <AdminTitle
        title="Control de cola"
        description="Elegí un doctor para ver su cola de hoy y operarla."
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-1">
          {isLoadingDoctors && (
            <p className="text-sm text-muted-foreground">Cargando doctores...</p>
          )}
          {doctors?.map((d) => (
            <button
              key={d.id}
              onClick={() => setSearchParams({ doctorId: d.id })}
              className={cn(
                "w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                doctorId === d.id
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-foreground",
              )}
            >
              <p className="font-medium">{d.name}</p>
              <p
                className={cn(
                  "text-xs",
                  doctorId === d.id
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground",
                )}
              >
                {d.specialty}
              </p>
            </button>
          ))}
        </aside>

        <div className="space-y-6">
          {!doctorId ? (
            <p className="text-sm text-muted-foreground">
              Seleccioná un doctor para ver su cola.
            </p>
          ) : (
            <>
              <CurrentTurnCard turn={isLoading ? null : (queue?.current ?? null)} />
              <QueueControls doctorId={doctorId} currentTurn={queue?.current ?? null} />
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">
                  En espera
                </h2>
                <WaitingList waiting={queue?.waiting ?? []} />
              </div>
              <CheckInForm doctorId={doctorId} title="Check-in walk-in (sin cita previa)" />
            </>
          )}
          {doctor === undefined && doctorId && !isLoadingDoctors && (
            <p className="text-sm text-destructive">Ese doctor ya no está activo.</p>
          )}
        </div>
      </div>
    </div>
  );
};
