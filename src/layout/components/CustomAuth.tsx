import { useAuthStore } from "@/auth/store/auth.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DoctorAvatar } from "@/components/doctor/DoctorAvatar";
import { roleLabel } from "@/lib/role-labels";
import type { User } from "@/interfaces/user.interface";
import {
  ChevronDown,
  CalendarClock,
  LogOut,
  ShieldUser,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { Link, useLocation } from "react-router";

interface Props {
  user: User;
}

export const CustomAuth = ({ user }: Props) => {
  const location = useLocation();
  const displayName = user.name || user.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center ml-4 gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring/30 data-[state=open]:border-foreground">
          <DoctorAvatar
            name={displayName}
            photoUrl={user.photoUrl ?? null}
            className="size-7 shrink-0 rounded-full"
            initialsClassName="text-[10px]"
          />
          <span className="hidden max-w-[140px] truncate sm:inline">
            {displayName}
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 border border-white/20 bg-background/80 backdrop-blur-md"
      >
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="font-display text-base font-semibold text-foreground">
            {displayName}
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            {roleLabel[user.role]}
          </span>
          <span className="text-xs font-normal text-muted-foreground/70">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {user.role === "PATIENT" && (
          <>
            {location.pathname !== "/account" && (
              <Link to="/account">
                <DropdownMenuItem className="cursor-pointer">
                  <UserRound className="text-muted-foreground" />
                  Mi perfil
                </DropdownMenuItem>
              </Link>
            )}
            {location.pathname !== "/appointments/mine" && (
              <Link to="/appointments/mine">
                <DropdownMenuItem className="cursor-pointer">
                  <CalendarClock className="text-muted-foreground" />
                  Mis turnos
                </DropdownMenuItem>
              </Link>
            )}
          </>
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