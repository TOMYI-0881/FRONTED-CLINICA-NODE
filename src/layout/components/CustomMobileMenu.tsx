import { Link } from "react-router";
import {
  Menu,
  CalendarClock,
  LogOut,
  Stethoscope,
  ShieldUser,
  Stethoscope as DoctorsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { User } from "@/interfaces/user.interface";
import { useAuthStore } from "@/auth/store/auth.store";
import { CustomLogo } from "@/components/custom/CustomLogo";

interface Props {
  user: User | null;
}

const menuItemClass =
  "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-secondary";

const sectionLabelClass =
  "mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground";

const roleLabel: Record<User["role"], string> = {
  PATIENT: "Paciente",
  DOCTOR: "Doctor/a",
  ADMIN: "Administrador/a",
};

export const CustomMobileMenu = ({ user }: Props) => {
  const logout = useAuthStore((state) => state.logout);
  const initials = user ? user.email.slice(0, 2).toUpperCase() : "";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 border-border bg-background/95 backdrop-blur-md"
      >
        <SheetHeader className="space-y-1 border-b border-border pb-4">
          <CustomLogo subtitle="Menú" />
          <p className="text-sm text-muted-foreground">
            Reservá turnos y consultá la cola de espera
          </p>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-1 pt-2">
          <section>
            <p className={sectionLabelClass}>Navegación</p>
            <nav className="flex flex-col gap-0.5">
              <SheetClose asChild>
                <Link to="/" className={menuItemClass}>
                  <DoctorsIcon className="size-4 text-muted-foreground" />
                  Doctores
                </Link>
              </SheetClose>
            </nav>
          </section>

          <section className="border-t border-border pt-4">
            <p className={sectionLabelClass}>{user ? "Mi cuenta" : "Acceso"}</p>

            {user ? (
              <>
                <div className="mb-3 flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-semibold text-foreground">
                      {roleLabel[user.role]}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-0.5">
                  {user.role === "PATIENT" && (
                    <SheetClose asChild>
                      <Link to="/appointments/mine" className={menuItemClass}>
                        <CalendarClock className="size-4 text-muted-foreground" />
                        Mis turnos
                      </Link>
                    </SheetClose>
                  )}
                  {user.role === "DOCTOR" && (
                    <SheetClose asChild>
                      <Link to="/doctor/queue" className={menuItemClass}>
                        <Stethoscope className="size-4 text-muted-foreground" />
                        Panel doctor
                      </Link>
                    </SheetClose>
                  )}
                  {user.role === "ADMIN" && (
                    <SheetClose asChild>
                      <Link to="/admin" className={menuItemClass}>
                        <ShieldUser className="size-4 text-muted-foreground" />
                        Panel admin
                      </Link>
                    </SheetClose>
                  )}
                  <SheetClose asChild>
                    <button
                      onClick={logout}
                      className={cn(
                        menuItemClass,
                        "text-destructive hover:text-destructive",
                      )}
                    >
                      <LogOut className="size-4" />
                      Cerrar sesión
                    </button>
                  </SheetClose>
                </div>
              </>
            ) : (
              <SheetClose asChild>
                <Link to="/auth/login">
                  <Button variant="default" className="w-full">
                    Iniciar sesión
                  </Button>
                </Link>
              </SheetClose>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
};
