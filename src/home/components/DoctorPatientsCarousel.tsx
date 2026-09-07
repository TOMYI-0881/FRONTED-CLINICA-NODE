import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { CalendarClock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user/UserAvatar";
import { cn } from "@/lib/utils";
import type { Turn, TurnPriority, TurnStatus } from "@/interfaces/queue.interface";

interface Props {
  turns: Turn[];
  isLoading: boolean;
}

const statusLabel: Partial<Record<TurnStatus, string>> = {
  "in-progress": "En consultorio",
  waiting: "En espera",
  done: "Atendido",
  skipped: "Omitido",
};

const statusClass: Record<string, string> = {
  "in-progress": "bg-coral/10 text-coral",
  waiting: "bg-accent/20 text-accent-foreground",
  preferente: "bg-amber-500/10 text-amber-600",
};

const CARD_WIDTH = 220;
const CARD_GAP = 16;

export const DoctorPatientsCarousel = ({ turns, isLoading }: Props) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    const element = rowRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="w-[220px] shrink-0 rounded-[22px]" style={{ minHeight: 200 }} />
        ))}
      </div>
    );
  }

  if (turns.length === 0) {
    return (
      <div className="rounded-[22px] border border-frost-edge bg-card p-6 text-center shadow-sm">
        <CalendarClock className="mx-auto size-8 text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">
          No tenés pacientes esperando todavía.
        </p>
      </div>
    );
  }

  const setWidth = turns.length * CARD_WIDTH + (turns.length - 1) * CARD_GAP;

  const shouldMarquee = containerWidth > 0 && setWidth > containerWidth;

  return (
    <div
      ref={rowRef}
      className={
        shouldMarquee
          ? "group/row overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_2rem,black_calc(100%-2rem),transparent)]"
          : "flex gap-4 overflow-x-auto overscroll-x-contain pb-1"
      }
      aria-label="Pacientes de hoy"
    >
      {shouldMarquee ? (
        <div
          className="flex w-max animate-marquee group-hover/row:[animation-play-state:paused] group-focus-within/row:[animation-play-state:paused]"
          style={{
            animationDuration: `${turns.length * 5.2}s`,
            animationDirection: "alternate",
          }}
        >
          <MarqueeSet turns={turns} />
          <MarqueeSet turns={turns} ariaHidden />
        </div>
      ) : (
        turns.map((turn, index) => (
          <div key={turn.id} className="w-[220px] shrink-0">
            <TurnCard turn={turn} index={index} />
          </div>
        ))
      )}
    </div>
  );
};

// Una "vuelta" completa de la marquesina: copia idéntica de las tarjetas con un
// espaciado final más amplio para marcar el punto de reinicio, evitando que la
// información se perciba como duplicada y que el -50% del @keyframes desfase el loop.
const MarqueeSet = ({
  turns,
  ariaHidden = false,
}: {
  turns: Turn[];
  ariaHidden?: boolean;
}) => (
  <div
    aria-hidden={ariaHidden || undefined}
    className="flex shrink-0 items-stretch gap-4 pr-16"
  >
    {turns.map((turn, index) => (
      <div key={turn.id} className="w-[220px] shrink-0">
        <TurnCard turn={turn} index={index} />
      </div>
    ))}
  </div>
);

interface CardProps {
  turn: Turn;
  index?: number;
}

const TurnCard = ({ turn, index = 0 }: CardProps) => {
  const priorityLabel: Record<TurnPriority, string> = {
    normal: "Normal",
    preferente: "Preferente",
  };

  return (
    <Link
      to="/doctor/queue"
      title="Controlar cola"
      aria-label={`Turno ${turn.number} de ${turn.patientName}, controlar cola`}
      className="animate-fade-up block overflow-hidden rounded-[22px] border border-frost-edge bg-card p-3 shadow-sm backdrop-blur-xl transition-transform hover:-translate-y-1"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full border border-frost-edge bg-frost px-2.5 py-1 font-display text-sm font-bold text-primary">
          Turno #{turn.number}
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
            turn.priority === "preferente"
              ? statusClass.preferente
              : statusClass[turn.status],
          )}
        >
          {turn.priority === "preferente" ? priorityLabel.preferente : statusLabel[turn.status]}
        </span>
      </div>

      <UserAvatar
        name={turn.patientName}
        photoUrl={turn.photoUrl}
        className="mt-3 size-44 w-full rounded-2xl object-cover"
        initialsClassName="rounded-2xl bg-coral-light/60 text-coral text-lg"
        alt={`Foto de ${turn.patientName}`}
      />

      <div className="px-1 pb-1 pt-3">
        <h3 className="truncate font-display text-base font-bold">{turn.patientName}</h3>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {turn.status === "in-progress" ? "Atendiendo ahora mismo" : "Esperando su turno en la cola"}
        </p>
      </div>
    </Link>
  );
};