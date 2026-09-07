import { Link } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DoctorAvatar } from "@/components/doctor/DoctorAvatar";
import { getDoctorProfile } from "@/home/lib/mock-images";
import { formatDateLocal } from "@/lib/format-date";
import { formatDoctorName } from "@/lib/format-doctor-name";
import { CalendarDays, Clock3, MapPin, Radio, Stethoscope } from "lucide-react";
import type { Doctor } from "@/interfaces/doctor.interface";

interface Props {
  doctor: Doctor;
  showLiveCta?: boolean;
}

export const DoctorHero = ({ doctor, showLiveCta = true }: Props) => {
  const { place } = getDoctorProfile(doctor);
  const memberSince = formatDateLocal(doctor.createdAt);

  const tiles = [
    { icon: Stethoscope, label: "Especialidad", value: doctor.specialty },
    { icon: Clock3, label: "Horarios", value: "09:00 - 18:00" },
    { icon: CalendarDays, label: "Miembro desde", value: memberSince },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="overflow-hidden rounded-[26px] border border-frost-edge bg-card p-6 shadow-sm backdrop-blur-xl md:p-8"
    >
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <DoctorAvatar
          name={doctor.name}
          photoUrl={doctor.photoUrl}
          className="size-20 shrink-0 rounded-2xl ring-2 ring-frost-edge md:size-24"
          initialsClassName="text-3xl md:text-4xl"
        />
        <div className="min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wide text-primary">
            {doctor.specialty}
          </span>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-foreground">
            {formatDoctorName(doctor)}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {place && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {place}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              Miembro desde {memberSince}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {tiles.map((tile, index) => (
          <div
            key={tile.label}
            className="animate-fade-up rounded-[18px] border border-frost-edge bg-surface/60 p-4 backdrop-blur-xl transition-transform hover:-translate-y-1"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <span className="grid size-10 place-items-center rounded-xl bg-coral/15 text-coral">
              <tile.icon className="size-5" />
            </span>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              {tile.label}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">
              {tile.value}
            </p>
          </div>
        ))}
      </div>

      {showLiveCta && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          className="mt-6"
        >
          <Link to={`/doctors/${doctor.id}/queue`} className="block">
            <Button className="group relative w-full overflow-hidden rounded-full py-2.5 text-base">
              <span className="relative mr-2 flex size-2.5 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-coral opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-coral" />
              </span>
              <Radio className="size-4 transition-transform group-hover:rotate-12" />
              Ver cola en vivo
            </Button>
          </Link>
        </motion.div>
      )}
    </motion.section>
  );
};