import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAuthStore } from "@/auth/store/auth.store";
import { formatDoctorName } from "@/lib/format-doctor-name";
import type { Doctor } from "@/interfaces/doctor.interface";
import { CalendarPlus, Radio, Stethoscope } from "lucide-react";
import { Link } from "react-router";

interface Props {
  doctor: Doctor;
}

export const DoctorCard = ({ doctor }: Props) => {
  const role = useAuthStore((state) => state.user?.role);
  // Un DOCTOR o ADMIN no reserva turnos con otros doctores.
  const canBook = role !== "DOCTOR" && role !== "ADMIN";

  return (
    <Card className="ring-1 ring-border">
      <CardContent className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Stethoscope size={22} />
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-foreground">
            {formatDoctorName(doctor)}
          </h3>
          <p className="truncate text-sm text-muted-foreground">
            {doctor.specialty}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 bg-transparent border-t-0 px-4 pb-4 pt-0">
        {canBook && (
          <Link to={`/doctors/${doctor.id}`} className="flex-1">
            <Button className="w-full" size="sm">
              <CalendarPlus className="size-4" />
              Reservar turno
            </Button>
          </Link>
        )}
        <Link to={`/doctors/${doctor.id}/queue`} className={canBook ? undefined : "flex-1"}>
          <Button variant="outline" size="sm" className={canBook ? undefined : "w-full"}>
            <Radio className="size-4" />
            Cola en vivo
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
