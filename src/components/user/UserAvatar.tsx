import { useState } from "react";
import { resolvePhotoUrl } from "@/lib/photo-url";
import { cn } from "@/lib/utils";

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
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

export const UserAvatar = ({
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
        "grid place-items-center rounded-full bg-muted font-semibold text-foreground",
        className,
        initialsClassName,
      )}
    >
      {getInitials(name)}
    </span>
  );
};