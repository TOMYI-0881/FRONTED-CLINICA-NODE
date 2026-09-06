import { cn } from "@/lib/utils";
import type { AppointmentStatus } from "@/interfaces/appointment.interface";

const labels: Record<AppointmentStatus, string> = {
  CONFIRMED: "Confirmado",
  CANCELLATION_REQUESTED: "Cancelación en revisión",
  CANCELLED: "Cancelado",
};

const styles: Record<AppointmentStatus, string> = {
  CONFIRMED: "bg-primary/10 text-primary",
  CANCELLATION_REQUESTED: "bg-accent/20 text-accent-foreground",
  CANCELLED: "bg-muted text-muted-foreground",
};

export const AppointmentStatusBadge = ({
  status,
}: {
  status: AppointmentStatus;
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        styles[status],
      )}
    >
      {labels[status]}
    </span>
  );
};
