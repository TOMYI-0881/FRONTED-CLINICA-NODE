import { useQuery } from "@tanstack/react-query";
import { CalendarCheck2, ClipboardList, Stethoscope } from "lucide-react";

import StatCard from "@/admin/components/componentsDashboard/StatCard";
import QuickActions from "@/admin/components/componentsDashboard/QuickActions";
import { AdminTitle } from "@/admin/components/AdminTitle";
import { useDoctors } from "@/doctors/hooks/useDoctors";
import { useCancellationRequests } from "@/cancellation-requests/hooks/useCancellationRequests";
import { getAppointmentsAdminAction } from "@/appointments/actions/get-appointments-admin.action";

export const DashboardPage = () => {
  const { data: doctors } = useDoctors();
  const { data: cancellationRequests } = useCancellationRequests();
  const { data: appointmentsPage } = useQuery({
    queryKey: ["appointments", "admin", "total"],
    queryFn: () => getAppointmentsAdminAction(1, 1),
  });

  return (
    <main className="flex-1 p-4 md:p-8 space-y-6 md:space-y-8">
      <AdminTitle
        title="Dashboard"
        description="Resumen general del sistema de reservas."
      />

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
        <StatCard
          title="Doctores activos"
          value={doctors?.length ?? "—"}
          icon={Stethoscope}
        />
        <StatCard
          title="Citas totales"
          value={appointmentsPage?.total ?? "—"}
          icon={CalendarCheck2}
        />
        <StatCard
          title="Cancelaciones pendientes"
          value={cancellationRequests?.length ?? "—"}
          icon={ClipboardList}
        />
      </section>

      <section className="max-w-md">
        <QuickActions />
      </section>
    </main>
  );
};
