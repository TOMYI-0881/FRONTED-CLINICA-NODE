import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, type KeyboardEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { CustomLogo } from "@/components/custom/CustomLogo";
import { useAuthStore } from "@/auth/store/auth.store";
import { CustomAuth } from "./CustomAuth";
import { CustomMobileMenu } from "./CustomMobileMenu";

export const CustomHeader = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  const inputRef = useRef<HTMLInputElement>(null);
  const queryParams = searchParams.get("query") || "";

  const submitSearch = (query: string) => {
    if (!query) {
      setSearchParams((prev) => {
        prev.delete("query");
        return prev;
      });
    } else {
      navigate(`/?query=${encodeURIComponent(query)}`);
    }
  };

  const handleSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    submitSearch(event.currentTarget.value);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <CustomMobileMenu user={user} />
            <CustomLogo />
          </div>

          <nav className="hidden md:flex items-center space-x-8"></nav>

          {(!user || user.role === "PATIENT") && (
            <nav
              className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex"
              aria-label="Navegación principal"
            >
              <Link
                to="/"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Profesionales
              </Link>
              <a
                href="#ofertas"
                className="transition-colors hover:text-foreground"
              >
                Ofertas
              </a>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o especialidad..."
                  className="pl-9 w-64 h-9 bg-white"
                  ref={inputRef}
                  onKeyDown={handleSearch}
                  defaultValue={queryParams}
                  key={queryParams}
                />
              </div>
            </div>

            <div className="hidden md:block">
              {!user ? (
                <Link to="/auth/login">
                  <Button variant="default" size="sm" className="ml-2">
                    Iniciar sesión
                  </Button>
                </Link>
              ) : (
                <CustomAuth user={user} />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
