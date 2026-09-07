import { useQuery } from "@tanstack/react-query";
import {
  CalendarCheck,
  CalendarCheck2,
  CalendarClock,
  ClipboardList,
  PieChart,
  Stethoscope,
  UsersRound,
} from "lucide-react";

import StatCard from "@/admin/components/componentsDashboard/StatCard";
import QuickActions from "@/admin/components/componentsDashboard/QuickActions";
import { useAuthStore } from "@/auth/store/auth.store";
import { getDashboardStatsAction } from "@/admin/actions/get-dashboard-stats.action";
import type { AppointmentStatus } from "@/interfaces/appointment.interface";

const formatGreetingDate = (date: Date) =>
  date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

const STATUS_ROWS: {
  key: AppointmentStatus;
  label: string;
  dot: string;
  bar: string;
}[] = [
  { key: "CONFIRMED", label: "Confirmadas", dot: "bg-primary", bar: "bg-primary" },
  {
    key: "CANCELLATION_REQUESTED",
    label: "En revisión",
    dot: "bg-coral",
    bar: "bg-coral",
  },
  {
    key: "COMPLETED",
    label: "Completadas",
    dot: "bg-foreground/60",
    bar: "bg-foreground/60",
  },
  {
    key: "CANCELLED",
    label: "Canceladas",
    dot: "bg-muted-foreground/40",
    bar: "bg-muted-foreground/40",
  },
];

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: getDashboardStatsAction,
  });

  const firstName = user?.email.split("@")[0] ?? "Admin";
  const byStatus: Record<AppointmentStatus, number> =
    stats?.citasPorEstado ?? {
      CONFIRMED: 0,
      CANCELLATION_REQUESTED: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
  const maxByStatus = Math.max(...STATUS_ROWS.map((row) => byStatus[row.key] ?? 0), 1);

  return (
    <main className="flex-1 space-y-6 p-4 md:space-y-8 md:p-8">
      <section className="animate-fade-up">
        <p className="text-xs font-bold uppercase text-primary">
          Panel de administración
        </p>
        <h1 className="mt-1 font-display text-3xl font-extrabold">
          Hola, {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen general del sistema de reservas.
        </p>
        <p className="mt-1 text-sm capitalize text-muted-foreground">
          {formatGreetingDate(new Date())}
        </p>
      </section>

      <section
        className="grid animate-fade-up grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5"
        style={{ animationDelay: "80ms" }}
      >
        <StatCard
          title="Doctores activos"
          value={stats?.totalDoctoresActivos ?? "—"}
          icon={Stethoscope}
          loading={isLoading}
        />
        <StatCard
          title="Pacientes registrados"
          value={stats?.totalPacientes ?? "—"}
          icon={UsersRound}
          loading={isLoading}
        />
        <StatCard
          title="Citas totales"
          value={stats?.totalCitas ?? "—"}
          icon={CalendarCheck2}
          loading={isLoading}
        />
        <StatCard
          title="Citas de hoy"
          value={stats?.citasHoy ?? "—"}
          icon={CalendarClock}
          loading={isLoading}
        />
        <StatCard
          title="Próximas citas"
          value={stats?.proximasCitas ?? "—"}
          icon={CalendarCheck}
          loading={isLoading}
        />
        <StatCard
          title="Cancelaciones pendientes"
          value={stats?.cancelacionesPendientes ?? "—"}
          icon={ClipboardList}
          loading={isLoading}
        />
      </section>

      <section
        className="grid animate-fade-up gap-4 md:gap-5 lg:grid-cols-2"
        style={{ animationDelay: "160ms" }}
      >
        <div className="rounded-[22px] border border-frost-edge bg-card p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-coral/15 text-coral">
              <PieChart className="size-5" />
            </span>
            <div>
              <h2 className="font-display text-base font-bold">Citas por estado</h2>
              <p className="text-xs text-muted-foreground">
                Proporción sobre el total de reservas.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {isLoading
              ? STATUS_ROWS.map((row, index) => (
                  <div key={row.key} className="space-y-1.5">
                    <div className="h-3.5 w-32 animate-pulse rounded-full bg-muted" />
                    <div
                      className="h-2.5 animate-pulse rounded-full bg-muted"
                      style={{ width: `${[90, 60, 40, 20][index]}%` }}
                    />
                  </div>
                ))
              : STATUS_ROWS.map((row) => {
                  const count = byStatus[row.key] ?? 0;
                  const width = Math.round((count / maxByStatus) * 100);
                  return (
                    <div key={row.key}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-medium text-muted-foreground">
                          <span className={`size-2 rounded-full ${row.dot}`} />
                          {row.label}
                        </span>
                        <span className="font-display text-base font-bold">
                          {count}
                        </span>
                      </div>
                      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full ${row.bar}`}
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>

        <div className="space-y-4">
          <QuickActions />
        </div>
      </section>
    </main>
  );
};