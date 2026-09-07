import {
  ArrowRight,
  CalendarCheck2,
  ClipboardList,
  Radio,
  Stethoscope,
} from "lucide-react";
import { Link } from "react-router";

const actions = [
  { icon: Stethoscope, label: "Nuevo doctor", to: "/admin/doctors" },
  { icon: ClipboardList, label: "Pedidos de cancelación", to: "/admin/cancellation-requests" },
  { icon: CalendarCheck2, label: "Todas las reservas", to: "/admin/appointments" },
  { icon: Radio, label: "Control de cola", to: "/admin/queues" },
];

export default function QuickActions() {
  return (
    <div className="rounded-[22px] border border-frost-edge bg-card p-6 shadow-sm backdrop-blur-xl">
      <h2 className="mb-5 flex items-center gap-2.5 font-display text-lg font-bold">
        <span className="grid size-9 place-items-center rounded-xl bg-coral/15 text-coral">
          <Radio className="size-4" />
        </span>
        Accesos rápidos
      </h2>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {actions.map(({ icon: Icon, label, to }) => (
          <Link
            key={label}
            to={to}
            className="group flex items-center gap-3 rounded-2xl border border-frost-edge bg-surface/60 p-3 text-left shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-coral/40 hover:bg-card"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-coral/15 text-coral">
              <Icon className="size-5" />
            </span>
            <span className="flex-1 text-sm font-semibold text-foreground">
              {label}
            </span>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </div>
  );
}