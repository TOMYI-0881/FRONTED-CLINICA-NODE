import { useState } from "react";
import { Link } from "react-router";
import { AdminTitle } from "@/admin/components/AdminTitle";
import StatCard from "@/admin/components/componentsDashboard/StatCard";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/custom/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
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
import { DoctorAvatar } from "@/components/doctor/DoctorAvatar";
import { formatDoctorName } from "@/lib/format-doctor-name";
import { cn } from "@/lib/utils";
import type { Doctor } from "@/interfaces/doctor.interface";
import { DoctorFormDialog } from "./components/DoctorFormDialog";
import {
  KeyRound,
  PencilIcon,
  PlusIcon,
  Stethoscope,
  Trash2,
  UserX,
  UsersRound,
} from "lucide-react";

const STATUS_STYLES = {
  active: "bg-primary/10 text-primary",
  inactive: "bg-muted text-muted-foreground",
} as const;

const DoctorsTableSkeleton = () => (
  <Table>
    <TableHeader>
      <TableRow className="border-frost-edge hover:bg-transparent">
        {["Foto", "Nombre", "Especialidad", "Estado", "Acciones"].map((head) => (
          <TableHead key={head}>{head}</TableHead>
        ))}
      </TableRow>
    </TableHeader>
    <TableBody>
      {Array.from({ length: 3 }).map((_, index) => (
        <TableRow key={index} className="border-frost-edge">
          <TableCell>
            <Skeleton className="size-10 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-36" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-28" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export const AdminDoctorsPage = () => {
  const { data: doctors, isLoading } = useDoctors();
  const { deactivate, resetPassword } = useDoctorsAdmin();

  const [formOpen, setFormOpen] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<Doctor | null>(null);
  const [resetTarget, setResetTarget] = useState<Doctor | null>(null);

  const activeCount = doctors?.filter((doctor) => doctor.isActive).length;
  const inactiveCount =
    doctors && activeCount !== undefined ? doctors.length - activeCount : undefined;

  const tableContent = isLoading ? (
    <DoctorsTableSkeleton />
  ) : doctors && doctors.length > 0 ? (
    <Table>
      <TableHeader>
        <TableRow className="border-frost-edge hover:bg-transparent">
          <TableHead className="text-xs font-bold uppercase text-muted-foreground">
            Foto
          </TableHead>
          <TableHead className="text-xs font-bold uppercase text-muted-foreground">
            Nombre
          </TableHead>
          <TableHead className="text-xs font-bold uppercase text-muted-foreground">
            Especialidad
          </TableHead>
          <TableHead className="text-xs font-bold uppercase text-muted-foreground">
            Estado
          </TableHead>
          <TableHead className="text-xs font-bold uppercase text-muted-foreground">
            Acciones
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {doctors.map((doctor) => (
          <TableRow key={doctor.id} className="border-frost-edge hover:bg-frost/60">
            <TableCell>
              <DoctorAvatar
                name={doctor.name}
                photoUrl={doctor.photoUrl}
                className="size-10 rounded-full ring-1 ring-frost-edge"
                initialsClassName="text-xs"
              />
            </TableCell>
            <TableCell className="font-medium">
              {formatDoctorName(doctor)}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {doctor.specialty}
            </TableCell>
            <TableCell>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                  doctor.isActive ? STATUS_STYLES.active : STATUS_STYLES.inactive,
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    doctor.isActive ? "bg-primary" : "bg-muted-foreground",
                  )}
                />
                {doctor.isActive ? "Activo" : "Inactivo"}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Link to={`/admin/doctors/${doctor.id}/edit`}>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Editar a ${formatDoctorName(doctor)}`}
                    title="Editar"
                  >
                    <PencilIcon className="size-4 text-primary" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setResetTarget(doctor)}
                  aria-label={`Resetear contraseña de ${formatDoctorName(doctor)}`}
                  title="Resetear contraseña"
                >
                  <KeyRound className="size-4 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setDeactivateTarget(doctor)}
                  aria-label={`Desactivar a ${formatDoctorName(doctor)}`}
                  title="Desactivar"
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-coral/15 text-coral">
        <Stethoscope className="size-6" />
      </span>
      <h2 className="mt-4 font-display text-lg font-bold">
        No hay doctores cargados todavía
      </h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Creá el primer doctor para empezar a tomar turnos y administrar el
        consultorio.
      </p>
      <Button className="mt-5 rounded-full" onClick={() => setFormOpen(true)}>
        <PlusIcon className="size-4" />
        Crear el primero
      </Button>
    </div>
  );

  return (
    <main className="flex-1 space-y-6 p-4 md:space-y-8 md:p-8">
      <div className="flex animate-fade-up items-center justify-between gap-4">
        <AdminTitle
          title="Doctores"
          description="Creá, editá y desactivá doctores del catálogo."
        />
        <Button className="rounded-full" onClick={() => setFormOpen(true)}>
          <PlusIcon className="size-4" />
          Nuevo doctor
        </Button>
      </div>

      <section
        className="grid animate-fade-up grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5"
        style={{ animationDelay: "80ms" }}
      >
        <StatCard
          title="Total doctores"
          value={doctors?.length ?? "—"}
          icon={UsersRound}
          loading={isLoading}
        />
        <StatCard
          title="Cuentas activas"
          value={activeCount ?? "—"}
          icon={Stethoscope}
          loading={isLoading}
        />
        <StatCard
          title="Inactivos"
          value={inactiveCount ?? "—"}
          icon={UserX}
          loading={isLoading}
        />
      </section>

      <section
        className="animate-fade-up overflow-hidden rounded-[22px] border border-frost-edge bg-card shadow-sm backdrop-blur-xl"
        style={{ animationDelay: "160ms" }}
      >
        {tableContent}
      </section>

      <DoctorFormDialog open={formOpen} onOpenChange={setFormOpen} />

      <ConfirmDialog
        open={!!deactivateTarget}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
        title={`¿Desactivar a ${deactivateTarget ? formatDoctorName(deactivateTarget) : ""}?`}
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
        title={`¿Resetear la contraseña de ${resetTarget ? formatDoctorName(resetTarget) : ""}?`}
        description="Se genera una contraseña nueva y se le envía por correo al doctor."
        confirmLabel="Sí, resetear"
        onConfirm={() => {
          if (resetTarget) resetPassword.mutate(resetTarget.id);
          setResetTarget(null);
        }}
      />
    </main>
  );
};