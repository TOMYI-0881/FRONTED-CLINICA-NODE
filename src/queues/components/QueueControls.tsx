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
    <div className="grid gap-2 sm:grid-cols-3">
      <Button
        size="lg"
        className="rounded-full py-2.5"
        onClick={() => next.mutate()}
        disabled={next.isPending}
      >
        <StepForward className="size-4" />
        Siguiente
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="rounded-full py-2.5"
        onClick={() => skip.mutate()}
        disabled={skip.isPending}
      >
        <SkipForward className="size-4" />
        Saltar
      </Button>
      <Button
        variant="frost"
        size="lg"
        className="rounded-full py-2.5"
        onClick={() => call.mutate()}
        disabled={!currentTurn || call.isPending}
      >
        <PhoneCall className="size-4" />
        Re-llamar
      </Button>
    </div>
  );
};