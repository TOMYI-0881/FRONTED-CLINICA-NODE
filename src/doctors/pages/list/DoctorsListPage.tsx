import { Link, useSearchParams } from "react-router";
import { useAuthStore } from "@/auth/store/auth.store";
import { useDoctors } from "@/doctors/hooks/useDoctors";
import { DoctorsGrid } from "@/doctors/components/DoctorsGrid";
import { Button } from "@/components/ui/button";
import { ShieldUser, Stethoscope } from "lucide-react";

const patientHeader = {
  title: "Reservá tu turno",
  description:
    "Elegí un doctor para ver su disponibilidad o seguir la cola de espera en vivo.",
};

const roleHeader = {
  DOCTOR: {
    title: "Doctores",
    description:
      "Esta es la vista pública del catálogo. Para operar tu cola de hoy o pedir la cancelación de una cita, entrá a tu panel.",
    cta: { to: "/doctor/queue", label: "Ir a mi panel", icon: Stethoscope },
  },
  ADMIN: {
    title: "Doctores",
    description:
      "Vista pública del catálogo, de solo lectura acá. Para crear, editar o desactivar doctores, ve al panel de administración.",
    cta: { to: "/admin/doctors", label: "Ir al panel admin", icon: ShieldUser },
  },
} as const;

export const DoctorsListPage = () => {
  const { data: doctors, isLoading } = useDoctors();
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("query") || "").toLowerCase().trim();
  const role = useAuthStore((state) => state.user?.role);

  const header =
    role === "DOCTOR" || role === "ADMIN" ? roleHeader[role] : patientHeader;
  const cta = "cta" in header ? header.cta : undefined;

  const filtered = query
    ? (doctors ?? []).filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(query) ||
          doctor.specialty.toLowerCase().includes(query),
      )
    : (doctors ?? []);

  return (
    <>
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto flex flex-wrap items-end justify-between gap-4 px-4 py-10 lg:px-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {header.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {header.description}
            </p>
          </div>

          {cta && (
            <Link to={cta.to}>
              <Button variant="outline" size="sm">
                <cta.icon className="size-4" />
                {cta.label}
              </Button>
            </Link>
          )}
        </div>
      </div>

      <DoctorsGrid doctors={filtered} isLoading={isLoading} />
    </>
  );
};
