import type { Turn } from "@/interfaces/queue.interface";
import { cn } from "@/lib/utils";

export const WaitingList = ({ waiting }: { waiting: Turn[] }) => {
  if (waiting.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay pacientes esperando.
      </p>
    );
  }

  return (
    <ol className="divide-y divide-border rounded-lg border border-border">
      {waiting.map((turn) => (
        <li
          key={turn.id}
          className="flex items-center justify-between gap-3 px-4 py-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
              {turn.number}
            </span>
            <span className="truncate text-sm font-medium text-foreground">
              {turn.patientName}
            </span>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
              turn.priority === "preferente"
                ? "bg-accent/20 text-accent-foreground"
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
