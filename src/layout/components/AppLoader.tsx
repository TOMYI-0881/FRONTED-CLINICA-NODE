import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { UserRole } from "@/interfaces/user.interface";

interface AppLoaderProps {
  onComplete?: () => void;
}

const ROLE_LABEL: Record<UserRole, string> = {
  PATIENT: "Salud",
  DOCTOR: "Doctor",
  ADMIN: "Admin",
};

// El rol se lee de la sesión persistida (localStorage) de forma síncrona: el
// store recién lo hidrata cuando checkAuthStatus resuelve, y depender de esa
// actualización haría que la etiqueta "saltara" a mitad de la animación.
const getStoredRole = (): UserRole | undefined => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return undefined;
    const { role } = JSON.parse(raw) as { role?: UserRole };
    return role;
  } catch {
    return undefined;
  }
};

export function AppLoader({ onComplete }: AppLoaderProps) {
  const [phase, setPhase] = useState<"intro" | "revealing" | "done">("intro");
  const [role] = useState<UserRole | undefined>(getStoredRole);
  const label = role ? ROLE_LABEL[role] : "Salud";

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("revealing"), 600);
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="app-loader"
          className="fixed inset-0 z-[9999] overflow-hidden"
          style={{ backgroundColor: "#FAFAFA" }}
          initial={{ clipPath: "circle(150% at 50% 50%)" }}
          animate={
            phase === "revealing"
              ? { clipPath: "circle(0% at 50% 50%)" }
              : { clipPath: "circle(150% at 50% 50%)" }
          }
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0.6, scale: 1 }}
            animate={
              phase === "revealing"
                ? { opacity: 1, scale: 1.4 }
                : { opacity: [0.6, 1, 0.75, 1], scale: [1, 1.05, 0.97, 1.05] }
            }
            transition={
              phase === "revealing"
                ? { duration: 0.5, ease: "easeOut" }
                : { duration: 1.2, ease: "easeInOut", times: [0, 0.3, 0.6, 1] }
            }
            style={{
              width: "70vmin",
              height: "70vmin",
              background:
                "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(245,245,245,0.8) 30%, rgba(230,230,230,0) 70%)",
              // Blur moderado: mantiene el resplandor pero evita el costo de
              // pintado de blur(20px) que nota lag en pantallas pequenas.
              filter: "blur(14px)",
              willChange: "transform, opacity",
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex flex-col items-center">
              <div className="flex items-baseline gap-3">
                <span className="font-montserrat font-bold text-6xl m-0 whitespace-nowrap">
                  Tomyi |
                </span>
                <p className="text-muted-foreground text-3xl m-0 px-2 whitespace-nowrap">
                  {label}
                </p>
              </div>
              <motion.div
                className="mt-8 h-px bg-neutral-900"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "60%", opacity: 0.35 }}
                transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
                className="mt-5 text-[10px] font-light tracking-[0.45em] text-black"
              >
TURNOS · COLA EN VIVO · DOCTORES
                </motion.p>
              </div>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AppLoader;
