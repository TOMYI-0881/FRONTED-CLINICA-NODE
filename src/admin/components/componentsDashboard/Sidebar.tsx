import { useState } from "react";
import {
  Home,
  Stethoscope,
  CalendarCheck2,
  ClipboardList,
  Radio,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { CustomLogo } from "@/components/custom/CustomLogo";
import { DoctorAvatar } from "@/components/doctor/DoctorAvatar";
import { roleLabel } from "@/lib/role-labels";
import { Link, useLocation } from "react-router";
import { useAuthStore } from "@/auth/store/auth.store";

const items = [
  { icon: Home, label: "Dashboard", to: "/admin" },
  { icon: Stethoscope, label: "Doctores", to: "/admin/doctors" },
  { icon: CalendarCheck2, label: "Reservas", to: "/admin/appointments" },
  { icon: ClipboardList, label: "Cancelaciones", to: "/admin/cancellation-requests" },
  { icon: Radio, label: "Control de cola", to: "/admin/queues" },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ mobileOpen = false, onClose }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.user);

  const isActiveRoute = (to: string) => {
    if (to === "/admin") return pathname === "/admin";
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300
          fixed md:relative inset-y-0 left-0 z-40
          ${collapsed ? "w-16" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="h-16 px-4 border-b border-sidebar-border flex items-center justify-between">
          {!collapsed && <CustomLogo subtitle="Admin" />}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="hidden md:flex p-1.5 rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              aria-label="Alternar barra lateral"
            >
              {collapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              aria-label="Cerrar barra lateral"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                      isActiveRoute(item.to)
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                    }`}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!collapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {!collapsed && (
          <div className="p-3 border-t border-sidebar-border">
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
              <DoctorAvatar
                name={user?.name || user?.email || ""}
                photoUrl={user?.photoUrl ?? null}
                className="size-9 shrink-0 rounded-full border border-primary/20 bg-primary font-display text-sm text-white"
                initialsClassName="text-sm"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.name || user?.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user ? roleLabel[user.role] : ""} · {user?.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
