# Tomyi | Turnos — Frontend

Frontend (SPA) del sistema de reservas de turnos médicos de Tomyi. Consume la API del backend
`BACKEND-CLINICA-NODE` — para la referencia completa de la API y las reglas de negocio ver el
[README](/../../BACKEND-CLINICA-NODE/README.md) y [ENDPOINTS.md](/../../BACKEND-CLINICA-NODE/ENDPOINTS.md)
de ese repo. Construido con **React 19 + Vite + TypeScript**.

## Flujos principales

- **Paciente** (`PATIENT`): registrarse, buscar doctores, ver disponibilidad, reservar y
  cancelar turnos, hacer check-in en la cola del día y seguir su turno en vivo.
- **Doctor** (`DOCTOR`): cuenta propia creada por un ADMIN; opera **su propia** cola
  (check-in / next / skip / call), ve sus citas y pide la cancelación de una cita propia con
  motivo — siempre sujeta a aprobación de un ADMIN.
- **Admin** (`ADMIN`): dashboard con métricas, gestión de doctores (crear / editar /
  desactivar / resetear contraseña), bandeja de pedidos de cancelación, todas las reservas
  (paginado) y control de la cola de cualquier doctor.

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui |
| Routing | React Router 7 |
| Datos server-side | TanStack Query |
| Estado global | Zustand |
| Animaciones | framer-motion |
| HTTP | axios (interceptor de auth + toasts de error) |
| Tiempo real | WebSocket nativo (`src/lib/ws-client.ts`) — socket único con backoff |
| Toasts | sonner |

## Configuración

Copiá `.env.template` a `.env`:

```bash
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001/ws
```

Coinciden con los puertos host del `docker-compose.yml` del backend. `clinicApi` adjunta
`Authorization: Bearer <token>` desde `localStorage` en cada request y, ante un `401` fuera del
login, emite un evento `unauthorized` que el store de auth escucha para desloguear (evita
imports circulares). Los `409` (doble reserva, doble check-in, etc.) se manejan puntualmente en
cada flujo, no con un toast genérico.

## Scripts

```bash
pnpm install
pnpm dev        # dev server con HMR
pnpm build      # tsc -b && vite build
pnpm preview
pnpm lint       # eslint .
pnpm exec tsc -b  # typecheck standalone
```

## Estructura

```
src/
  api/                    cliente axios (`clinicApi`) y actions del servidor
  auth/                   store de autenticación (Zustand) y login/registro
  appointments/           reserva/cancelación del paciente
  queues/                 cola del día: hooks `useQueue` y notificación `MyTurnNotification`
  admin/                  panel ADMIN: dashboard, doctores, todas las reservas, control de cola
  cancellation-requests/  pedido de cancelación del doctor + bandeja del ADMIN
  home/                   home pública con catálogo de doctores
  layout/                 layout base + `AppLoader` (splash)
  components/ui/          shadcn/ui + `CustomPagination`
  interfaces/             tipos de dominio (appointment, queue, doctor, user, dashboard-stats, …)
  lib/                    `format-doctor-name`, `ws-client`, `photo-url`, utilidades
```

## Notas de implementación

- **Splash sin pantalla blanca**: `index.html` incluye un `#boot-splash` estático e inline,
  pintado apenas carga el HTML (antes incluso de que baje el JS — elimina el lag inicial en
  móvil). El `AppLoader` lo reemplaza al montar y muestra **"Tomyi | Salud" / "Tomyi | Doctor"
  / "Tomyi | Admin"** según el rol del usuario, leído de la sesión persistida en `localStorage`
  (sin saltos bruscos al resolver la auth). Duración mínima de ~2,6 s y reveal circular que
  descubre la app por debajo.
- **Prefijo Dr./Dra.**: `src/lib/format-doctor-name.ts` antepone el prefijo según el `gender`
  del doctor (`male` → "Dr.", `female` → "Dra.") solo a nivel presentación. El backend guarda
  el `name` sin prefijo y lo rechaza si se lo mandan al crear/editar — nunca se duplica el dato.
- **Dashboard del ADMIN**: `src/admin/actions/get-dashboard-stats.action.ts` consume
  `GET /api/admin/dashboard/stats`; `DashboardPage` muestra 6 `StatCard`s + "Citas por estado".
- **Notificación de turno en vivo**: `MyTurnNotification` deriva el turno propio por
  `appointmentId` desde `useQueue` (`current`/`waiting`), así que funciona aunque el turno lo
  haya generado el doctor/admin — no solo el check-in del propio paciente.
- **Datos de prueba**: universo con el backend con `npm run seed` (ver `accounts.md`): 5
  doctores (`*@clinica.test` / `clinica123`) y `admin@clinica.test` / `admin123`. Los pacientes
  se registran desde la propia app.