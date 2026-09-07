import { UserAvatar } from "@/components/user/UserAvatar";
import type { Turn } from "@/interfaces/queue.interface";
import { cn } from "@/lib/utils";

export const WaitingList = ({ waiting }: { waiting: Turn[] }) => {
  if (waiting.length === 0) {
    return (
      <div className="rounded-[22px] border border-frost-edge bg-card p-6 text-center shadow-sm backdrop-blur-xl">
        <p className="text-sm text-muted-foreground">
          No hay pacientes esperando.
        </p>
      </div>
    );
  }

  return (
    <ol className="divide-y divide-border overflow-hidden rounded-[22px] border border-frost-edge bg-card shadow-sm backdrop-blur-xl">
      {waiting.map((turn) => (
        <li
          key={turn.id}
          className="flex items-center justify-between gap-3 px-5 py-3.5"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-coral/10 font-display text-sm font-bold text-coral">
              {turn.number}
            </span>
            <UserAvatar
              name={turn.patientName}
              photoUrl={turn.photoUrl}
              className="size-9 shrink-0 rounded-full ring-1 ring-frost-edge"
              initialsClassName="bg-muted text-xs"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {turn.patientName}
              </p>
              <p className="text-xs text-muted-foreground">
                {turn.status === "in-progress"
                  ? "En consultorio"
                  : "Esperando su turno"}
              </p>
            </div>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
              turn.priority === "preferente"
                ? "bg-amber-500/10 text-amber-600"
                : "bg-muted text-muted-foreground",
            )}
          >
            {turn.priority === "preferente" ? "Preferente" : "Normal"}
          </span>
        </li>
      ))}
    </ol>
  );
};