import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user/UserAvatar";
import type { Turn } from "@/interfaces/queue.interface";
import { cn } from "@/lib/utils";
import { UserRound } from "lucide-react";

export const CurrentTurnCard = ({ turn }: { turn: Turn | null }) => {
  return (
    <Card className={cn(turn ? "ring-2 ring-primary" : "ring-1 ring-border")}>
      <CardContent className="flex items-center gap-4 py-2">
        {turn ? (
          <UserAvatar
            name={turn.patientName}
            photoUrl={turn.photoUrl}
            className="size-14 shrink-0 rounded-full ring-2 ring-primary"
          />
        ) : (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserRound size={26} />
          </div>
        )}
        {turn ? (
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Turno actual · #{turn.number}
            </p>
            <p className="truncate text-lg font-semibold text-foreground">
              {turn.patientName}
            </p>
            {turn.priority === "preferente" && (
              <span className="inline-flex mt-1 items-center rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent-foreground">
                Preferente
              </span>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No hay ningún turno en curso.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
