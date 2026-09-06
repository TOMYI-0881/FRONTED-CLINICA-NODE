import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";

interface Props {
  query: string;
  onQueryChange: (value: string) => void;
  specialty: string;
  onSpecialtyChange: (value: string) => void;
  specialties: string[];
}

export const SearchBar = ({
  query,
  onQueryChange,
  specialty,
  onSpecialtyChange,
  specialties,
}: Props) => {
  return (
    <section
      className="mt-4 rounded-[22px] border border-frost-edge bg-card p-4 shadow-sm backdrop-blur-xl md:p-5"
      aria-label="Buscar profesionales"
    >
      <p className="mb-3 text-xs font-bold uppercase text-muted-foreground">
        Encontrá a tu profesional
      </p>
      <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_auto]">
        <label className="relative">
          <span className="sr-only">Buscar por nombre o especialidad</span>
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar por nombre o especialidad"
            className="h-11 w-full rounded-xl border border-border bg-background/80 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <label className="relative">
          <span className="sr-only">Filtrar especialidad</span>
          <select
            value={specialty}
            onChange={(event) => onSpecialtyChange(event.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-border bg-background/80 px-4 pr-10 text-sm font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option>Todas las especialidades</option>
            {specialties.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </label>
        <Button className="h-11 rounded-xl px-6">
          <Search />
          Buscar
        </Button>
      </div>
    </section>
  );
};
