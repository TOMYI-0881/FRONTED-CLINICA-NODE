import { useAuthStore } from "@/auth/store/auth.store";
import { CustomAuth } from "@/layout/components/CustomAuth";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export const AdminHeader = ({ onMenuClick }: HeaderProps) => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-frost-edge bg-background/75 px-4 backdrop-blur-xl md:px-6">
      <div className="flex flex-1 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="-ml-2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-frost hover:text-foreground md:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-1">{user && <CustomAuth user={user} />}</div>
    </header>
  );
};