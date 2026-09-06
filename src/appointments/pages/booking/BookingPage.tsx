import { useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/auth/store/auth.store";
import { useDoctors } from "@/doctors/hooks/useDoctors";
import { useAvailability } from "@/appointments/hooks/useAvailability";
import { useBookAppointment } from "@/appointments/hooks/useBookAppointment";
import { DateField } from "@/appointments/components/DateField";
import { SlotGrid } from "@/appointments/components/SlotGrid";
import { todayApiDate } from "@/lib/format-date";
import type { Slot } from "@/interfaces/appointment.interface";
import { Radio } from "lucide-react";

export const BookingPage = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { data: doctors, isLoading: isLoadingDoctors } = useDoctors();
  const doctor = doctors?.find((d) => d.id === doctorId);

  const [date, setDate] = useState(todayApiDate());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const { data: slots, isLoading: isLoadingSlots } = useAvailability(doctorId, date);
  const bookMutation = useBookAppointment(doctorId, date);

  const authStatus = useAuthStore((state) => state.authStatus);
  const role = useAuthStore((state) => state.user?.role);
  const isPatient = role === "PATIENT";

  const canBook = authStatus === "authenticated" && isPatient;

  // Un DOCTOR o ADMIN nunca puede reservarle un turno a otro doctor:
  // ni siquiera debería ver esta pantalla, no solo tener el botón bloqueado.
  if (role === "DOCTOR") return <Navigate to="/doctor/queue" />;
  if (role === "ADMIN") return <Navigate to="/admin" />;

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setSelectedSlot(null);
  };

  const handleConfirm = () => {
    if (!doctorId || !selectedSlot) return;
    bookMutation.mutate(
      { doctorId, startTime: selectedSlot.startTime, endTime: selectedSlot.endTime },
      { onSuccess: () => setSelectedSlot(null) },
    );
  };

  if (!isLoadingDoctors && !doctor) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        No encontramos ese doctor.
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {doctor?.name ?? "Cargando..."}
          </h1>
          <p className="text-sm text-muted-foreground">{doctor?.specialty}</p>
        </div>
        {doctorId && (
          <Link to={`/doctors/${doctorId}/queue`}>
            <Button variant="outline" size="sm">
              <Radio className="size-4" />
              Ver cola en vivo
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardContent className="space-y-5">
          <DateField value={date} onChange={handleDateChange} />

          <div>
            <label className="text-sm font-semibold">
              Horarios disponibles
            </label>
            <div className="mt-2">
              <SlotGrid
                slots={slots ?? []}
                isLoading={isLoadingSlots}
                selected={selectedSlot}
                onSelect={setSelectedSlot}
              />
            </div>
          </div>

          {canBook ? (
            <Button
              className="w-full"
              disabled={!selectedSlot || bookMutation.isPending}
              onClick={handleConfirm}
            >
              {bookMutation.isPending ? "Reservando..." : "Confirmar turno"}
            </Button>
          ) : (
            <div className="rounded-md border border-dashed border-border p-3 text-center text-sm text-muted-foreground">
              Iniciá sesión como paciente para reservar.{" "}
              <Link to="/auth/login" className="font-medium text-primary underline">
                Iniciar sesión
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
