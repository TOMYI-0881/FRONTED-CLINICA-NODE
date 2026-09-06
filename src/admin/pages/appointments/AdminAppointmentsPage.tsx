import { useState } from "react";
import { AdminTitle } from "@/admin/components/AdminTitle";
import CustomPagination from "@/components/custom/CustomPagination";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/custom/ConfirmDialog";
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
import { AppointmentStatusBadge } from "@/appointments/components/AppointmentStatusBadge";
import { formatDateTimeLocal } from "@/lib/format-date";
import type { Appointment } from "@/interfaces/appointment.interface";
import { X } from "lucide-react";

export const AdminAppointmentsPage = () => {
  const { data, isLoading } = useAdminAppointments();
  const { data: doctors } = useDoctors();
  const cancelMutation = useCancelAppointment();
  const [target, setTarget] = useState<Appointment | null>(null);

  if (isLoading) return <h1 className="p-8">Cargando...</h1>;

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  return (
    <>
      <div className="py-2 w-[98%] mx-auto mb-6">
        <AdminTitle
          title="Todas las reservas"
          description={`${data?.total ?? 0} citas en total`}
        />
      </div>

      <div className="w-[98%] mx-auto overflow-x-auto rounded-lg border border-border shadow-xs mb-6 bg-card">
        <Table className="w-full min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Fecha y hora</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  {doctors?.find((d) => d.id === appointment.doctorId)?.name ??
                    appointment.doctorId}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {appointment.patientId}
                </TableCell>
                <TableCell>{formatDateTimeLocal(appointment.startTime)}</TableCell>
                <TableCell>
                  <AppointmentStatusBadge status={appointment.status} />
                </TableCell>
                <TableCell>
                  {appointment.status !== "CANCELLED" && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setTarget(appointment)}
                    >
                      <X className="size-4 text-destructive" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mb-8">
        <CustomPagination totalPages={totalPages} />
      </div>

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
    </>
  );
};
