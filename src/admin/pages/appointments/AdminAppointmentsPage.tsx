import { useState } from "react";
import { AdminTitle } from "@/admin/components/AdminTitle";
import StatCard from "@/admin/components/componentsDashboard/StatCard";
import CustomPagination from "@/components/custom/CustomPagination";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/custom/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useAdminAppointments } from "@/appointments/hooks/useAdminAppointments";
import { useCancelAppointment } from "@/appointments/hooks/useCancelAppointment";
import { useDoctors } from "@/doctors/hooks/useDoctors";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsAction } from "@/admin/actions/get-dashboard-stats.action";
import { AppointmentStatusBadge } from "@/appointments/components/AppointmentStatusBadge";
import { formatDateTimeLocal } from "@/lib/format-date";
import { formatDoctorName } from "@/lib/format-doctor-name";
import type { Appointment } from "@/interfaces/appointment.interface";
import {
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  Hourglass,
  RefreshCw,
  X,
} from "lucide-react";

const AppointmentsTableSkeleton = () => (
  <Table>
    <TableHeader>
      <TableRow className="border-frost-edge hover:bg-transparent">
        {["Doctor", "Paciente", "Fecha y hora", "Estado", "Acciones"].map(
          (head) => (
            <TableHead key={head}>{head}</TableHead>
          ),
        )}
      </TableRow>
    </TableHeader>
    <TableBody>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index} className="border-frost-edge">
          <TableCell>
            <div className="flex items-center gap-2">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-36" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-24 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="size-8" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export const AdminAppointmentsPage = () => {
  const { data, isLoading, refetch } = useAdminAppointments();
  const { data: doctors } = useDoctors();
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: getDashboardStatsAction,
  });
  const cancelMutation = useCancelAppointment();
  const [target, setTarget] = useState<Appointment | null>(null);

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;
  const doctorById = new Map(doctors?.map((doctor) => [doctor.id, doctor]) ?? []);

  const tableContent = isLoading ? (
    <AppointmentsTableSkeleton />
  ) : data && data.items.length > 0 ? (
    <Table>
      <TableHeader>
        <TableRow className="border-frost-edge hover:bg-transparent">
          <TableHead className="text-xs font-bold uppercase text-muted-foreground">
            Doctor
          </TableHead>
          <TableHead className="text-xs font-bold uppercase text-muted-foreground">
            Paciente
          </TableHead>
          <TableHead className="text-xs font-bold uppercase text-muted-foreground">
            Fecha y hora
          </TableHead>
          <TableHead className="text-xs font-bold uppercase text-muted-foreground">
            Estado
          </TableHead>
          <TableHead className="text-xs font-bold uppercase text-muted-foreground">
            Acciones
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.items.map((appointment) => {
          const doctor = doctorById.get(appointment.doctorId);
          const cancellable =
            appointment.status !== "CANCELLED" &&
            appointment.status !== "COMPLETED";
          return (
            <TableRow
              key={appointment.id}
              className="border-frost-edge hover:bg-frost/60"
            >
              <TableCell className="font-medium">
                {doctor ? formatDoctorName(doctor) : appointment.doctorId}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {appointment.patientEmail ?? (
                  <span className="font-mono text-xs">
                    {appointment.patientId}
                  </span>
                )}
              </TableCell>
              <TableCell>
                {formatDateTimeLocal(appointment.startTime)}
              </TableCell>
              <TableCell>
                <AppointmentStatusBadge status={appointment.status} />
              </TableCell>
              <TableCell>
                {cancellable && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setTarget(appointment)}
                    aria-label={`Cancelar cita de ${
                      doctor ? formatDoctorName(doctor) : appointment.patientId
                    }`}
                    title="Cancelar cita"
                  >
                    <X className="size-4 text-destructive" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  ) : (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-coral/15 text-coral">
        <CalendarDays className="size-6" />
      </span>
      <h2 className="mt-4 font-display text-lg font-bold">
        No hay reservas todavía
      </h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Las citas reservadas por los pacientes van a aparecer acá.
      </p>
    </div>
  );

  return (
    <main className="flex-1 space-y-6 p-4 md:space-y-8 md:p-8">
      <div className="flex animate-fade-up items-center justify-between gap-4">
        <AdminTitle
          title="Todas las reservas"
          description={`${data?.total ?? 0} citas en total`}
        />
        <Button variant="outline" className="rounded-full" onClick={() => refetch()}>
          <RefreshCw className="size-4" />
          Recargar
        </Button>
      </div>

      <section
        className="grid animate-fade-up grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5"
        style={{ animationDelay: "80ms" }}
      >
        <StatCard
          title="Reservas totales"
          value={stats?.totalCitas ?? "—"}
          icon={CalendarCheck2}
          loading={isLoadingStats}
        />
        <StatCard
          title="Citas de hoy"
          value={stats?.citasHoy ?? "—"}
          icon={CalendarClock}
          loading={isLoadingStats}
        />
        <StatCard
          title="En revisión"
          value={stats?.citasPorEstado?.CANCELLATION_REQUESTED ?? "—"}
          icon={Hourglass}
          loading={isLoadingStats}
        />
      </section>

      <section
        className="animate-fade-up overflow-hidden rounded-[22px] border border-frost-edge bg-card shadow-sm backdrop-blur-xl"
        style={{ animationDelay: "160ms" }}
      >
        {tableContent}
      </section>

      <section
        className="flex animate-fade-up flex-col items-center gap-3"
        style={{ animationDelay: "240ms" }}
      >
        <p className="text-xs text-muted-foreground">
          Página {data?.page ?? 1} de {Math.max(totalPages, 1)}
        </p>
        <CustomPagination totalPages={totalPages} />
      </section>

      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        title="¿Cancelar esta cita?"
        description="La cita pasa a CANCELLED de inmediato y libera el horario."
        confirmLabel="Sí, cancelar"
        variant="destructive"
        onConfirm={() => {
          if (target) cancelMutation.mutate(target.id);
          setTarget(null);
        }}
      />
    </main>
  );
};