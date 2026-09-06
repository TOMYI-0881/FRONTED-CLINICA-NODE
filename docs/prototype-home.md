# Prototipo original de la home (rebranding "Tomy Turnos")

Respaldo del prototipo `index.tsx` (raíz) que se migró a `src/home/`.
Migra a `react-router` (la app no usa `@tanstack/react-router`) y las fotos
ahora salen del mock de `src/home/lib/mock-images.ts` (assets locales, swapeable
por endpoint más adelante).

```tsx
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  CircleUserRound,
  Clock3,
  FileText,
  MapPin,
  Search,
  ShieldPlus,
  Stethoscope,
  Syringe,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import doctorAna from "@/assets/doctor-ana.jpg";
import doctorBruno from "@/assets/doctor-bruno.jpg";
import doctorCarla from "@/assets/doctor-carla.jpg";
import doctorDiego from "@/assets/doctor-diego.jpg";
import doctorElena from "@/assets/doctor-elena.jpg";
import hospitalOffer from "@/assets/hospital-offer.jpg";
import visionOffer from "@/assets/offer-vision.jpg";
import vaccineOffer from "@/assets/offer-vaccine.jpg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reservá tu turno | Tomy Salud" },
      {
        name: "description",
        content: "Encontrá especialistas, reservá tu turno y descubrí ofertas de salud en Tomy.",
      },
      { property: "og:title", content: "Reservá tu turno | Tomy Salud" },
      {
        property: "og:description",
        content: "Especialistas, turnos y beneficios de salud en un solo lugar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const offers = [
  {
    eyebrow: "Promoción del mes",
    title: "Check-up general con 40% de descuento",
    description: "Análisis, electrocardiograma y consulta clínica. Cupos limitados para esta semana.",
    detail: "Ver chequeo completo",
    image: hospitalOffer,
    alt: "Recepción luminosa de Tomy Salud",
  },
  {
    eyebrow: "Cuidá tu mirada",
    title: "Consulta oftalmológica y fondo de ojo",
    description: "Evaluación integral de la visión con precio preferencial durante todo el mes.",
    detail: "Conocer el beneficio",
    image: visionOffer,
    alt: "Paciente durante una revisión oftalmológica",
  },
  {
    eyebrow: "Prevención cerca tuyo",
    title: "Campaña de vacunación sin espera",
    description: "Reservá online, acercate en el horario elegido y completá tus vacunas de calendario.",
    detail: "Reservar vacunación",
    image: vaccineOffer,
    alt: "Paciente atendido en la campaña de vacunación",
  },
] as const;

const doctors = [
  { name: "Dr. Bruno Gimenez", specialty: "Pediatría", place: "Pabellón B · Central", image: doctorBruno },
  { name: "Dr. Diego Martinez", specialty: "Traumatología", place: "Consultorio 7 · Norte", image: doctorDiego },
  { name: "Dra. Ana Fernandez", specialty: "Cardiología", place: "Consultorio 4 · Central", image: doctorAna },
  { name: "Dra. Carla Lopez", specialty: "Dermatología", place: "Consultorio 2 · Centro", image: doctorCarla },
  { name: "Dra. Elena Suarez", specialty: "Clínica Médica", place: "Consultorio 9 · Central", image: doctorElena },
] as const;

function Index() {
  const [slide, setSlide] = useState(0);
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("Todas las especialidades");

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % offers.length), 6500);
    return () => window.clearInterval(timer);
  }, []);

  const filteredDoctors = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    return doctors.filter((doctor) => {
      const matchesText = `${doctor.name} ${doctor.specialty}`.toLocaleLowerCase("es").includes(normalizedQuery);
      const matchesSpecialty = specialty === "Todas las especialidades" || doctor.specialty === specialty;
      return matchesText && matchesSpecialty;
    });
  }, [query, specialty]);

  const currentOffer = offers[slide];
  const moveSlide = (direction: number) => {
    setSlide((current) => (current + direction + offers.length) % offers.length);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
          <a href="#inicio" className="flex items-center gap-2.5" aria-label="Tomy Turnos, inicio">
            <span className="grid size-9 place-items-center rounded-xl bg-primary font-display text-lg font-extrabold text-primary-foreground shadow-sm">T</span>
            <span className="leading-none">
              <strong className="block font-display text-lg font-bold">Tomy <span className="text-primary">Turnos</span></strong>
              <span className="mt-1 block text-[10px] font-semibold uppercase text-muted-foreground">Salud · CABA</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex" aria-label="Navegación principal">
            <a href="#ofertas" className="transition-colors hover:text-foreground">Ofertas</a>
            <a href="#profesionales" className="transition-colors hover:text-foreground">Profesionales</a>
            <a href="#ayuda" className="transition-colors hover:text-foreground">Ayuda</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="frost" className="hidden rounded-full sm:inline-flex">
              <span className="size-2 animate-gentle-pulse rounded-full bg-coral" /> Cola en vivo
            </Button>
            <Button className="rounded-full"><CalendarDays /> Reservar turno</Button>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Abrir perfil"><CircleUserRound /></Button>
          </div>
        </div>
      </header>

      <main id="inicio" className="relative z-10 mx-auto max-w-7xl px-5 py-6 lg:px-8 lg:py-8">
        <section id="ofertas" aria-label="Ofertas y accesos del hospital" className="grid grid-cols-1 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4">
          <div className="relative overflow-hidden rounded-[26px] border border-frost-edge bg-surface/60 shadow-sm backdrop-blur-2xl md:col-span-3 md:row-span-2">
            <div className="grid min-h-[430px] md:grid-cols-2">
              <div className="relative min-h-64 overflow-hidden md:order-2 md:min-h-0">
                <img key={currentOffer.image} src={currentOffer.image} alt={currentOffer.alt} width={1024} height={1024} className="absolute inset-0 size-full animate-fade-up object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/15 to-transparent md:bg-gradient-to-r md:from-surface/80 md:via-transparent md:to-transparent" />
              </div>
              <div className="relative flex flex-col justify-between p-6 md:p-10">
                <div key={`${slide}-copy`} className="animate-fade-up">
                  <span className="inline-flex items-center gap-2 rounded-full border border-frost-edge bg-frost px-3 py-1 text-xs font-semibold text-primary">
                    <span className="size-1.5 rounded-full bg-primary" />{currentOffer.eyebrow}
                  </span>
                  <h1 className="mt-4 text-balance font-display text-3xl font-extrabold leading-[1.08] md:text-[2.55rem]">{currentOffer.title}</h1>
                  <p className="mt-3 max-w-md text-pretty text-sm text-muted-foreground md:text-base">{currentOffer.description}</p>
                  <Button className="mt-5 rounded-full">{currentOffer.detail}<ArrowRight /></Button>
                </div>
                <div className="mt-7 flex items-center justify-between gap-4">
                  <div className="flex gap-2">
                    <Button variant="frost" size="round" onClick={() => moveSlide(-1)} aria-label="Oferta anterior"><ArrowLeft /></Button>
                    <Button size="round" onClick={() => moveSlide(1)} aria-label="Oferta siguiente"><ArrowRight /></Button>
                  </div>
                  <div className="flex items-center gap-2" aria-label={`Oferta ${slide + 1} de ${offers.length}`}>
                    {offers.map((offer, index) => (
                      <button key={offer.title} onClick={() => setSlide(index)} aria-label={`Ver oferta ${index + 1}`} className={cn("h-1.5 rounded-full transition-all", index === slide ? "w-7 bg-primary" : "w-1.5 bg-foreground/20")} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <a href="#profesionales" className="group relative flex min-h-48 flex-col justify-between overflow-hidden rounded-[22px] border border-frost-edge bg-card p-5 shadow-sm backdrop-blur-xl transition-colors hover:bg-card/90 md:row-span-2">
            <div>
              <span className="grid size-11 place-items-center rounded-xl bg-coral/15 text-coral"><FileText /></span>
              <p className="mt-5 text-xs font-bold uppercase text-coral">Acceso rápido</p>
              <h2 className="mt-1 font-display text-xl font-bold">Mi carnet digital</h2>
              <p className="mt-2 text-sm text-muted-foreground">Historial, recetas y resultados siempre a mano.</p>
            </div>
            <span className="mt-8 inline-flex items-center gap-1 text-sm font-bold text-coral">Abrir <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
          </a>

          <a href="#ayuda" className="flex items-center justify-between rounded-[22px] border border-frost-edge bg-card p-5 shadow-sm backdrop-blur-xl transition-colors hover:bg-card/90 md:col-span-2">
            <div><p className="text-xs font-bold uppercase text-primary">Urgencias</p><p className="mt-1 text-sm font-semibold">Atención las 24 horas</p></div>
            <span className="grid size-10 place-items-center rounded-full bg-secondary text-primary"><ShieldPlus /></span>
          </a>
          <a href="#profesionales" className="flex items-center justify-between rounded-[22px] border border-frost-edge bg-card p-5 shadow-sm backdrop-blur-xl transition-colors hover:bg-card/90">
            <div><p className="text-xs font-bold uppercase text-primary">Vacunas</p><p className="mt-1 text-sm font-semibold">Pedí tu turno</p></div>
            <span className="grid size-10 place-items-center rounded-full bg-secondary text-primary"><Syringe /></span>
          </a>
        </section>

        <section className="mt-4 rounded-[22px] border border-frost-edge bg-card p-4 shadow-sm backdrop-blur-xl md:p-5" aria-label="Buscar profesionales">
          <p className="mb-3 text-xs font-bold uppercase text-muted-foreground">Encontrá a tu profesional</p>
          <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_auto]">
            <label className="relative">
              <span className="sr-only">Buscar por nombre o especialidad</span>
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre o especialidad" className="h-11 w-full rounded-xl border border-border bg-background/80 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </label>
            <label className="relative">
              <span className="sr-only">Filtrar especialidad</span>
              <select value={specialty} onChange={(event) => setSpecialty(event.target.value)} className="h-11 w-full appearance-none rounded-xl border border-border bg-background/80 px-4 pr-10 text-sm font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>Todas las especialidades</option>
                {doctors.map((doctor) => <option key={doctor.specialty}>{doctor.specialty}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </label>
            <Button className="h-11 rounded-xl px-6"><Search /> Buscar</Button>
          </div>
        </section>

        <section id="profesionales" className="mt-8 scroll-mt-24">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><p className="text-xs font-bold uppercase text-primary">Turnos disponibles</p><h2 className="mt-1 font-display text-2xl font-extrabold md:text-3xl">Profesionales cerca tuyo</h2></div>
            <span className="text-sm font-semibold text-muted-foreground">{filteredDoctors.length} profesionales</span>
          </div>
          {filteredDoctors.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {filteredDoctors.map((doctor, index) => (
                <article key={doctor.name} className="animate-fade-up overflow-hidden rounded-[22px] border border-frost-edge bg-card p-3 shadow-sm backdrop-blur-xl transition-transform hover:-translate-y-1" style={{ animationDelay: `${index * 70}ms` }}>
                  <img src={doctor.image} alt={`Retrato de ${doctor.name}`} width={512} height={512} loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />
                  <div className="px-1 pb-1 pt-3">
                    <span className="text-[11px] font-bold uppercase text-primary">{doctor.specialty}</span>
                    <h3 className="mt-1 font-display text-base font-bold">{doctor.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" />{doctor.place}</p>
                    <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                      <Button className="rounded-xl"><CalendarDays /> Reservar</Button>
                      <Button variant="frost" size="icon" className="rounded-xl" aria-label={`Ver cola de ${doctor.name}`} title="Cola en vivo"><Clock3 /></Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[22px] border border-border bg-card px-5 py-12 text-center">
              <Stethoscope className="mx-auto size-8 text-primary" />
              <h3 className="mt-3 font-display font-bold">No encontramos profesionales</h3>
              <p className="mt-1 text-sm text-muted-foreground">Probá con otro nombre o especialidad.</p>
            </div>
          )}
        </section>
      </main>

      <footer id="ayuda" className="relative z-10 mt-12 border-t border-border bg-secondary/45">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-lg bg-primary font-display font-bold text-primary-foreground">T</span><strong className="font-display">Tomy Turnos</strong></div><p className="mt-3 max-w-xs text-sm text-muted-foreground">Reservas de salud claras, humanas y cerca de vos.</p></div>
          <div><p className="text-xs font-bold uppercase text-muted-foreground">Atención</p><ul className="mt-3 space-y-2 text-sm"><li><a href="#profesionales">Reservar turno</a></li><li><a href="#inicio">Cola en vivo</a></li></ul></div>
          <div><p className="text-xs font-bold uppercase text-muted-foreground">Profesionales</p><ul className="mt-3 space-y-2 text-sm"><li><a href="#profesionales">Especialidades</a></li><li><a href="#profesionales">Ver doctores</a></li></ul></div>
          <div><p className="text-xs font-bold uppercase text-muted-foreground">Ayuda</p><ul className="mt-3 space-y-2 text-sm"><li><a href="mailto:hola@tomyturnos.ar">Contacto</a></li><li><a href="#inicio">Preguntas frecuentes</a></li></ul></div>
        </div>
        <div className="mx-auto max-w-7xl border-t border-border px-5 py-5 text-xs text-muted-foreground lg:px-8">© 2026 Tomy Salud. Todos los derechos reservados.</div>
      </footer>
    </div>
  );
}
```