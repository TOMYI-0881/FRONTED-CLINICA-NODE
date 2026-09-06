import { useState } from "react";
import type { FormEvent } from "react";
import { useAuthStore } from "@/auth/store/auth.store";
import { useMyPhoto } from "@/auth/hooks/useMyPhoto";
import { useMyProfile } from "@/auth/hooks/useMyProfile";
import { PhotoUploader } from "@/components/photo/PhotoUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { roleLabel } from "@/lib/role-labels";

export const MyAccountPage = () => {
  const user = useAuthStore((state) => state.user);
  const { upload, remove } = useMyPhoto();
  const { update } = useMyProfile();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  if (!user) return null;

  const photoPending = upload.isPending || remove.isPending;
  const displayName = user.name || user.email;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    update.mutate({ name, email });
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Mi perfil
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Configuración de tu cuenta de {roleLabel.PATIENT.toLowerCase()}.
      </p>

      <div className="mt-6 space-y-6">
        <section className="rounded-[22px] border border-frost-edge bg-card p-6 shadow-sm backdrop-blur-xl">
          <h2 className="font-display text-base font-bold">Foto de perfil</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            JPG, PNG o WebP de hasta 2 MB.
          </p>
          <div className="mt-4">
            <PhotoUploader
              name={displayName}
              photoUrl={user.photoUrl ?? null}
              size={128}
              pending={photoPending}
              onUpload={upload.mutate}
              onRemove={() => remove.mutate(undefined)}
            />
          </div>
        </section>

        <section className="rounded-[22px] border border-frost-edge bg-card p-6 shadow-sm backdrop-blur-xl">
          <h2 className="font-display text-base font-bold">Datos personales</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Este nombre se muestra en la lista de espera al reservar tu turno.
          </p>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="name" className="mb-2">
                Nombre
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                minLength={2}
                maxLength={120}
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={update.isPending}>
                {update.isPending ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};