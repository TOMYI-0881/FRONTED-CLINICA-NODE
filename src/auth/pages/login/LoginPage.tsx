import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { LoginForm } from "@/auth/pages/login/LoginForm";
import { RegisterForm } from "@/auth/pages/register/RegisterForm";
import { CalendarClock, Radio, Stethoscope } from "lucide-react";

function getModeFromPath(pathname: string): "login" | "register" {
  return pathname.endsWith("register") ? "register" : "login";
}

const HeroPanel = () => (
  <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-neutral-900 p-8 text-white">
    <div
      className="pointer-events-none absolute inset-0 opacity-40"
      style={{
        background:
          "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25), transparent 60%)",
      }}
    />
    <div className="relative flex items-center gap-2 text-lg font-semibold">
      <Stethoscope className="size-5" />
      Sistema de Reservas Clínicas
    </div>
    <div className="relative space-y-6">
      <p className="text-2xl font-light leading-snug">
        Reservá turnos con tu doctor y seguí la cola de espera en tiempo real.
      </p>
      <ul className="space-y-3 text-sm text-white/80">
        <li className="flex items-center gap-2">
          <CalendarClock className="size-4" />
          Agendá turnos con anticipación
        </li>
        <li className="flex items-center gap-2">
          <Radio className="size-4" />
          Seguí la cola en vivo el día de tu consulta
        </li>
      </ul>
    </div>
  </div>
);

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const mode = getModeFromPath(location.pathname);
  const [formMode, setFormMode] = useState<"login" | "register">(mode);
  const [panelTarget, setPanelTarget] = useState<"login" | "register">(mode);
  const [animating, setAnimating] = useState(false);
  const isRegister = panelTarget === "register";

  const isDesktop = window.innerWidth >= 768;

  const switchTo = (next: "login" | "register") => {
    if (animating || next === formMode) return;
    setAnimating(true);
    setPanelTarget(next);
    setTimeout(
      () => {
        setFormMode(next);
        navigate(next === "register" ? "/auth/register" : "/auth/login");
        setAnimating(false);
      },
      isDesktop ? 520 : 200,
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md md:max-w-5xl">
        <div className="relative overflow-hidden rounded-2xl bg-card shadow-sm border border-border h-auto md:h-[600px] animate-mobile-reveal md:animate-none">
          <div
            className="hidden md:block absolute top-0 h-full w-1/2 z-10 transition-[left] duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={{ left: isRegister ? "0%" : "50%" }}
          >
            <HeroPanel />
          </div>

          <div
            className={`relative md:absolute top-0 h-auto md:h-full w-full md:w-1/2 flex items-center justify-center p-6 md:p-10 md:transition-[left] md:duration-[1100ms] md:ease-[cubic-bezier(0.65,0,0.35,1)] ${isRegister ? "md:left-1/2" : "md:left-0"}`}
          >
            <div className="w-full max-w-sm">
              <div key={formMode} className="animate-in fade-in duration-300">
                {formMode === "register" ? (
                  <RegisterForm onSwitch={() => switchTo("login")} />
                ) : (
                  <LoginForm onSwitch={() => switchTo("register")} />
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Al hacer clic en continuar, aceptas nuestros{" "}
          <a className="underline" href="#">
            Términos de Servicio
          </a>{" "}
          y{" "}
          <a className="underline" href="#">
            Política de Privacidad
          </a>
          .
        </p>
      </div>
    </div>
  );
}
