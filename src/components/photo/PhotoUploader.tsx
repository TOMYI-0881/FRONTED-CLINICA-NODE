import { useRef } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoctorAvatar } from "@/components/doctor/DoctorAvatar";

interface Props {
  name: string;
  photoUrl?: string | null;
  size?: number;
  pending?: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

// Sube/quita la foto de una persona (doctor o usuario). El archivo debe ser
// JPG, PNG o WebP de hasta 2 MB (validado también por el backend).
export const PhotoUploader = ({
  name,
  photoUrl,
  size = 128,
  pending = false,
  onUpload,
  onRemove,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onUpload(file);
    event.target.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <DoctorAvatar
          name={name}
          photoUrl={photoUrl}
          className="size-full rounded-full border-2 border-frost-edge shadow-sm"
          initialsClassName="text-4xl"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={pending}
          aria-label="Cambiar foto"
          title="Subir nueva foto"
          className="absolute -bottom-1 -right-1 grid size-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105 disabled:opacity-50"
        >
          <Camera className="size-4" />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={pending}
        onChange={handleChange}
      />

      {pending && (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          Guardando...
        </span>
      )}

      {photoUrl && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={pending}
          onClick={onRemove}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="size-4" />
          Quitar foto
        </Button>
      )}
    </div>
  );
};