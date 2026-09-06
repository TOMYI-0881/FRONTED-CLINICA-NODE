import { Skeleton } from "@/components/ui/skeleton";
import type { Doctor } from "@/interfaces/doctor.interface";
import { DoctorCard } from "./DoctorCard";

interface Props {
  doctors: Doctor[];
  isLoading: boolean;
}

export const DoctorsGrid = ({ doctors, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="container mx-auto grid grid-cols-1 gap-4 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        No se encontraron doctores.
      </div>
    );
  }

  return (
    <div className="container mx-auto grid grid-cols-1 gap-4 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};
