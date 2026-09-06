import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/auth/store/auth.store";
import { CustomAuth } from "@/layout/components/CustomAuth";
import { CalendarDays, CircleUserRound } from "lucide-react";

export const HomeHeader = () => {
  const user = useAuthStore((state) => state.user);
  const isPatientView = !user || user.role === "PATIENT";

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
        <a
          href="#inicio"
          className="flex items-center gap-2.5"
          aria-label="Tomy Turnos, inicio"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-primary font-display text-lg font-extrabold text-primary-foreground shadow-sm">
            T
          </span>
          <span className="leading-none">
            <strong className="block font-display text-lg font-bold">
              Tomy <span className="text-primary">Turnos</span>
            </strong>
            <span className="mt-1 block text-[10px] font-semibold uppercase text-muted-foreground">
              Salud · CABA
            </span>
          </span>
        </a>

        {isPatientView && (
          <nav
            className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex"
            aria-label="Navegación principal"
          >
            <a
              href="#ofertas"
              className="transition-colors hover:text-foreground"
            >
              Ofertas
            </a>
            <a
              href="#profesionales"
              className="transition-colors hover:text-foreground"
            >
              Profesionales
            </a>
            <a href="#ayuda" className="transition-colors hover:text-foreground">
              Ayuda
            </a>
          </nav>
        )}

        <div className="flex items-center gap-2">
          {isPatientView && (
            <>
              <Button
                variant="frost"
                className="hidden rounded-full sm:inline-flex"
              >
                <span className="size-2 animate-gentle-pulse rounded-full bg-coral" />
                Cola en vivo
              </Button>
              <a href="#profesionales" className="hidden sm:block">
                <Button className="rounded-full">
                  <CalendarDays />
                  Reservar turno
                </Button>
              </a>
            </>
          )}

          {user ? (
            <CustomAuth user={user} />
          ) : (
            <Link to="/auth/login">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Iniciar sesión"
                title="Iniciar sesión"
              >
                <CircleUserRound />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};