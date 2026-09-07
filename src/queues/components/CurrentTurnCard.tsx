import { UserAvatar } from "@/components/user/UserAvatar";
import type { Turn } from "@/interfaces/queue.interface";
import { cn } from "@/lib/utils";
import { UserRound } from "lucide-react";

export const CurrentTurnCard = ({ turn }: { turn: Turn | null }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-[22px] border border-frost-edge bg-card p-5 shadow-sm backdrop-blur-xl transition-shadow",
        turn && "ring-2 ring-coral/50",
      )}
    >
      {turn ? (
        <>
          <UserAvatar
            name={turn.patientName}
            photoUrl={turn.photoUrl}
            className="size-14 shrink-0 rounded-full ring-2 ring-coral"
            initialsClassName="bg-coral/10 text-coral text-base"
          />

          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-coral">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-coral opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-coral" />
              </span>
              En consultorio
            </p>
            <p className="mt-1 truncate font-display text-lg font-bold text-foreground">
              {turn.patientName}
            </p>
            {turn.priority === "preferente" && (
              <span className="mt-1 inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">
                Preferente
              </span>
            )}
          </div>

          <div className="shrink-0 text-right">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Turno
            </p>
            <p className="font-display text-3xl font-extrabold tracking-tight text-primary">
              #{turn.number}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="grid size-14 shrink-0 place-items-center rounded-full bg-coral/10 text-coral">
            <UserRound className="size-7" />
          </div>
          <div>
            <p className="font-display text-base font-bold text-foreground">
              Sin turno en curso
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              No hay ningún paciente siendo atendido.
            </p>
          </div>
        </>
      )}
    </div>
  );
};