import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignupPage from "../features/auth/SignupPage";
import LoginPage from "../features/auth/LoginPage";

import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

import DashboardPage from "../pages/DashboardPage";
import WorkspacePage from "../pages/WorkspacePage";
import SettingsPage from "../pages/SettingsPage";

import InviteAcceptPage from "../pages/InviteAcceptPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<div>Landing Page</div>} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Routes using the dashboard layout */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Workspace will have its own layout later */}
          <Route path="/workspace/:projectId" element={<WorkspacePage />} />
        </Route>

        <Route path="/invite/accept" element={<InviteAcceptPage />} />

        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
