import { useSearchParams } from "react-router";
import { AdminTitle } from "@/admin/components/AdminTitle";
import { useDoctors } from "@/doctors/hooks/useDoctors";
import { useQueue } from "@/queues/hooks/useQueue";
import { CurrentTurnCard } from "@/queues/components/CurrentTurnCard";
import { WaitingList } from "@/queues/components/WaitingList";
import { QueueControls } from "@/queues/components/QueueControls";
import { CheckInForm } from "@/queues/components/CheckInForm";
import { DoctorAvatar } from "@/components/doctor/DoctorAvatar";
import { Skeleton } from "@/components/ui/skeleton";
import { todayApiDate } from "@/lib/format-date";
import { formatDoctorName } from "@/lib/format-doctor-name";
import { cn } from "@/lib/utils";
import { Radio, UsersRound } from "lucide-react";

export const AdminQueueControlPage = () => {
  const { data: doctors, isLoading: isLoadingDoctors } = useDoctors();
  const [searchParams, setSearchParams] = useSearchParams();
  const doctorId = searchParams.get("doctorId") ?? undefined;
  const doctor = doctors?.find((d) => d.id === doctorId);
  const today = todayApiDate();

  const { data: queue, isLoading } = useQueue(doctorId, today);
  const waitingCount = queue?.waiting.length ?? 0;

  return (
    <main className="flex-1 space-y-6 p-4 md:space-y-8 md:p-8">
      <div className="animate-fade-up">
        <AdminTitle
          title="Control de cola"
          description="Elegí un doctor para ver su cola de hoy y operarla."
        />
      </div>

      <div
        className="grid animate-fade-up grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]"
        style={{ animationDelay: "80ms" }}
      >
        <aside className="space-y-3 self-start rounded-[22px] border border-frost-edge bg-card p-3 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-2 px-1 pt-1">
            <span className="grid size-8 place-items-center rounded-lg bg-coral/15 text-coral">
              <Radio className="size-4" />
            </span>
            <h2 className="font-display text-sm font-bold text-foreground">
              Doctores
            </h2>
          </div>

          {isLoadingDoctors &&
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl border border-frost-edge p-3"
              >
                <Skeleton className="size-9 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}

          {doctors?.map((d) => {
            const selected = d.id === doctorId;
            return (
              <button
                key={d.id}
                onClick={() => setSearchParams({ doctorId: d.id })}
                aria-pressed={selected}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                  selected
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:border-frost-edge hover:bg-frost/60",
                )}
              >
                <DoctorAvatar
                  name={d.name}
                  photoUrl={d.photoUrl}
                  className="size-9 shrink-0 rounded-full ring-1 ring-frost-edge"
                  initialsClassName="text-xs"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {formatDoctorName(d)}
                  </span>
                  <span
                    className={cn(
                      "block truncate text-xs",
                      selected ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {d.specialty}
                  </span>
                </span>
                {selected && (
                  <span className="size-2 shrink-0 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </aside>

        <div className="space-y-6">
          {!doctorId ? (
            <div className="rounded-[22px] border border-frost-edge bg-card p-10 text-center shadow-sm backdrop-blur-xl">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-coral/15 text-coral">
                <UsersRound className="size-6" />
              </span>
              <h2 className="mt-4 font-display text-lg font-bold">
                Seleccioná un doctor
              </h2>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                Elegí un doctor del panel para ver y operar su cola de hoy.
              </p>
            </div>
          ) : doctor === undefined && !isLoadingDoctors ? (
            <div className="rounded-[22px] border border-frost-edge bg-card p-6 text-center shadow-sm backdrop-blur-xl">
              <p className="text-sm font-medium text-destructive">
                Ese doctor ya no está activo.
              </p>
            </div>
          ) : (
            <>
              <CurrentTurnCard
                turn={isLoading ? null : (queue?.current ?? null)}
              />
              <QueueControls
                doctorId={doctorId}
                currentTurn={queue?.current ?? null}
              />
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <h2 className="font-display text-base font-bold text-foreground">
                    En espera
                  </h2>
                  <span className="rounded-full bg-coral/15 px-2.5 py-0.5 font-display text-xs font-bold text-coral">
                    {waitingCount}
                  </span>
                </div>
                <WaitingList waiting={queue?.waiting ?? []} />
              </div>
              <CheckInForm
                doctorId={doctorId}
                title="Check-in walk-in (sin cita previa)"
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
};