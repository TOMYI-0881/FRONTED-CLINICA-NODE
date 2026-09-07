import { MapPin } from "lucide-react";
import { useAuthStore } from "@/auth/store/auth.store";
import { useMyDoctorProfile } from "@/doctors/hooks/useMyDoctorProfile";
import { getDoctorProfile } from "@/home/lib/mock-images";
import { PhotoUploader } from "@/components/photo/PhotoUploader";
import { useMyPhoto } from "@/auth/hooks/useMyPhoto";
import { formatDoctorName } from "@/lib/format-doctor-name";

export const DoctorProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const { doctor, isLoading } = useMyDoctorProfile();
  const { upload, remove } = useMyPhoto();

  if (isLoading) return <h1 className="p-8">Cargando...</h1>;

  if (!doctor) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No encontramos tu perfil de doctor.
      </div>
    );
  }

  const { place } = getDoctorProfile(doctor);
  const photoPending = upload.isPending || remove.isPending;

  return (
    <div className="mx-auto max-w-xl space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Mi perfil
        </h1>
        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
      </div>

      <section className="rounded-[22px] border border-frost-edge bg-card p-6 shadow-sm backdrop-blur-xl">
        <h2 className="font-display text-base font-bold">Foto de perfil</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          JPG, PNG o WebP de hasta 2 MB.
        </p>
        <div className="mt-4">
          <PhotoUploader
            name={formatDoctorName(doctor)}
            photoUrl={doctor.photoUrl ?? user?.photoUrl ?? null}
            size={128}
            pending={photoPending}
            onUpload={upload.mutate}
            onRemove={() => remove.mutate(undefined)}
          />
        </div>
      </section>

      <section className="rounded-[22px] border border-frost-edge bg-card p-6 shadow-sm backdrop-blur-xl">
        <dl className="space-y-4">
          <div>
            <dt className="text-xs font-bold uppercase text-primary">
              Nombre
            </dt>
            <dd className="mt-0.5 font-medium">{formatDoctorName(doctor)}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-primary">
              Especialidad
            </dt>
            <dd className="mt-0.5 font-medium">{doctor.specialty}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-primary">Email</dt>
            <dd className="mt-0.5 font-medium">{user?.email}</dd>
          </div>
          {place && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5" />
              {place}
            </div>
          )}
        </dl>
      </section>
    </div>
  );
};