import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setCollapsed((previous) => !previous);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">

      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={handleSidebarToggle}
      />

      {/* Main dashboard area */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Topbar */}
        <Topbar />

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default DashboardLayout;