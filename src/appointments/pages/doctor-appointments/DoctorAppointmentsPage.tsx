import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyAppointments } from "@/appointments/hooks/useMyAppointments";
import { AppointmentStatusBadge } from "@/appointments/components/AppointmentStatusBadge";
import { RequestCancellationDialog } from "@/appointments/components/RequestCancellationDialog";
import { formatTimeLocal } from "@/lib/format-date";
import { CalendarX2, X } from "lucide-react";
import type { Appointment } from "@/interfaces/appointment.interface";

const patientLabelFromEmail = (email?: string) => {
  if (!email) return "Paciente";
  const local = email.split("@")[0].replace(/[._-]+/g, " ").trim();
  if (!local) return "Paciente";
  return local
    .split(/\s+/)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};

const AppointmentCard = ({
  appointment,
  index,
  onCancel,
}: {
  appointment: Appointment;
  index: number;
  onCancel: () => void;
}) => {
  const date = new Date(appointment.startTime);
  const dayShort = date.toLocaleDateString("es-AR", { weekday: "short" });
  const monthShort = date.toLocaleDateString("es-AR", { month: "short" });
  const patientLabel = patientLabelFromEmail(appointment.patientEmail);

  return (
    <article
      className="animate-fade-up flex items-center gap-4 rounded-[22px] border border-frost-edge bg-card p-5 shadow-sm backdrop-blur-xl transition-transform hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-coral-light/60 text-center">
        <span className="grid leading-tight">
          <span className="font-display text-xl font-extrabold text-foreground">
            {date.getDate()}
          </span>
          <span className="text-[0.6rem] font-bold uppercase tracking-wide text-coral">
            {monthShort}
          </span>
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-base font-bold text-foreground">
          {patientLabel}
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs capitalize text-muted-foreground">
          <span>
            {dayShort} · {formatTimeLocal(appointment.startTime)}
          </span>
          <span>–</span>
          <span>{formatTimeLocal(appointment.endTime)}</span>
        </p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground/80">
          {appointment.patientEmail}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <AppointmentStatusBadge status={appointment.status} />
        {appointment.status === "CONFIRMED" && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={onCancel}
          >
            <X className="size-3.5" />
            Pedir cancelación
          </Button>
        )}
      </div>
    </article>
  );
};

export const DoctorAppointmentsPage = () => {
  const { data: appointments, isLoading } = useMyAppointments();
  const [targetId, setTargetId] = useState<string | null>(null);

  const sorted = [...(appointments ?? [])].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );

  const confirmedCount = sorted.filter((a) => a.status === "CONFIRMED").length;

  return (
    <div className="container mx-auto max-w-3xl space-y-8 px-4 py-8 md:py-10 lg:px-8">
      <section className="animate-fade-up flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-primary">
            Panel del doctor
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-foreground">
            Mis citas
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Elegí una cita confirmada para pedir su cancelación.
          </p>
        </div>
        <span className="rounded-full border border-frost-edge bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur-xl">
          {confirmedCount} confirmadas
        </span>
      </section>

      <div className="space-y-4">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[88px] w-full rounded-[22px]" />
          ))}

        {!isLoading && sorted.length === 0 && (
          <div className="animate-fade-up rounded-[22px] border border-frost-edge bg-card p-10 text-center shadow-sm backdrop-blur-xl">
            <CalendarX2 className="mx-auto size-9 text-coral" />
            <p className="mt-3 font-display text-lg font-bold text-foreground">
              Sin citas registradas
            </p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              Cuando tengas citas asignadas, van a aparecer acá con su estado y
              horario.
            </p>
          </div>
        )}

        {sorted.map((appointment, index) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            index={index}
            onCancel={() => setTargetId(appointment.id)}
          />
        ))}
      </div>

      {targetId && (
        <RequestCancellationDialog
          open={!!targetId}
          onOpenChange={(open) => !open && setTargetId(null)}
          appointmentId={targetId}
        />
      )}
    </div>
  );
};