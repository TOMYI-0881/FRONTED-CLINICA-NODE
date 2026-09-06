import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/auth/store/auth.store";
import { getDoctorProfile } from "@/home/lib/mock-images";
import { DoctorAvatar } from "@/components/doctor/DoctorAvatar";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Doctor } from "@/interfaces/doctor.interface";

interface Props {
  doctor: Doctor;
  index: number;
}

export const ProfessionalCard = ({ doctor, index }: Props) => {
  const role = useAuthStore((state) => state.user?.role);
  const canBook = role !== "DOCTOR" && role !== "ADMIN";
  const { place } = getDoctorProfile(doctor);

  return (
    <article
      className="animate-fade-up overflow-hidden rounded-[22px] border border-frost-edge bg-card p-3 shadow-sm backdrop-blur-xl transition-transform hover:-translate-y-1"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <DoctorAvatar
        name={doctor.name}
        photoUrl={doctor.photoUrl}
        className="aspect-square w-full rounded-2xl"
        initialsClassName="text-4xl"
      />

      <div className="px-1 pb-1 pt-3">
        <span className="text-[11px] font-bold uppercase text-primary">
          {doctor.specialty}
        </span>
        <h3 className="mt-1 font-display text-base font-bold">{doctor.name}</h3>
        {place && (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {place}
          </p>
        )}

        <div
          className={cn(
            "mt-3 grid gap-2",
            canBook ? "grid-cols-[1fr_auto]" : "grid-cols-1",
          )}
        >
          {canBook && (
            <Link to={`/doctors/${doctor.id}`}>
              <Button className="w-full rounded-xl">
                <CalendarDays />
                Reservar
              </Button>
            </Link>
          )}
          <Link to={`/doctors/${doctor.id}/queue`}>
            <Button
              variant="frost"
              size="icon"
              className={cn("rounded-xl", !canBook && "w-full")}
              aria-label={`Ver cola de ${doctor.name}`}
              title="Cola en vivo"
            >
              <Clock3 />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
};