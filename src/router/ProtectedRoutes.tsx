import { useAuthStore } from "@/auth/store/auth.store";
import type { PropsWithChildren } from "react";
import { Navigate } from "react-router";

export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const authStatus = useAuthStore((state) => state.authStatus);
  if (authStatus === "checking") return null;

  if (authStatus === "authenticated") return <Navigate to="/" />;

  return children;
};

export const AdminRoute = ({ children }: PropsWithChildren) => {
  const authStatus = useAuthStore((state) => state.authStatus);

  if (authStatus === "checking") return null;

  if (authStatus === "not-authenticated") return <Navigate to="/auth/login" />;

  if (!useAuthStore.getState().isAdmin()) return <Navigate to="/" />;

  return children;
};

export const DoctorRoute = ({ children }: PropsWithChildren) => {
  const authStatus = useAuthStore((state) => state.authStatus);

  if (authStatus === "checking") return null;

  if (authStatus === "not-authenticated") return <Navigate to="/auth/login" />;

  if (!useAuthStore.getState().isDoctor()) return <Navigate to="/" />;

  return children;
};

export const PatientRoute = ({ children }: PropsWithChildren) => {
  const authStatus = useAuthStore((state) => state.authStatus);

  if (authStatus === "checking") return null;

  if (authStatus === "not-authenticated") return <Navigate to="/auth/login" />;

  if (!useAuthStore.getState().isPatient()) return <Navigate to="/" />;

  return children;
};
