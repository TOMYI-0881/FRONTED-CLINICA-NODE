import type { ReactNode } from "react";
import { ScrollRestoration } from "react-router";
import { useAuthStore } from "@/auth/store/auth.store";
import { PatientHome } from "../sections/PatientHome";
import { AdminHome } from "../sections/AdminHome";
import { DoctorHome } from "../sections/DoctorHome";

export const HomePage = () => {
  const user = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.authStatus);

  const shell = (children: ReactNode) => (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <ScrollRestoration />
      <main
        id="inicio"
        className="relative z-10 mx-auto max-w-7xl px-5 py-6 lg:px-8 lg:py-8"
      >
        {children}
      </main>
    </div>
  );

  if (authStatus === "checking") {
    return shell(
      <div
        className="h-64 animate-pulse rounded-[26px] border border-frost-edge bg-card/60"
        aria-label="Cargando"
      />,
    );
  }

  if (user?.role === "ADMIN") return shell(<AdminHome />);
  if (user?.role === "DOCTOR") return shell(<DoctorHome />);
  return shell(<PatientHome />);
};
