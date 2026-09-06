import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight, MapPin, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getDoctorProfile } from "@/home/lib/mock-images";
import { DoctorAvatar } from "@/components/doctor/DoctorAvatar";
import type { Doctor } from "@/interfaces/doctor.interface";

interface Props {
  doctors: Doctor[];
  isLoading: boolean;
}

export const AdminDoctorsCarousel = ({ doctors, isLoading }: Props) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (doctors.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % doctors.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, [doctors.length]);

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-[22px] border border-frost-edge bg-card">
        <div className="grid md:grid-cols-[260px_1fr]">
          <Skeleton className="aspect-square w-full rounded-none md:aspect-auto md:min-h-full" />
          <div className="space-y-3 p-6">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-9 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="rounded-[22px] border border-frost-edge bg-card p-6 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">
          No hay doctores cargados todavía.
        </p>
        <div className="mt-4">
          <Link to="/admin/doctors">
            <Button variant="frost" className="rounded-full">
              Crear el primero
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const current = doctors[index % doctors.length];
  const { place } = getDoctorProfile(current);
  const showControls = doctors.length > 1;

  const moveSlide = (direction: number) =>
    setIndex(
      (currentIndex) =>
        (currentIndex + direction + doctors.length) % doctors.length,
    );

  return (
    <div className="animate-fade-up overflow-hidden rounded-[22px] border border-frost-edge bg-card shadow-sm backdrop-blur-xl">
      <Link
        to={`/admin/doctors/${current.id}/edit`}
        className="group grid md:grid-cols-[260px_1fr]"
        aria-label={`Editar a ${current.name}`}
      >
        <div className="relative overflow-hidden md:min-h-[240px]">
          <DoctorAvatar
            name={current.name}
            photoUrl={current.photoUrl}
            className="absolute inset-0 size-full min-h-48 md:min-h-[240px]"
            initialsClassName="text-5xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent" />
        </div>

        <div className="flex flex-col justify-between gap-4 p-6 md:py-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-frost-edge bg-frost px-3 py-1 text-xs font-semibold text-primary">
              <span className="size-1.5 rounded-full bg-primary" />
              {current.specialty}
            </span>
            <h3 className="mt-3 font-display text-2xl font-extrabold">
              {current.name}
            </h3>
            {place && (
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5" />
                {place}
              </p>
            )}
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-primary">
            <PencilLine className="size-4" />
            Editar doctor
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>

      {showControls && (
        <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-3">
          <div
            className="flex flex-wrap items-center gap-2"
            aria-label={`Doctor ${(index % doctors.length) + 1} de ${doctors.length}`}
          >
            {doctors.map((doctor, doctorIndex) => (
              <button
                key={doctor.id}
                onClick={() => setIndex(doctorIndex)}
                aria-label={`Ver a ${doctor.name}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  doctorIndex === index % doctors.length
                    ? "w-7 bg-primary"
                    : "w-1.5 bg-foreground/20",
                )}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant="frost"
              size="round"
              onClick={() => moveSlide(-1)}
              aria-label="Doctor anterior"
            >
              <ArrowLeft />
            </Button>
            <Button
              size="round"
              onClick={() => moveSlide(1)}
              aria-label="Doctor siguiente"
            >
              <ArrowRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};