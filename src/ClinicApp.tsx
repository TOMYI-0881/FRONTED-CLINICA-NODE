import { RouterProvider } from "react-router";
import { appRouter } from "./router/app.Router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { MyTurnNotification } from "@/queues/components/MyTurnNotification";
import { useEffect, type PropsWithChildren } from "react";
import { AppLoader } from "./layout/components/AppLoader";
import { useAuthStore } from "@/auth/store/auth.store";

const queryClient = new QueryClient();

// La sesión se restaura acá: no hay endpoint de refresh/check-status en este
// backend, así que se valida el JWT persistido en localStorage al montar la
// app. Mientras authStatus === "checking", los guards devuelven null y el
// splash (AppLoader) cubre esa ventana de arranque.
const CheckAuthProvider = ({ children }: PropsWithChildren) => {
  const authStatus = useAuthStore((state) => state.authStatus);

  useEffect(() => {
    useAuthStore.getState().checkAuthStatus();
  }, []);

  return (
    <>
      {children}
      {authStatus === "checking" && <AppLoader />}
    </>
  );
};

export const ClinicApp = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <MyTurnNotification />

    <CheckAuthProvider>
      <RouterProvider router={appRouter} />
    </CheckAuthProvider>

    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);