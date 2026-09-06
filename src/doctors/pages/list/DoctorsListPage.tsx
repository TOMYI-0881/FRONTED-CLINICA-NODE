import { useSearchParams } from "react-router";
import { useDoctors } from "@/doctors/hooks/useDoctors";
import { DoctorsGrid } from "@/doctors/components/DoctorsGrid";

export const DoctorsListPage = () => {
  const { data: doctors, isLoading } = useDoctors();
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("query") || "").toLowerCase().trim();

  const filtered = query
    ? (doctors ?? []).filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(query) ||
          doctor.specialty.toLowerCase().includes(query),
      )
    : (doctors ?? []);

  return (
    <>
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-10 lg:px-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Reservá tu turno
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Elegí un doctor para ver su disponibilidad o seguir la cola de
            espera en vivo.
          </p>
        </div>
      </div>

      <DoctorsGrid doctors={filtered} isLoading={isLoading} />
    </>
  );
};
