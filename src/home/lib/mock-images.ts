import type { Doctor } from "@/interfaces/doctor.interface";

import hospitalOffer from "@/assets/hospital-offer.jpg";
import vaccineOffer from "@/assets/offer-vaccine.jpg";
import visionOffer from "@/assets/offer-vision.jpg";

// La foto de perfil viene del backend (Doctor.photoUrl). El único dato que
// queda mockeado acá es la ubicación física, que el backend no expone aún.
const doctorPlaceMap: Record<string, string> = {
  bruno: "Pabellón B · Central",
  diego: "Consultorio 7 · Norte",
  ana: "Consultorio 4 · Central",
  carla: "Consultorio 2 · Centro",
  elena: "Consultorio 9 · Central",
};

const normalize = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const getDoctorProfile = (doctor: Doctor): { place: string | null } => {
  const name = normalize(doctor.name);
  const key = Object.keys(doctorPlaceMap).find((k) => name.includes(k));
  return { place: key ? doctorPlaceMap[key] : null };
};

export type OfferId = "hospital" | "vision" | "vaccine";

export const getOfferImage = (id: OfferId): string => {
  const offerImages: Record<OfferId, string> = {
    hospital: hospitalOffer,
    vision: visionOffer,
    vaccine: vaccineOffer,
  };
  return offerImages[id];
};