import { useRef, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Stethoscope } from "lucide-react";
import { ProfessionalCard } from "./ProfessionalCard";
import type { Doctor } from "@/interfaces/doctor.interface";

interface Props {
  doctors: Doctor[];
  count: number;
  isLoading: boolean;
}

const CARD_STEP_PX = 256; // 240px de tarjeta + 16px de gap

export const ProfessionalsSection = ({ doctors, count, isLoading }: Props) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    startInnerX: number;
    moved: boolean;
  } | null>(null);
  const [innerX, setInnerX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);

  const animationPlayState = dragging || paused ? "paused" : "running";

  const isInteractiveTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return false;
    return (
      target.closest("a, button, input, textarea, select, [role='button']") !==
      null
    );
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || doctors.length < 2) return;
    if (isInteractiveTarget(event.target)) return;
    dragRef.current = {
      startX: event.clientX,
      startInnerX: innerX,
      moved: false,
    };
    setDragging(true);
    track.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    if (Math.abs(dx) > 3) drag.moved = true;
    if (drag.moved) setInnerX(drag.startInnerX + dx);
  };

  const endDrag = () => {
    const drag = dragRef.current;
    if (!drag) return;
    const hadDrag = drag.moved;
    dragRef.current = null;
    setDragging(false);
    if (!hadDrag) return;
    // Si hubo arrastre, el click de liberacion que sigue no debe navegar.
    trackRef.current?.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();
      },
      { capture: true, once: true },
    );
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") setInnerX((value) => value - CARD_STEP_PX);
    if (event.key === "ArrowRight") setInnerX((value) => value + CARD_STEP_PX);
  };

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
            ref={trackRef}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            aria-label="Carrusel de profesionales"
            className="cursor-grab touch-pan-y select-none overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_2rem,black_calc(100%-2rem),transparent)] active:cursor-grabbing"
          >
            <div
              className="flex w-max animate-marquee"
              style={{
                animationDuration: `${doctors.length * 6.4}s`,
                animationPlayState,
              }}
            >
              <div
                className="flex gap-4"
                style={{ transform: `translateX(${innerX}px)` }}
              >
                {[...doctors, ...doctors].map((doctor, index) => (
                  <div
                    key={`${doctor.id}-${index}`}
                    className="w-[240px] shrink-0"
                  >
                    <ProfessionalCard
                      doctor={doctor}
                      index={index % doctors.length}
                    />
                  </div>
                ))}
              </div>
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