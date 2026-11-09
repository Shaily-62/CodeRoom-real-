
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  UserCircle,
} from "lucide-react";

import ThemeToggle from "../common/ThemeToggle";
import { useAuthStore } from "../../store/authStore";
import { useProjectStore } from "../../store/projectStore";
import { logoutUser } from "../../features/auth/authService";

function Topbar() {
  const navigate = useNavigate();

  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const clearProjects = useProjectStore(
    (state) => state.clearProjects
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const fullName = profile?.full_name || user?.email || "User";

  const initials = fullName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear local authentication and project state
      logout();
      clearProjects();

      setLoggingOut(false);
      setMenuOpen(false);

      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="h-16 border-b border-border bg-surface px-6 flex items-center justify-between gap-4">

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />

        <input
          type="text"
          placeholder="Search projects..."
          className="w-full h-10 rounded-lg bg-input-background border border-border pl-10 pr-4 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 shrink-0">

        <ThemeToggle />

        <button
          title="Notifications"
          className="relative w-10 h-10 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-surface-secondary transition"
        >
          <Bell size={19} />
        </button>

        <div className="h-8 w-px bg-border mx-1" />

        {/* Profile dropdown */}
        <div className="relative">

          <button
            onClick={() => setMenuOpen((previous) => !previous)}
            className="flex items-center gap-3 rounded-lg p-1 hover:bg-surface-secondary transition"
          >
            <div className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center font-semibold text-sm">
              {initials}
            </div>

            <div className="hidden sm:block text-left max-w-36">
              <p className="text-sm font-medium text-foreground truncate">
                {fullName}
              </p>

              <p className="text-xs text-muted">
                Developer
              </p>
            </div>

            <ChevronDown
              size={16}
              className="text-muted hidden sm:block"
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-14 z-50 w-60 bg-surface border border-border rounded-xl shadow-xl p-2">

              {/* User information */}
              <div className="px-3 py-3 border-b border-border">
                <p className="text-sm font-semibold truncate">
                  {fullName}
                </p>

                <p className="text-xs text-muted truncate mt-1">
                  {user?.email}
                </p>
              </div>

              <div className="py-2 space-y-1">

                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-muted hover:text-foreground hover:bg-surface-secondary"
                >
                  <UserCircle size={17} />
                  Account Settings
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-muted hover:text-foreground hover:bg-surface-secondary"
                >
                  <Settings size={17} />
                  Preferences
                </Link>

              </div>

              <div className="border-t border-border pt-2">

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-danger hover:bg-danger/10 disabled:opacity-50"
                >
                  <LogOut size={17} />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>

              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Topbar;
