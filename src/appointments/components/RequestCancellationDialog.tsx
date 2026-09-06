import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRequestCancellation } from "../hooks/useRequestCancellation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: string;
}

export const RequestCancellationDialog = ({
  open,
  onOpenChange,
  appointmentId,
}: Props) => {
  const [reason, setReason] = useState("");
  const mutation = useRequestCancellation();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!reason.trim()) return;

    mutation.mutate(
      { appointmentId, reason: reason.trim() },
      {
        onSuccess: () => {
          setReason("");
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>Pedir cancelación de esta cita</AlertDialogTitle>
            <AlertDialogDescription>
              El horario sigue bloqueado hasta que un administrador apruebe el
              pedido.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-4">
            <Label htmlFor="reason" className="mb-2">
              Motivo
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explicá el motivo de la cancelación"
              required
            />
          </div>

          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline">
                Volver
              </Button>
            </AlertDialogCancel>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Enviando..." : "Enviar pedido"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
