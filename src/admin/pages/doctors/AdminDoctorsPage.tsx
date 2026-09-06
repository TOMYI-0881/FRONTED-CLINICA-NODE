import { useState } from "react";
import { AdminTitle } from "@/admin/components/AdminTitle";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/custom/ConfirmDialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useDoctors } from "@/doctors/hooks/useDoctors";
import { useDoctorsAdmin } from "@/admin/hooks/useDoctorsAdmin";
import type { Doctor } from "@/interfaces/doctor.interface";
import { DoctorFormDialog } from "./components/DoctorFormDialog";
import { KeyRound, PencilIcon, PlusIcon, Trash2 } from "lucide-react";

export const AdminDoctorsPage = () => {
  const { data: doctors, isLoading } = useDoctors();
  const { deactivate, resetPassword } = useDoctorsAdmin();

  const [formDoctor, setFormDoctor] = useState<Doctor | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<Doctor | null>(null);
  const [resetTarget, setResetTarget] = useState<Doctor | null>(null);

  if (isLoading) return <h1 className="p-8">Cargando...</h1>;

  return (
    <>
      <div className="flex w-[98%] mx-auto items-center justify-between py-2 mb-6">
        <AdminTitle
          title="Doctores"
          description="Creá, editá y desactivá doctores del catálogo."
        />

        <Button
          onClick={() => {
            setFormDoctor(null);
            setFormOpen(true);
          }}
        >
          <PlusIcon />
          Nuevo doctor
        </Button>
      </div>

      <div className="w-[98%] mx-auto overflow-x-auto rounded-lg border border-border shadow-xs mb-10 bg-card">
        <Table className="w-full min-w-[700px]">
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Especialidad</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors?.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell className="font-medium">{doctor.name}</TableCell>
                <TableCell>{doctor.specialty}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setFormDoctor(doctor);
                        setFormOpen(true);
                      }}
                    >
                      <PencilIcon className="size-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setResetTarget(doctor)}
                    >
                      <KeyRound className="size-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setDeactivateTarget(doctor)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DoctorFormDialog
        key={formDoctor?.id ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        doctor={formDoctor ?? undefined}
      />

      <ConfirmDialog
        open={!!deactivateTarget}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
        title={`¿Desactivar a ${deactivateTarget?.name}?`}
        description="Esto cancela en cascada sus citas futuras confirmadas y notifica a cada paciente por email. No se puede deshacer."
        confirmLabel="Sí, desactivar"
        variant="destructive"
        onConfirm={() => {
          if (deactivateTarget) deactivate.mutate(deactivateTarget.id);
          setDeactivateTarget(null);
        }}
      />

      <ConfirmDialog
        open={!!resetTarget}
        onOpenChange={(open) => !open && setResetTarget(null)}
        title={`¿Resetear la contraseña de ${resetTarget?.name}?`}
        description="Se genera una contraseña nueva y se le envía por correo al doctor."
        confirmLabel="Sí, resetear"
        onConfirm={() => {
          if (resetTarget) resetPassword.mutate(resetTarget.id);
          setResetTarget(null);
        }}
      />
    </>
  );
};
