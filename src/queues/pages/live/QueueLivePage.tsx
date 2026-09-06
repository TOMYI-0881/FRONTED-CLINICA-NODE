import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/auth/store/auth.store";
import { useDoctors } from "@/doctors/hooks/useDoctors";
import { useMyAppointments } from "@/appointments/hooks/useMyAppointments";
import { useQueue } from "@/queues/hooks/useQueue";
import { CurrentTurnCard } from "@/queues/components/CurrentTurnCard";
import { WaitingList } from "@/queues/components/WaitingList";
import { MyTurnCard } from "@/queues/components/MyTurnCard";
import { DoctorHero } from "@/appointments/components/DoctorHero";
import { todayApiDate } from "@/lib/format-date";
import { Activity, ArrowRight, CalendarDays, MousePointerClick, Users } from "lucide-react";

const STEPS = [
  "Tomá tu turno o reservá una cita",
  "Esperá en la sala de espera",
  "Escuchá tu llamado y pasá al consultorio",
];

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
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-10 lg:px-8">
      {doctor ? (
        <DoctorHero doctor={doctor} showLiveCta={false} />
      ) : (
        <div className="h-44 animate-pulse rounded-[26px] border border-frost-edge bg-card" />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="animate-fade-up">
            <h2 className="font-display text-lg font-bold text-foreground">
              Cola en vivo
            </h2>
            <p className="text-sm text-muted-foreground">
              Se actualiza automáticamente en tiempo real.
            </p>
            <div className="mt-4">
              <CurrentTurnCard turn={isLoading ? null : (queue?.current ?? null)} />
            </div>
          </div>

          <section className="animate-fade-up" style={{ animationDelay: "70ms" }}>
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              En espera
            </h2>
            <WaitingList waiting={queue?.waiting ?? []} />
          </section>

          <div
            className="animate-fade-up"
            style={{ animationDelay: "140ms" }}
          >
            {isPatient && doctorId && (queue?.myTurn ? (
              <MyTurnCard turn={queue.myTurn} />
            ) : todaysAppointment ? (
              <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
                Tu cita de hoy está confirmada. Tu turno en la cola ya fue asignado
                automáticamente al momento de reservar.
              </div>
            ) : (
              <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
                Sin cita previa no podés sumarte solo a la cola. El ingreso sin
                turno lo gestiona el médico o recepción.
              </div>
            ))}
          </div>
        </div>

        {doctor && (
          <aside className="space-y-6">
            <div
              className="animate-fade-up rounded-[22px] border border-frost-edge bg-card p-6 shadow-sm backdrop-blur-xl transition-transform hover:-translate-y-1"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-coral/15 text-coral">
                <Activity className="size-5" />
              </span>
              <div className="mt-4 flex items-center gap-2">
                <span className="relative flex size-2.5 shrink-0">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-coral opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-coral" />
                </span>
                <h2 className="font-display text-base font-bold text-foreground">
                  Cola en vivo
                </h2>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Se actualiza solo, sin recargar.
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <dt className="inline-flex items-center gap-2 text-muted-foreground">
                    <Users className="size-3.5" />
                    En espera
                  </dt>
                  <dd className="font-semibold text-foreground">
                    {queue?.waiting.length ?? 0}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="inline-flex items-center gap-2 text-muted-foreground">
                    <Activity className="size-3.5" />
                    Turno actual
                  </dt>
                  <dd className="font-semibold text-foreground">
                    {queue?.current ? `#${queue.current.number}` : "—"}
                  </dd>
                </div>
              </dl>
            </div>

            <div
              className="animate-fade-up rounded-[22px] border border-frost-edge bg-card p-6 shadow-sm backdrop-blur-xl transition-transform hover:-translate-y-1"
              style={{ animationDelay: "210ms" }}
            >
              <span className="grid size-10 place-items-center rounded-xl bg-coral/15 text-coral">
                <MousePointerClick className="size-5" />
              </span>
              <h2 className="mt-4 font-display text-base font-bold text-foreground">
                Cómo funciona la cola
              </h2>
              <ol className="mt-3 space-y-3">
                {STEPS.map((step, index) => (
                  <li key={step} className="flex items-start gap-3 text-sm">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <span className="pt-0.5 text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div
              className="animate-fade-up"
              style={{ animationDelay: "280ms" }}
            >
              <Link to={`/doctors/${doctor.id}`} className="block">
                <Button variant="frost" className="w-full rounded-full py-2.5">
                  <CalendarDays className="size-4" />
                  Reservar turno
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};