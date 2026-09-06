import { useEffect, useMemo, useState } from "react";
import { useDoctors } from "@/doctors/hooks/useDoctors";
import { OfferSection } from "../components/OfferSection";
import { SearchBar } from "../components/SearchBar";
import { ProfessionalsSection } from "../components/ProfessionalsSection";

const ALL_SPECIALTIES = "Todas las especialidades";

export const PatientHome = () => {
  const { data: doctors, isLoading } = useDoctors();

  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState(ALL_SPECIALTIES);

  useEffect(() => {
    document.title = "Reservá tu turno | Tomy Salud";
  }, []);

  const specialties = useMemo(
    () =>
      Array.from(
        new Set((doctors ?? []).map((doctor) => doctor.specialty)),
      ).sort((a, b) => a.localeCompare(b, "es")),
    [doctors],
  );

  const filteredDoctors = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    return (doctors ?? []).filter((doctor) => {
      const matchesText = `${doctor.name} ${doctor.specialty}`
        .toLocaleLowerCase("es")
        .includes(normalizedQuery);
      const matchesSpecialty =
        specialty === ALL_SPECIALTIES || doctor.specialty === specialty;
      return matchesText && matchesSpecialty;
    });
  }, [doctors, query, specialty]);

  return (
    <>
      <OfferSection />
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        specialty={specialty}
        onSpecialtyChange={setSpecialty}
        specialties={specialties}
      />
      <ProfessionalsSection
        doctors={filteredDoctors}
        count={filteredDoctors.length}
        isLoading={isLoading}
      />
    </>
  );
};