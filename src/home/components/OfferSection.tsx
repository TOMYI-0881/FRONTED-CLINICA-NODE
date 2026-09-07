import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  ShieldPlus,
  Syringe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getOfferImage, type OfferId } from "@/home/lib/mock-images";

const offers = [
  {
    id: "hospital" as OfferId,
    eyebrow: "Promoción del mes",
    title: "Check-up general con 40% de descuento",
    description:
      "Análisis, electrocardiograma y consulta clínica. Cupos limitados para esta semana.",
    detail: "Ver chequeo completo",
    alt: "Recepción luminosa de Tomy Salúd",
  },
  {
    id: "vision" as OfferId,
    eyebrow: "Cuidá tu mirada",
    title: "Consulta oftalmológica y fondo de ojo",
    description:
      "Evaluación integral de la visión con precio preferencial durante todo el mes.",
    detail: "Conocer el beneficio",
    alt: "Paciente durante una revisión oftalmológica",
  },
  {
    id: "vaccine" as OfferId,
    eyebrow: "Prevención cerca tuyo",
    title: "Campaña de vacunación sin espera",
    description:
      "Reservá online, acercate en el horario elegido y completá tus vacunas de calendario.",
    detail: "Reservar vacunación",
    alt: "Paciente atendido en la campaña de vacunación",
  },
] as const;

export const OfferSection = () => {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setSlide((current) => (current + 1) % offers.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, []);

  const currentOffer = offers[slide];

  const moveSlide = (direction: number) => {
    setSlide(
      (current) => (current + direction + offers.length) % offers.length,
    );
  };

  return (
    <section
      id="ofertas"
      aria-label="Ofertas y accesos del hospital"
      className="grid grid-cols-1 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4"
    >
      <div className="relative overflow-hidden rounded-[26px] border border-frost-edge bg-surface/60 shadow-sm backdrop-blur-2xl md:col-span-3 md:row-span-2">
        <div className="grid min-h-[430px] md:grid-cols-2">
          <div className="relative min-h-64 overflow-hidden md:order-2 md:min-h-0">
            <img
              key={currentOffer.id}
              src={getOfferImage(currentOffer.id)}
              alt={currentOffer.alt}
              width={1024}
              height={1024}
              className="absolute inset-0 size-full animate-fade-up object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/15 to-transparent md:bg-gradient-to-r md:from-surface/80 md:via-transparent md:to-transparent" />
          </div>
          <div className="relative flex flex-col justify-between p-6 md:p-10">
            <div key={`${slide}-copy`} className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-frost-edge bg-frost px-3 py-1 text-xs font-semibold text-primary">
                <span className="size-1.5 rounded-full bg-primary" />
                {currentOffer.eyebrow}
              </span>
              <h1 className="mt-4 text-balance font-display text-3xl font-extrabold leading-[1.08] md:text-[2.55rem]">
                {currentOffer.title}
              </h1>
              <p className="mt-3 max-w-md text-pretty text-sm text-muted-foreground md:text-base">
                {currentOffer.description}
              </p>
              <Button className="mt-5 rounded-full">
                {currentOffer.detail}
                <ArrowRight />
              </Button>
            </div>
            <div className="mt-7 flex items-center justify-between gap-4">
              <div className="flex gap-2">
                <Button
                  variant="frost"
                  size="round"
                  onClick={() => moveSlide(-1)}
                  aria-label="Oferta anterior"
                >
                  <ArrowLeft />
                </Button>
                <Button
                  size="round"
                  onClick={() => moveSlide(1)}
                  aria-label="Oferta siguiente"
                >
                  <ArrowRight />
                </Button>
              </div>
              <div
                className="flex items-center gap-2"
                aria-label={`Oferta ${slide + 1} de ${offers.length}`}
              >
                {offers.map((offer, index) => (
                  <button
                    key={offer.title}
                    onClick={() => setSlide(index)}
                    aria-label={`Ver oferta ${index + 1}`}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      index === slide
                        ? "w-7 bg-primary"
                        : "w-1.5 bg-foreground/20",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <a className="cursor-pointer group relative flex min-h-48 flex-col justify-between overflow-hidden rounded-[22px] border border-frost-edge bg-card p-5 shadow-sm backdrop-blur-xl transition-colors hover:bg-card/90 md:row-span-2">
        <div>
          <span className="grid size-11 place-items-center rounded-xl bg-coral/15 text-coral">
            <FileText />
          </span>
          <p className="mt-5 text-xs font-bold uppercase text-coral">
            Acceso rápido
          </p>
          <h2 className="mt-1 font-display text-xl font-bold">
            Mi carnet digital
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Historial, recetas y resultados siempre a mano.
          </p>
        </div>
        <span className="mt-8 inline-flex items-center gap-1 text-sm font-bold text-coral">
          Abrir{" "}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </a>

      <a
        // href="#ayuda"
        className="cursor-pointer flex items-center justify-between rounded-[22px] border border-frost-edge bg-card p-5 shadow-sm backdrop-blur-xl transition-colors hover:bg-card/90 md:col-span-2"
      >
        <div>
          <p className="text-xs font-bold uppercase text-primary">Urgencias</p>
          <p className="mt-1 text-sm font-semibold">Atención las 24 horas</p>
        </div>
        <span className="grid size-10 place-items-center rounded-full bg-secondary text-primary">
          <ShieldPlus />
        </span>
      </a>
      <a
        // href="#profesionales"
        className="cursor-pointer flex items-center justify-between rounded-[22px] border border-frost-edge bg-card p-5 shadow-sm backdrop-blur-xl transition-colors hover:bg-card/90"
      >
        <div>
          <p className="text-xs font-bold uppercase text-primary">Vacunas</p>
          <p className="mt-1 text-sm font-semibold">Pedí tu turno</p>
        </div>
        <span className="grid size-10 place-items-center rounded-full bg-secondary text-primary">
          <Syringe />
        </span>
      </a>
    </section>
  );
};
