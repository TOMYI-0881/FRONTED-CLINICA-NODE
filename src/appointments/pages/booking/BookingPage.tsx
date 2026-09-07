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
import { DoctorHero } from "@/appointments/components/DoctorHero";
import { getDoctorProfile } from "@/home/lib/mock-images";
import { todayApiDate } from "@/lib/format-date";
import { formatDoctorName } from "@/lib/format-doctor-name";
import type { Slot } from "@/interfaces/appointment.interface";
import { CalendarDays, Clock3, MapPin, MousePointerClick } from "lucide-react";

export const BookingPage = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { data: doctors, isLoading: isLoadingDoctors } = useDoctors();
  const doctor = doctors?.find((d) => d.id === doctorId);
  const place = doctor ? getDoctorProfile(doctor).place : null;

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
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-10 lg:px-8">
      {doctor ? (
        <DoctorHero doctor={doctor} />
      ) : (
        <div className="h-44 animate-pulse rounded-[26px] border border-frost-edge bg-card" />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="animate-fade-up rounded-[22px] border border-frost-edge lg:col-span-2">
          <CardContent className="space-y-5 py-2">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">
                Reservá tu turno
              </h2>
              <p className="text-sm text-muted-foreground">
                Elegí un día y horario disponible{doctor ? ` para ${formatDoctorName(doctor)}` : ""}.
              </p>
            </div>

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

        {doctor && (
          <aside className="space-y-6">
            <div
              className="animate-fade-up rounded-[22px] border border-frost-edge bg-card p-6 shadow-sm backdrop-blur-xl transition-transform hover:-translate-y-1"
              style={{ animationDelay: "140ms" }}
            >
              <span className="grid size-10 place-items-center rounded-xl bg-coral/15 text-coral">
                <Clock3 className="size-5" />
              </span>
              <h2 className="mt-4 font-display text-base font-bold text-foreground">
                Horarios de atención
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="size-3.5" />
                    Lunes a viernes
                  </span>
                  <span className="font-semibold text-foreground">09:00 - 18:00</span>
                </li>
                {place && (
                  <li className="flex items-center gap-2 pt-1">
                    <MapPin className="size-3.5" />
                    {place}
                  </li>
                )}
              </ul>
            </div>

            <div
              className="animate-fade-up rounded-[22px] border border-frost-edge bg-card p-6 shadow-sm backdrop-blur-xl transition-transform hover:-translate-y-1"
              style={{ animationDelay: "210ms" }}
            >
              <span className="grid size-10 place-items-center rounded-xl bg-coral/15 text-coral">
                <MousePointerClick className="size-5" />
              </span>
              <h2 className="mt-4 font-display text-base font-bold text-foreground">
                Cómo reservar
              </h2>
              <ol className="mt-3 space-y-3">
                {["Elegí el día", "Seleccioná un horario", "Confirmá tu turno"].map(
                  (step, index) => (
                    <li key={step} className="flex items-start gap-3 text-sm">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                      <span className="pt-0.5 text-muted-foreground">{step}</span>
                    </li>
                  ),
                )}
              </ol>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
