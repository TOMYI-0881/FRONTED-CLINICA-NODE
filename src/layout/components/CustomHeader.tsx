import { ArrowRight, ChevronDown, Search, Stethoscope, X } from "lucide-react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { CustomLogo } from "@/components/custom/CustomLogo";
import { useAuthStore } from "@/auth/store/auth.store";
import { useDoctors } from "@/doctors/hooks/useDoctors";
import { formatDoctorName } from "@/lib/format-doctor-name";
import { DoctorAvatar } from "@/components/doctor/DoctorAvatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CustomAuth } from "./CustomAuth";
import { CustomMobileMenu } from "./CustomMobileMenu";

interface HeaderDropdownProps {
  label: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  panelClassName?: string;
  children: ReactNode;
}

const HeaderDropdown = ({
  label,
  open,
  onOpen,
  onClose,
  panelClassName,
  children,
}: HeaderDropdownProps) => (
  <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
    <button
      type="button"
      onClick={() => (open ? onClose() : onOpen())}
      aria-haspopup="true"
      aria-expanded={open}
      className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
    >
      {label}
      <ChevronDown
        className={cn("size-4 transition-transform", open && "rotate-180")}
      />
    </button>
    {open && (
      <div
        className={cn(
          "absolute left-1/2 top-full z-50 mt-3 -translate-x-1/2 rounded-[22px] border border-frost-edge bg-card p-3 shadow-lg backdrop-blur-xl",
          panelClassName,
        )}
      >
        {children}
      </div>
    )}
  </div>
);

const headerOffers = [
  {
    tag: "Promoción del mes",
    title: "Check-up general 40% de descuento",
    description: "Análisis, electrocardiograma y consulta clínica.",
  },
  {
    tag: "Cuidá tu mirada",
    title: "Consulta oftalmológica y fondo de ojo",
    description: "Evaluación integral de la visión con precio preferencial.",
  },
  {
    tag: "Prevención",
    title: "Campaña de vacunación sin espera",
    description: "Reservá online y completá tus vacunas de calendario.",
  },
  {
    tag: "Atención 24 hs",
    title: "Urgencias médicas",
    description: "Guardia activa todos los días del año.",
  },
] as const;

interface ProfessionalsModalProps {
  open: boolean;
  onClose: () => void;
}

const ProfessionalsModal = ({ open, onClose }: ProfessionalsModalProps) => {
  const { data: doctors, isLoading } = useDoctors();

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Todos los profesionales"
        className="relative flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-[26px] border border-frost-edge bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase text-primary">
              Profesionales
            </p>
            <h2 className="font-display text-xl font-extrabold md:text-2xl">
              Todos los profesionales
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Elegí un profesional para ver disponibilidad y reservar tu turno.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X />
          </Button>
        </div>

        <div className="overflow-y-auto p-5 md:p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-40 w-full rounded-2xl" />
              ))}
            </div>
          ) : doctors && doctors.length > 0 ? (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...doctors]
                .sort((a, b) => a.name.localeCompare(b.name, "es"))
                .map((doctor) => (
                  <li key={doctor.id}>
                    <Link
                      to={`/doctors/${doctor.id}`}
                      onClick={onClose}
                      className="group block h-full overflow-hidden rounded-2xl border border-frost-edge bg-background/60 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-background hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <DoctorAvatar
                          name={doctor.name}
                          photoUrl={doctor.photoUrl}
                          className="size-16 shrink-0 rounded-full"
                          initialsClassName="text-lg"
                        />
                        <div className="min-w-0">
                          <span className="block truncate font-display text-base font-bold">
                            {formatDoctorName(doctor)}
                          </span>
                          <span className="mt-1 inline-flex max-w-full items-center gap-1.5 rounded-full border border-frost-edge bg-frost px-2.5 py-0.5 text-xs font-semibold text-primary">
                            <Stethoscope className="size-3 shrink-0" />
                            <span className="truncate">{doctor.specialty}</span>
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary/70 px-3 py-2.5 text-sm font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        Ver perfil
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No hay profesionales disponibles.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const CustomHeader = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  const [openMenu, setOpenMenu] = useState<"offers" | null>(null);
  const [professionalsOpen, setProfessionalsOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const queryParams = searchParams.get("query") || "";

  useEffect(() => {
    if (!openMenu) return;
    const handler = () => setOpenMenu(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openMenu]);

  const submitSearch = (query: string) => {
    if (!query) {
      navigate("/");
    } else {
      navigate(`/?query=${encodeURIComponent(query)}`);
    }
  };

  const handleSearch = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    submitSearch(event.currentTarget.value);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <CustomMobileMenu user={user} />
            <CustomLogo />
          </div>

          <nav className="hidden md:flex items-center space-x-8"></nav>

          {(!user || user.role === "PATIENT") && (
            <nav
              className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex"
              aria-label="Navegación principal"
            >
              <button
                type="button"
                onClick={() => setProfessionalsOpen(true)}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Profesionales
              </button>

              <HeaderDropdown
                label="Ofertas"
                open={openMenu === "offers"}
                onOpen={() => setOpenMenu("offers")}
                onClose={() => setOpenMenu(null)}
                panelClassName="w-96"
              >
                <div>
                  <p className="px-1 pb-2 text-xs font-bold uppercase text-primary">
                    Ofertas del mes
                  </p>
                  <ul className="space-y-1">
                    {headerOffers.map((offer) => (
                      <li key={offer.title}>
                        <a
                          href="/#ofertas"
                          onClick={() => setOpenMenu(null)}
                          className="block rounded-xl px-3 py-2 transition-colors hover:bg-secondary"
                        >
                          <span className="block text-[11px] font-bold uppercase text-coral">
                            {offer.tag}
                          </span>
                          <span className="block text-sm font-semibold">
                            {offer.title}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {offer.description}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </HeaderDropdown>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o especialidad..."
                  className="pl-9 w-64 h-9 bg-white"
                  ref={inputRef}
                  onKeyDown={handleSearch}
                  defaultValue={queryParams}
                  key={queryParams}
                />
              </div>
            </div>

            <div className="hidden md:block">
              {!user ? (
                <Link to="/auth/login">
                  <Button variant="default" size="sm" className="ml-2">
                    Iniciar sesión
                  </Button>
                </Link>
              ) : (
                <CustomAuth user={user} />
              )}
            </div>
          </div>
        </div>
      </div>

      {professionalsOpen &&
        createPortal(
          <ProfessionalsModal
            open={professionalsOpen}
            onClose={() => setProfessionalsOpen(false)}
          />,
          document.body,
        )}
    </header>
  );
};