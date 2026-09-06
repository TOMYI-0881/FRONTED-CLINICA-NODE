import { Card, CardContent } from "@/components/ui/card";
import { TicketCheck } from "lucide-react";
import type { Turn } from "@/interfaces/queue.interface";

export const MyTurnCard = ({ turn }: { turn: Turn }) => {
  return (
    <Card className="ring-2 ring-primary/70">
      <CardContent className="flex items-center gap-4 py-2">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <TicketCheck size={26} />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Tu turno en la cola
          </p>
          <p className="truncate text-lg font-semibold text-foreground">
            Turno #{turn.number}
          </p>
          <p className="text-xs text-muted-foreground">
            {turn.status === "in-progress"
              ? "Es tu momento, pasá al consultorio"
              : "Estás en espera, tu turno ya fue asignado"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};