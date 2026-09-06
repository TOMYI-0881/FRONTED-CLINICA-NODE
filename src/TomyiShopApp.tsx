import { RouterProvider } from "react-router";
import { appRouter } from "./router/app.Router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { useState, type PropsWithChildren } from "react";
import { AppLoader } from "./layout/components/AppLoader";
// La sesión se valida una sola vez al importar auth.store (no hay
// endpoint de refresh/check-status en este backend).
import "./auth/store/auth.store";

export const queryClient = new QueryClient();

const CheckAuthProvider = ({ children }: PropsWithChildren) => {
  const [isReady, setIsReady] = useState(false);

  return (
    <>
      {children}
      {!isReady && <AppLoader onComplete={() => setIsReady(true)} />}
    </>
  );
};

export const TomyiShopApp = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />

    <CheckAuthProvider>
      <RouterProvider router={appRouter} />
    </CheckAuthProvider>

    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
