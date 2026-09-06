import { useAuthStore } from "@/auth/store/auth.store";
import { CustomAuth } from "@/layout/components/CustomAuth";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export const AdminHeader = ({ onMenuClick }: HeaderProps) => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-16 px-4 md:px-6 border-b border-border bg-card flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-1">{user && <CustomAuth user={user} />}</div>
    </header>
  );
};
