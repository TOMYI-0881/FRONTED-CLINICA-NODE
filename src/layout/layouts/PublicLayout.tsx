import { Outlet, ScrollRestoration } from "react-router";
import { CustomHeader } from "../components/CustomHeader";
import { CustomFooter } from "../components/CustomFooter";

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollRestoration />
      <CustomHeader />

      <Outlet />

      <CustomFooter />
    </div>
  );
};
