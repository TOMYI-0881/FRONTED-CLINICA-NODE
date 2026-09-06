import { Skeleton } from "@/components/ui/skeleton";
import { Stethoscope } from "lucide-react";
import { ProfessionalCard } from "./ProfessionalCard";
import type { Doctor } from "@/interfaces/doctor.interface";

interface Props {
  doctors: Doctor[];
  count: number;
  isLoading: boolean;
}

export const ProfessionalsSection = ({ doctors, count, isLoading }: Props) => {
  return (
    <section id="profesionales" className="mt-8 scroll-mt-24">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-primary">
            Turnos disponibles
          </p>
          <h2 className="mt-1 font-display text-2xl font-extrabold md:text-3xl">
            Profesionales cerca tuyo
          </h2>
        </div>
        <span className="text-sm font-semibold text-muted-foreground">
          {count} profesionales
        </span>
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-[240px] shrink-0 rounded-[22px]"
              style={{ minHeight: 340 }}
            />
          ))}
        </div>
      ) : doctors.length > 0 ? (
        doctors.length >= 2 ? (
          <div
            className="group/row overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_2rem,black_calc(100%-2rem),transparent)]"
            aria-label="Carrusel de profesionales"
          >
            <div
              className="flex w-max animate-marquee gap-4 group-hover/row:[animation-play-state:paused] group-focus-within/row:[animation-play-state:paused]"
              style={{ animationDuration: `${doctors.length * 6.4}s` }}
            >
              {[...doctors, ...doctors].map((doctor, index) => (
                <div key={`${doctor.id}-${index}`} className="w-[240px] shrink-0">
                  <ProfessionalCard doctor={doctor} index={index % doctors.length} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <div className="w-[240px] shrink-0">
              <ProfessionalCard doctor={doctors[0]} index={0} />
            </div>
          </div>
        )
      ) : (
        <div className="rounded-[22px] border border-border bg-card px-5 py-12 text-center">
          <Stethoscope className="mx-auto size-8 text-primary" />
          <h3 className="mt-3 font-display font-bold">
            No encontramos profesionales
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Probá con otro nombre o especialidad.
          </p>
        </div>
      )}
    </section>
  );
};