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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Doctor } from "@/interfaces/doctor.interface";
import { useDoctorsAdmin } from "@/admin/hooks/useDoctorsAdmin";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor?: Doctor;
}

export const DoctorFormDialog = ({ open, onOpenChange, doctor }: Props) => {
  const isEdit = !!doctor;
  const { create, update } = useDoctorsAdmin();
  const [name, setName] = useState(doctor?.name ?? "");
  const [specialty, setSpecialty] = useState(doctor?.specialty ?? "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isPending = create.isPending || update.isPending;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (isEdit) {
      update.mutate(
        { id: doctor.id, name, specialty },
        { onSuccess: () => onOpenChange(false) },
      );
      return;
    }

    create.mutate(
      { name, specialty, email, password },
      {
        onSuccess: () => {
          setName("");
          setSpecialty("");
          setEmail("");
          setPassword("");
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
            <AlertDialogTitle>
              {isEdit ? "Editar doctor" : "Nuevo doctor"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isEdit
                ? "Solo podés editar nombre y especialidad."
                : "Se crea la cuenta del doctor con este email y contraseña."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="name" className="mb-2">
                Nombre
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="specialty" className="mb-2">
                Especialidad
              </Label>
              <Input
                id="specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                required
              />
            </div>

            {!isEdit && (
              <>
                <div>
                  <Label htmlFor="email" className="mb-2">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="mb-2">
                    Contraseña inicial
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
          </div>

          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </AlertDialogCancel>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
