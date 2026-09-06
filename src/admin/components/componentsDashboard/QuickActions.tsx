import { CalendarCheck2, ClipboardList, Stethoscope, Radio } from "lucide-react";
import { Link } from "react-router";

const actions = [
  { icon: Stethoscope, label: "Nuevo doctor", to: "/admin/doctors" },
  { icon: ClipboardList, label: "Pedidos de cancelación", to: "/admin/cancellation-requests" },
  { icon: CalendarCheck2, label: "Todas las reservas", to: "/admin/appointments" },
  { icon: Radio, label: "Control de cola", to: "/admin/queues" },
];

export default function QuickActions() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-base font-semibold text-foreground tracking-tight mb-5">
        Accesos Rápidos
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map(({ icon: Icon, label, to }) => (
          <Link
            key={label}
            to={to}
            className="group flex items-center gap-2.5 px-3 py-2.5 rounded-md bg-muted/40 border border-border hover:border-primary/40 hover:bg-muted transition-colors text-left"
          >
            <span className="h-7 w-7 rounded-md bg-card border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
              <Icon size={14} />
            </span>
            <span className="text-sm font-medium text-foreground">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
