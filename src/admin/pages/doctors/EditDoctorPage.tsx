import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDoctors } from "@/doctors/hooks/useDoctors";
import { useDoctorsAdmin } from "@/admin/hooks/useDoctorsAdmin";
import { useDoctorPhoto } from "@/admin/hooks/useDoctorPhoto";
import { getDoctorProfile } from "@/home/lib/mock-images";
import { DoctorAvatar } from "@/components/doctor/DoctorAvatar";
import { PhotoUploader } from "@/components/photo/PhotoUploader";

export const EditDoctorPage = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { data: doctors, isLoading } = useDoctors();
  const { update } = useDoctorsAdmin();
  const { upload, remove } = useDoctorPhoto();

  const doctor = doctors?.find((item) => item.id === doctorId);

  const [name, setName] = useState(doctor?.name ?? "");
  const [specialty, setSpecialty] = useState(doctor?.specialty ?? "");

  if (isLoading) return <h1 className="p-8">Cargando...</h1>;

  if (!doctor) {
    return (
      <div className="p-8 text-center">
        <h1 className="font-display text-xl font-bold">Doctor no encontrado</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Puede haber sido desactivado o removido.
        </p>
        <div className="mt-6">
          <Link to="/admin/doctors">
            <Button variant="outline">
              <ArrowLeft />
              Volver a doctores
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { place } = getDoctorProfile(doctor);
  const isPending = update.isPending;
  const photoPending = upload.isPending || remove.isPending;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    update.mutate(
      { id: doctor.id, name, specialty },
      { onSuccess: () => navigate("/admin/doctors") },
    );
  };

  return (
    <div className="mx-auto w-[98%] max-w-2xl py-6 md:py-8">
      <Link
        to="/admin/doctors"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver a doctores
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <DoctorAvatar
          name={doctor.name}
          photoUrl={doctor.photoUrl}
          className="size-24 shrink-0 rounded-3xl border border-frost-edge shadow-sm"
          initialsClassName="text-3xl"
        />
        <div>
          <p className="text-xs font-bold uppercase text-primary">
            Editar doctor
          </p>
          <h1 className="mt-1 font-display text-2xl font-extrabold">
            {doctor.name}
          </h1>
          {place && (
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5" />
              {place}
            </p>
          )}
        </div>
      </div>

      <section className="mt-6 rounded-[22px] border border-frost-edge bg-card p-6 shadow-sm backdrop-blur-xl">
        <h2 className="font-display text-base font-bold">Foto de perfil</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          JPG, PNG o WebP de hasta 2 MB.
        </p>
        <div className="mt-4">
          <PhotoUploader
            name={doctor.name}
            photoUrl={doctor.photoUrl}
            size={128}
            pending={photoPending}
            onUpload={(file) => upload.mutate({ id: doctor.id, file })}
            onRemove={() => remove.mutate(doctor.id)}
          />
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-[22px] border border-frost-edge bg-card p-6 shadow-sm backdrop-blur-xl"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="mb-2">
              Nombre
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
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
              onChange={(event) => setSpecialty(event.target.value)}
              required
            />
          </div>
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          Nombre, especialidad y foto se editan desde acá. La cuenta y el
          correo no se modifican.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Link to="/admin/doctors">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
};