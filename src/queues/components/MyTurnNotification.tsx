import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/auth/store/auth.store";
import { useMyAppointments } from "@/appointments/hooks/useMyAppointments";
import { useDoctors } from "@/doctors/hooks/useDoctors";
import { useQueue } from "@/queues/hooks/useQueue";
import { todayApiDate } from "@/lib/format-date";
import { Radio } from "lucide-react";
import type { Turn } from "@/interfaces/queue.interface";

interface TurnAlert {
  appointmentId: string;
  turnNumber: number;
  doctorId: string;
  doctorName: string;
}

// Dos tonos ascendentes cortos (tipo "llamado"). Si el navegador bloquea el
// audio por políticas de autoplay, falla en silencio sin romper el flujo.
const playCallSound = () => {
  try {
    const AudioContextCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextCtor) return;
    const ctx = new AudioContextCtor();
    if (ctx.state === "suspended") {
      void ctx.resume();
    }
    const tones = [660, 880];
    tones.forEach((freq, index) => {
      const start = ctx.currentTime + index * 0.18;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.2, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.5);
    });
    window.setTimeout(() => {
      void ctx.close();
    }, 1500);
  } catch {
    // Audio bloqueado: no hacemos nada.
  }
};

const TurnAlertOverlay = ({
  alert,
  onDismiss,
}: {
  alert: TurnAlert;
  onDismiss: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] grid place-items-center bg-foreground/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Es tu turno"
    >
      <motion.div
        initial={{ scale: 0.9, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 12, opacity: 0 }}
        transition={{ type: "spring", damping: 18, stiffness: 220 }}
        className="w-full max-w-md rounded-[26px] border border-frost-edge bg-card p-8 text-center shadow-2xl backdrop-blur-xl"
      >
        <div className="relative mx-auto grid size-16 place-items-center rounded-full bg-coral/15 text-coral">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-coral/30" />
          <Radio className="relative size-7" />
        </div>

        <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-foreground">
          ¡Es tu turno!
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{alert.doctorName}</p>

        <p className="mt-4 inline-block rounded-full bg-primary px-5 py-2 font-display text-3xl font-extrabold text-primary-foreground">
          Turno #{alert.turnNumber}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Ya podés pasar al consultorio.
        </p>

        <Button
          variant="frost"
          className="mt-6 w-full rounded-full py-2.5"
          onClick={onDismiss}
        >
          Entendido
        </Button>
      </motion.div>
    </motion.div>
  );
};

// Escucha la cola de cada doctor donde el paciente tiene cita hoy y avisa
// cuando su turno pasa a "in-progress".
const QueueWatcher = ({
  doctorId,
  appointmentId,
  onTurnStarted,
}: {
  doctorId: string;
  appointmentId: string;
  onTurnStarted: (turn: Turn) => void;
}) => {
  const today = todayApiDate();
  const { data: queue } = useQueue(doctorId, today);
  const notifiedRef = useRef(false);
  const mine = queue?.myTurn;

  useEffect(() => {
    const isMine =
      mine && mine.appointmentId === appointmentId;

    if (isMine && mine.status === "in-progress") {
      if (!notifiedRef.current) {
        notifiedRef.current = true;
        onTurnStarted(mine);
      }
    } else {
      notifiedRef.current = false;
    }
  }, [mine, appointmentId, onTurnStarted]);

  return null;
};

// Montado en la raíz de la app (ClinicApp): notifica al paciente logueado sin
// importar en qué página esté.
export const MyTurnNotification = () => {
  const authStatus = useAuthStore((state) => state.authStatus);
  const role = useAuthStore((state) => state.user?.role);
  const userId = useAuthStore((state) => state.user?.id);

  if (authStatus !== "authenticated" || role !== "PATIENT" || !userId) {
    return null;
  }

  // Se remonta al cambiar de usuario para no arrastrar alertas de sesiones previas.
  return <PatientTurnWatcher key={userId} />;
};

const PatientTurnWatcher = () => {
  const { data: myAppointments } = useMyAppointments();
  const { data: doctors } = useDoctors();
  const [alert, setAlert] = useState<TurnAlert | null>(null);

  const today = todayApiDate();
  const todaysAppointments = (myAppointments ?? []).filter(
    (apt) =>
      apt.status === "CONFIRMED" && apt.startTime.slice(0, 10) === today,
  );

  useEffect(() => {
    if (!alert) return;
    const previousTitle = document.title;
    document.title = "¡Es tu turno!";
    playCallSound();
    return () => {
      document.title = previousTitle;
    };
  }, [alert]);

  const handleTurnStarted = (turn: Turn) => {
    const apt = todaysAppointments.find((a) => a.id === turn.appointmentId);
    if (!apt) return;
    const doctorName =
      doctors?.find((d) => d.id === apt.doctorId)?.name ?? "tu médico";

    setAlert({
      appointmentId: apt.id,
      turnNumber: turn.number,
      doctorId: apt.doctorId,
      doctorName,
    });

    toast("Es tu turno", {
      description: `Turno #${turn.number} · ${doctorName}. Ya podés pasar al consultorio.`,
      duration: Number.POSITIVE_INFINITY,
      style: {
        "--normal-bg": "oklch(0.62 0.19 28)",
        "--normal-text": "#ffffff",
        "--normal-border": "transparent",
        color: "#ffffff",
        fontWeight: 600,
      } as CSSProperties,
      actionButtonStyle: {
        background: "#ffffff",
        color: "oklch(0.62 0.19 28)",
        fontWeight: 700,
      },
      action: {
        label: "Abrir cola",
        onClick: () => {
          window.location.assign(`/doctors/${apt.doctorId}/queue`);
        },
      },
    });
  };

  return (
    <>
      {todaysAppointments.map((apt) => (
        <QueueWatcher
          key={apt.id}
          doctorId={apt.doctorId}
          appointmentId={apt.id}
          onTurnStarted={handleTurnStarted}
        />
      ))}

      <AnimatePresence>
        {alert && <TurnAlertOverlay alert={alert} onDismiss={() => setAlert(null)} />}
      </AnimatePresence>
    </>
  );
};