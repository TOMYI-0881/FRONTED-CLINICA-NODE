import { useAuthStore } from "@/auth/store/auth.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/interfaces/user.interface";
import {
  ChevronDown,
  CalendarClock,
  LogOut,
  ShieldUser,
  Stethoscope,
} from "lucide-react";
import { Link, useLocation } from "react-router";

interface Props {
  user: User;
}

const roleLabel: Record<User["role"], string> = {
  PATIENT: "Paciente",
  DOCTOR: "Doctor/a",
  ADMIN: "Administrador/a",
};

export const CustomAuth = ({ user }: Props) => {
  const location = useLocation();
  const initials = user.email.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center ml-4 gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring/30 data-[state=open]:border-foreground">
          <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {initials}
          </span>
          <span className="hidden sm:inline">{roleLabel[user.role]}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 border border-white/20 bg-background/80 backdrop-blur-md"
      >
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="font-display text-base font-semibold text-foreground">
            {roleLabel[user.role]}
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {user.role === "PATIENT" && location.pathname !== "/appointments/mine" && (
          <Link to="/appointments/mine">
            <DropdownMenuItem className="cursor-pointer">
              <CalendarClock className="text-muted-foreground" />
              Mis turnos
            </DropdownMenuItem>
          </Link>
        )}

        {user.role === "DOCTOR" && !location.pathname.startsWith("/doctor") && (
          <Link to="/doctor/queue">
            <DropdownMenuItem className="cursor-pointer">
              <Stethoscope className="text-muted-foreground" />
              Panel doctor
            </DropdownMenuItem>
          </Link>
        )}

        {user.role === "ADMIN" && location.pathname !== "/admin" && (
          <Link to="/admin">
            <DropdownMenuItem className="cursor-pointer">
              <ShieldUser className="text-muted-foreground" />
              Panel admin
            </DropdownMenuItem>
          </Link>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={() => useAuthStore.getState().logout()}
        >
          <LogOut className="text-destructive" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
