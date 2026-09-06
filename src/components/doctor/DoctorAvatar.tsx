import { useState } from "react";
import { resolvePhotoUrl } from "@/lib/photo-url";
import { cn } from "@/lib/utils";

// Avatar de un doctor/persona: muestra la foto real del backend si existe;
// si no (o si la imagen falla), un círculo con las iniciales del nombre.
const getInitials = (name: string) =>
  name
    .replace(/\b(Dr|Dra)[a-z.]*\s*/gi, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

interface Props {
  name: string;
  photoUrl?: string | null;
  className?: string;
  initialsClassName?: string;
  alt?: string;
}

export const DoctorAvatar = ({
  name,
  photoUrl,
  className,
  initialsClassName,
  alt,
}: Props) => {
  const [errored, setErrored] = useState(false);
  const src = resolvePhotoUrl(photoUrl);

  if (src && !errored) {
    return (
      <img
        src={src}
        alt={alt ?? `Foto de ${name}`}
        loading="lazy"
        onError={() => setErrored(true)}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "grid place-items-center bg-coral-light/60 font-display font-bold text-coral",
        className,
        initialsClassName,
      )}
    >
      {getInitials(name)}
    </span>
  );
};