// El router exporta la configuración (objeto, no un componente) junto con
// páginas lazy, por lo que el archivo no puede fast-refresh. Se desactiva la
// regla de forma puntual para preservar el patrón lazy + createBrowserRouter.
/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import { PublicLayout } from "@/layout/layouts/PublicLayout";
import { HomePage } from "@/home/pages/HomePage";
import { BookingPage } from "@/appointments/pages/booking/BookingPage";
import { MyAppointmentsPage } from "@/appointments/pages/my-appointments/MyAppointmentsPage";
import { MyAccountPage } from "@/appointments/pages/my-account/MyAccountPage";
import { QueueLivePage } from "@/queues/pages/live/QueueLivePage";

import { DoctorQueuePage } from "@/queues/pages/doctor/DoctorQueuePage";
import { DoctorAppointmentsPage } from "@/appointments/pages/doctor-appointments/DoctorAppointmentsPage";
import { DoctorProfilePage } from "@/doctors/pages/DoctorProfilePage";

import { AdminDoctorsPage } from "@/admin/pages/doctors/AdminDoctorsPage";
import { EditDoctorPage } from "@/admin/pages/doctors/EditDoctorPage";
import { AdminAppointmentsPage } from "@/admin/pages/appointments/AdminAppointmentsPage";
import { AdminCancellationRequestsPage } from "@/cancellation-requests/pages/admin/AdminCancellationRequestsPage";
import { AdminQueueControlPage } from "@/queues/pages/admin/AdminQueueControlPage";
import { DashboardPage } from "@/admin/pages/dashboard/DashboardPage";

import {
  AdminRoute,
  DoctorRoute,
  NotAuthenticatedRoute,
  PatientRoute,
} from "./ProtectedRoutes";

const AuthLayout = lazy(() => import("../auth/layouts/AuthLayout"));
const LoginPage = lazy(() => import("../auth/pages/login/LoginPage"));
const AdminLayout = lazy(() => import("../admin/layouts/AdminLayout"));
const DoctorLayout = lazy(() => import("../doctors/layouts/DoctorLayout"));

export const appRouter = createBrowserRouter([
  // Public / Patient routes
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "doctors/:doctorId",
        element: <BookingPage />,
      },
      {
        path: "doctors/:doctorId/queue",
        element: <QueueLivePage />,
      },
      {
        path: "appointments/mine",
        element: (
          <PatientRoute>
            <MyAppointmentsPage />
          </PatientRoute>
        ),
      },
      {
        path: "account",
        element: (
          <PatientRoute>
            <MyAccountPage />
          </PatientRoute>
        ),
      },
    ],
  },

  // Auth Routes
  {
    path: "/auth",
    element: (
      <NotAuthenticatedRoute>
        <AuthLayout />
      </NotAuthenticatedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      // Ambos modos (login/register) viven en el mismo panel animado:
      // LoginPage decide cuál mostrar según location.pathname.
      {
        path: "register",
        element: <LoginPage />,
      },
    ],
  },

  // Doctor panel routes
  {
    path: "/doctor",
    element: (
      <DoctorRoute>
        <DoctorLayout />
      </DoctorRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/doctor/queue" />,
      },
      {
        path: "queue",
        element: <DoctorQueuePage />,
      },
      {
        path: "appointments",
        element: <DoctorAppointmentsPage />,
      },
      {
        path: "profile",
        element: <DoctorProfilePage />,
      },
    ],
  },

  // Admin routes
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "doctors",
        element: <AdminDoctorsPage />,
      },
      {
        path: "doctors/:doctorId/edit",
        element: <EditDoctorPage />,
      },
      {
        path: "appointments",
        element: <AdminAppointmentsPage />,
      },
      {
        path: "cancellation-requests",
        element: <AdminCancellationRequestsPage />,
      },
      {
        path: "queues",
        element: <AdminQueueControlPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);
