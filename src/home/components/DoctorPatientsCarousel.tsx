import { Link } from "react-router";
import { CalendarClock, UserRound } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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

export const DoctorPatientsCarousel = ({ turns, isLoading }: Props) => {
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

  if (turns.length < 2) {
    return (
      <div className="flex gap-4">
        <TurnCard turn={turns[0]} />
      </div>
    );
  }

  return (
    <div
      className="group/row overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_2rem,black_calc(100%-2rem),transparent)]"
      aria-label="Carrusel de pacientes de hoy"
    >
      <div
        className="flex w-max animate-marquee gap-4 group-hover/row:[animation-play-state:paused] group-focus-within/row:[animation-play-state:paused]"
        style={{ animationDuration: `${turns.length * 5.2}s` }}
      >
        {[...turns, ...turns].map((turn, index) => (
          <div key={`${turn.id}-${index}`} className="w-[220px] shrink-0">
            <TurnCard turn={turn} index={index % turns.length} />
          </div>
        ))}
      </div>
    </div>
  );
};

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

      <div className="mt-3 grid aspect-square w-full place-items-center rounded-2xl bg-coral-light/60">
        <span className="grid size-12 place-items-center rounded-full bg-surface text-coral shadow-sm">
          <UserRound className="size-6" />
        </span>
      </div>

      <div className="px-1 pb-1 pt-3">
        <h3 className="truncate font-display text-base font-bold">{turn.patientName}</h3>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {turn.status === "in-progress" ? "Atendiendo ahora mismo" : "Esperando su turno en la cola"}
        </p>
      </div>
    </Link>
  );
};