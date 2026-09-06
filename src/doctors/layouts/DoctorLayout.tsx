import { Link, Outlet, ScrollRestoration, useLocation } from "react-router";
import { CalendarClock, LogOut, Radio, UserRound } from "lucide-react";
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

      <div className="border-b border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground lg:px-8">
        <Link
          to="/doctor/profile"
          className="group inline-flex items-center gap-2"
          title="Mi perfil"
        >
          <DoctorAvatar
            name={user?.name ?? user?.email ?? ""}
            photoUrl={user?.photoUrl ?? null}
            className="size-8 rounded-full border border-border bg-background"
            initialsClassName="text-xs"
          />
          <span className="font-medium text-foreground group-hover:underline">
            {user?.email}
          </span>
        </Link>
      </div>

      <Outlet />
    </div>
  );
};

export default DoctorLayout;
