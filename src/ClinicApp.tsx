import { RouterProvider } from "react-router";
import { appRouter } from "./router/app.Router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { MyTurnNotification } from "@/queues/components/MyTurnNotification";
import { useEffect, useState, type PropsWithChildren } from "react";
import { AppLoader } from "./layout/components/AppLoader";
import { useAuthStore } from "@/auth/store/auth.store";

const queryClient = new QueryClient();

// La sesión se restaura acá: no hay endpoint de refresh/check-status en este
// backend, así que se valida el JWT persistido en localStorage al montar la
// app. Mientras authStatus === "checking", los guards devuelven null y el
// splash (AppLoader) cubre esa ventana de arranque.
const CheckAuthProvider = ({ children }: PropsWithChildren) => {
  const authStatus = useAuthStore((state) => state.authStatus);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    useAuthStore.getState().checkAuthStatus();
  }, []);

  // El splash cubre toda la ventana de arranque y dura como mínimo su animación
  // (2600ms): si la sesión resuelve antes, espera al onComplete; si tarda más,
  // se mantiene hasta que authStatus deje de ser "checking".
  const showSplash = authStatus === "checking" || !splashDone;

  return (
    <>
      {children}
      {showSplash && <AppLoader onComplete={() => setSplashDone(true)} />}
    </>
  );
};

export const ClinicApp = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <MyTurnNotification />

      <CheckAuthProvider>
        <RouterProvider router={appRouter} />
      </CheckAuthProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ErrorBoundary>
);