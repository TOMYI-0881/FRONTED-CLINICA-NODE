import { useAuthStore } from "@/auth/store/auth.store";
import { CustomLogo } from "@/components/custom/CustomLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [isPosting, setIsPosting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPosting(true);

    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const isValid = await useAuthStore.getState().register(email, password);
    if (isValid) {
      navigate("/");
      return;
    }
    setIsPosting(false);
  };

  return (
    <div>
      <CustomLogo subtitle="Registro" />
      <p className="mt-2 text-sm text-muted-foreground">
        Creá tu cuenta de paciente para reservar turnos.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleRegister}>
        <div>
          <label className="text-sm font-semibold">Correo electrónico</label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="tu@email.com"
            autoComplete="email"
            className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Contraseña</label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              minLength={6}
              className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute translate-y-0.5 pt-0.5 top-0 bottom-0 right-3 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Mínimo 6 caracteres.</p>
        </div>
        <Button
          className="h-11 w-full rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          type="submit"
          disabled={isPosting}
        >
          Crear cuenta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm">
        ¿Ya tenés una cuenta?{" "}
        <Button
          onClick={onSwitch}
          variant="link"
          className="font-semibold underline underline-offset-4"
        >
          Iniciar sesión
        </Button>
      </p>
    </div>
  );
}
