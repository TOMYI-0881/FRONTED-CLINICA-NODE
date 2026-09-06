import { Button } from "@/components/ui/button";
import type { Turn } from "@/interfaces/queue.interface";
import { useQueueControls } from "../hooks/useQueueControls";
import { PhoneCall, SkipForward, StepForward } from "lucide-react";

interface Props {
  doctorId: string;
  currentTurn: Turn | null;
}

export const QueueControls = ({ doctorId, currentTurn }: Props) => {
  const { next, skip, call } = useQueueControls(doctorId);

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => next.mutate()} disabled={next.isPending}>
        <StepForward className="size-4" />
        Siguiente
      </Button>
      <Button
        variant="outline"
        onClick={() => skip.mutate()}
        disabled={skip.isPending}
      >
        <SkipForward className="size-4" />
        Saltar
      </Button>
      <Button
        variant="outline"
        onClick={() => call.mutate()}
        disabled={!currentTurn || call.isPending}
      >
        <PhoneCall className="size-4" />
        Re-llamar
      </Button>
    </div>
  );
};
