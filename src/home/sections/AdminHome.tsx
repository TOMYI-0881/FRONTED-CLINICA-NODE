import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck2, ClipboardList, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDoctors } from "@/doctors/hooks/useDoctors";
import { useCancellationRequests } from "@/cancellation-requests/hooks/useCancellationRequests";
import { getAppointmentsAdminAction } from "@/appointments/actions/get-appointments-admin.action";
import { useAuthStore } from "@/auth/store/auth.store";
import { AdminDoctorsCarousel } from "../components/AdminDoctorsCarousel";

export const AdminHome = () => {
  const user = useAuthStore((state) => state.user);
  const { data: doctors, isLoading } = useDoctors();
  const { data: cancellationRequests } = useCancellationRequests();
  const { data: appointmentsPage } = useQuery({
    queryKey: ["appointments", "admin", "total"],
    queryFn: () => getAppointmentsAdminAction(1, 1),
  });

  const stats = [
    {
      title: "Doctores activos",
      value: doctors?.length ?? "—",
      icon: Stethoscope,
    },
    {
      title: "Citas totales",
      value: appointmentsPage?.total ?? "—",
      icon: CalendarCheck2,
    },
    {
      title: "Cancelaciones pendientes",
      value: cancellationRequests?.length ?? "—",
      icon: ClipboardList,
    },
  ] as const;

  return (
    <>
      <section className="animate-fade-up">
        <p className="text-xs font-bold uppercase text-primary">
          Panel de administración
        </p>
        <h1 className="mt-1 font-display text-3xl font-extrabold">
          Hola, {user?.email.split("@")[0] ?? "Administrador"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen general del sistema de reservas.
        </p>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ title, value, icon: Icon }) => (
          <div
            key={title}
            className="rounded-[22px] border border-frost-edge bg-card p-5 shadow-sm backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {title}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                  {value}
                </p>
              </div>
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-coral-light/60 text-coral">
                <Icon className="size-5" />
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-primary">Catálogo</p>
            <h2 className="mt-1 font-display text-xl font-bold md:text-2xl">
              Doctores del catálogo
            </h2>
          </div>
          <Link
            to="/admin/doctors"
            className="text-sm font-medium text-primary transition-colors hover:underline"
          >
            Ver todos
          </Link>
        </div>
        <AdminDoctorsCarousel doctors={doctors ?? []} isLoading={isLoading} />
      </section>

      <section className="mt-4 rounded-[22px] border border-frost-edge bg-card p-5 shadow-sm backdrop-blur-xl">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
          <ShieldCheck className="size-5 text-primary" />
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Nuevo doctor", to: "/admin/doctors", icon: Stethoscope },
            {
              label: "Pedidos de cancelación",
              to: "/admin/cancellation-requests",
              icon: ClipboardList,
            },
            { label: "Todas las reservas", to: "/admin/appointments", icon: CalendarCheck2 },
            { label: "Control de cola", to: "/admin/queues", icon: ClipboardList },
          ].map(({ label, to, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted"
            >
              <Icon className="size-4 text-muted-foreground" />
              {label}
            </Link>
          ))}
        </div>
        <div className="mt-5">
          <Link to="/admin">
            <Button variant="frost" className="rounded-full">
              Ir a mi panel
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};