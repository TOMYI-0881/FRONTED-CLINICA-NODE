import { Link } from "react-router";
import { CalendarCheck2, CalendarClock, Clock3, ListChecks, MonitorPlay, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/auth/store/auth.store";
import { useMyDoctorProfile } from "@/doctors/hooks/useMyDoctorProfile";
import { useQueue } from "@/queues/hooks/useQueue";
import { todayApiDate } from "@/lib/format-date";
import { DoctorPatientsCarousel } from "../components/DoctorPatientsCarousel";

const formatGreetingDate = (date: Date) =>
  date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

export const DoctorHome = () => {
  const user = useAuthStore((state) => state.user);
  const { doctor } = useMyDoctorProfile();
  const today = todayApiDate();
  const { data: queue, isLoading: isLoadingQueue } = useQueue(
    doctor?.id,
    today,
  );

  const todayTurns = queue
    ? [queue.current, ...queue.waiting].filter((turn) => turn !== null)
    : [];

  const firstName = user?.email.split("@")[0] ?? "Doctor/a";

  return (
    <>
      <section className="animate-fade-up">
        <p className="text-xs font-bold uppercase text-primary">
          Panel del doctor
        </p>
        <h1 className="mt-1 font-display text-3xl font-extrabold">
          Hola, {doctor?.name.split(" ")[0] ?? firstName}
        </h1>
        <p className="mt-1 text-sm capitalize text-muted-foreground">
          {formatGreetingDate(new Date())}
        </p>
      </section>

      <section className="mt-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-primary">Hoy</p>
            <h2 className="mt-1 font-display text-xl font-bold md:text-2xl">
              Pacientes de hoy
            </h2>
          </div>
          <Link
            to="/doctor/queue"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:underline"
          >
            <CalendarClock className="size-4" />
            Controlar cola
          </Link>
        </div>
        <DoctorPatientsCarousel
          turns={todayTurns}
          isLoading={isLoadingQueue}
        />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[22px] border border-frost-edge bg-card p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Turno actual
              </p>
              {isLoadingQueue ? (
                <Skeleton className="mt-2 h-9 w-12" />
              ) : (
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                  {queue?.current?.number ?? "—"}
                </p>
              )}
            </div>
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-coral-light/60 text-coral">
              <MonitorPlay className="size-5" />
            </span>
          </div>
        </div>

        <div className="rounded-[22px] border border-frost-edge bg-card p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                En espera
              </p>
              {isLoadingQueue ? (
                <Skeleton className="mt-2 h-9 w-12" />
              ) : (
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                  {queue?.waiting.length ?? 0}
                </p>
              )}
            </div>
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-coral-light/60 text-coral">
              <ListChecks className="size-5" />
            </span>
          </div>
        </div>

        <div className="rounded-[22px] border border-frost-edge bg-card p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Especialidad
              </p>
              <p className="mt-2 truncate text-xl font-semibold tracking-tight text-foreground">
                {doctor?.specialty ?? "—"}
              </p>
            </div>
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-coral-light/60 text-coral">
              <Clock3 className="size-5" />
            </span>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-[22px] border border-frost-edge bg-card p-5 shadow-sm backdrop-blur-xl">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
          <Radio className="size-5 text-primary" />
          Tu jornada
        </h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link to="/doctor/queue">
            <Button className="w-full rounded-xl">
              <ListChecks />
              Ver mi cola
            </Button>
          </Link>
          <Link to="/doctor/appointments">
            <Button variant="frost" className="w-full rounded-xl">
              <CalendarCheck2 />
              Mis citas
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};