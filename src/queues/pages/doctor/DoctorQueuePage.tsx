import { Radio, Users } from "lucide-react";
import { useMyDoctorProfile } from "@/doctors/hooks/useMyDoctorProfile";
import { useQueue } from "@/queues/hooks/useQueue";
import { CurrentTurnCard } from "@/queues/components/CurrentTurnCard";
import { WaitingList } from "@/queues/components/WaitingList";
import { QueueControls } from "@/queues/components/QueueControls";
import { CheckInForm } from "@/queues/components/CheckInForm";
import { todayApiDate } from "@/lib/format-date";

const formatGreetingDate = (date: Date) =>
  date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

export const DoctorQueuePage = () => {
  const { doctor, isLoading: isLoadingDoctor } = useMyDoctorProfile();
  const today = todayApiDate();
  const { data: queue, isLoading } = useQueue(doctor?.id, today);

  if (!isLoadingDoctor && !doctor) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-10 lg:px-8">
        <div className="rounded-[22px] border border-frost-edge bg-card p-8 text-center text-muted-foreground shadow-sm backdrop-blur-xl">
          No encontramos tu perfil de doctor.
        </div>
      </div>
    );
  }

  const currentTurn = isLoading ? null : (queue?.current ?? null);
  const waitingCount = queue?.waiting.length ?? 0;
  const doctorName = doctor?.name?.split(" ")[0] ?? "Doctor/a";

  return (
    <div className="container mx-auto max-w-5xl space-y-8 px-4 py-8 md:py-10 lg:px-8">
      <section className="animate-fade-up">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-primary">
              Panel del doctor
            </p>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-foreground">
              Hola, {doctorName}
            </h1>
            <p className="mt-1 text-sm capitalize text-muted-foreground">
              {formatGreetingDate(new Date())}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-frost-edge bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur-xl">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-coral opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-coral" />
            </span>
            Cola en vivo
          </span>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section
            className="animate-fade-up grid gap-4 sm:grid-cols-2"
            style={{ animationDelay: "70ms" }}
          >
            <div className="rounded-[22px] border border-frost-edge bg-card p-5 shadow-sm backdrop-blur-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Turno actual
                  </p>
                  <p className="mt-2 font-display text-3xl font-extrabold tracking-tight text-foreground">
                    {currentTurn ? `#${currentTurn.number}` : "—"}
                  </p>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-coral/15 text-coral">
                  <Radio className="size-5" />
                </span>
              </div>
            </div>

            <div className="rounded-[22px] border border-frost-edge bg-card p-5 shadow-sm backdrop-blur-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    En espera
                  </p>
                  <p className="mt-2 font-display text-3xl font-extrabold tracking-tight text-foreground">
                    {waitingCount}
                  </p>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-coral/15 text-coral">
                  <Users className="size-5" />
                </span>
              </div>
            </div>
          </section>

          <section
            className="animate-fade-up"
            style={{ animationDelay: "140ms" }}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-foreground">
                Turno en curso
              </h2>
              <span className="text-xs text-muted-foreground">
                Se actualiza solo, en tiempo real
              </span>
            </div>
            <CurrentTurnCard turn={currentTurn} />
          </section>

          <section
            className="animate-fade-up rounded-[22px] border border-frost-edge bg-card p-6 shadow-sm backdrop-blur-xl"
            style={{ animationDelay: "210ms" }}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-foreground">
                Control de la cola
              </h2>
              <span className="hidden text-xs text-muted-foreground sm:inline">
                Llamá al siguiente turno
              </span>
            </div>
            {doctor && (
              <QueueControls doctorId={doctor.id} currentTurn={currentTurn} />
            )}
          </section>

          <section
            className="animate-fade-up"
            style={{ animationDelay: "280ms" }}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-foreground">
                En espera
              </h2>
              <span className="rounded-full bg-coral/10 px-2.5 py-1 text-xs font-bold text-coral">
                {waitingCount}
              </span>
            </div>
            <WaitingList waiting={queue?.waiting ?? []} />
          </section>
        </div>

        <aside className="space-y-6">
          {doctor && (
            <section
              className="animate-fade-up"
              style={{ animationDelay: "350ms" }}
            >
              <CheckInForm doctorId={doctor.id} title="Check-in walk-in" />
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};