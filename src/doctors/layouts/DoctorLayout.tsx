import { Link, Outlet, ScrollRestoration, useLocation } from "react-router";
import { CalendarClock, ChevronRight, LogOut, Radio, UserRound } from "lucide-react";
import { CustomLogo } from "@/components/custom/CustomLogo";
import { useAuthStore } from "@/auth/store/auth.store";
import { DoctorAvatar } from "@/components/doctor/DoctorAvatar";
import { cn } from "@/lib/utils";

const items = [
  { to: "/doctor/queue", label: "Mi cola", icon: Radio },
  { to: "/doctor/appointments", label: "Mis citas", icon: CalendarClock },
  { to: "/doctor/profile", label: "Mi perfil", icon: UserRound },
];

const DoctorLayout = () => {
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollRestoration />
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-8">
        <CustomLogo subtitle="Panel doctor" />
        <nav className="flex items-center gap-1">
          {items.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
          <button
            onClick={logout}
            className="ml-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </nav>
      </header>

      <div className="border-b border-frost-edge bg-gradient-to-r from-coral-light/50 via-frost to-transparent px-4 py-2 lg:px-8">
        <Link
          to="/doctor/profile"
          className="group inline-flex items-center gap-3 rounded-xl px-1.5 py-1 transition-colors hover:bg-card/70"
          title="Mi perfil"
        >
          <span className="relative shrink-0">
            <DoctorAvatar
              name={user?.name ?? user?.email ?? ""}
              photoUrl={user?.photoUrl ?? null}
              className="size-9 rounded-full ring-2 ring-coral/60"
              initialsClassName="text-xs"
            />
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-coral ring-2 ring-background" />
          </span>
          <span className="grid min-w-0 gap-0.5">
            <span className="truncate text-xs font-semibold text-foreground group-hover:underline">
              {user?.name ?? user?.email}
            </span>
            <span className="truncate text-[0.7rem] text-muted-foreground">
              {user?.email}
            </span>
          </span>
          <ChevronRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
        </Link>
      </div>

      <Outlet />
    </div>
  );
};

export default DoctorLayout;
