import { useState } from "react";

import Sidebar from "@/admin/components/componentsDashboard/Sidebar";
import { AdminHeader } from "@/admin/components/componentsDashboard/AdminHeader";
import { Outlet, ScrollRestoration } from "react-router";

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background flex text-foreground">
      <ScrollRestoration />
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
