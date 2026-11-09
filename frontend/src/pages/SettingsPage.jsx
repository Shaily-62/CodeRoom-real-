
import { useState } from "react";
import {
  User,
  Palette,
  ShieldCheck,
  Sun,
  Moon,
  Monitor,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { useProjectStore } from "../store/projectStore";
import { logoutUser } from "../features/auth/authService";

function SettingsPage() {
  const navigate = useNavigate();

  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const clearProjects = useProjectStore((state) => state.clearProjects);

  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const [activeSection, setActiveSection] = useState("profile");
  const [loggingOut, setLoggingOut] = useState(false);

  const fullName = profile?.full_name || "";
  const email = user?.email || "";

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      logout();
      clearProjects();
      navigate("/login", { replace: true });
    }
  };

  const sections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "account", label: "Account", icon: ShieldCheck },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      <div>
        <p className="text-sm text-muted mb-2">Preferences</p>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted mt-2">
          Manage your account and personalize CodeRoom.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">

        {/* Settings navigation */}
        <aside className="bg-surface border border-border rounded-2xl p-3 h-fit">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                  activeSection === section.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted hover:text-foreground hover:bg-surface-secondary"
                }`}
              >
                <Icon size={18} />
                {section.label}
              </button>
            );
          })}
        </aside>

        {/* Settings content */}
        <section className="bg-surface border border-border rounded-2xl p-6 md:p-8">

          {activeSection === "profile" && (
            <div className="space-y-6">

              <div>
                <h2 className="text-xl font-semibold">
                  Profile Information
                </h2>
                <p className="text-sm text-muted mt-1">
                  Your CodeRoom account details.
                </p>
              </div>

              <div className="flex items-center gap-4 pb-6 border-b border-border">
                <div className="w-16 h-16 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xl font-bold">
                  {fullName
                    ? fullName.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase()
                    : "U"}
                </div>

                <div>
                  <h3 className="font-semibold">
                    {fullName || "Your name"}
                  </h3>
                  <p className="text-sm text-muted">
                    CodeRoom Developer
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted">
                    Full Name
                  </label>
                  <div className="mt-2 px-4 py-3 rounded-lg bg-surface-secondary border border-border">
                    {fullName || "Not provided"}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted">
                    Email Address
                  </label>
                  <div className="mt-2 px-4 py-3 rounded-lg bg-surface-secondary border border-border">
                    {email}
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted">
                Profile editing will be available in a future update.
              </p>

            </div>
          )}

          {activeSection === "appearance" && (
            <div className="space-y-6">

              <div>
                <h2 className="text-xl font-semibold">
                  Appearance
                </h2>
                <p className="text-sm text-muted mt-1">
                  Choose how CodeRoom looks on your device.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <button
                  onClick={() => setTheme("dark")}
                  className={`p-5 rounded-xl border text-left transition ${
                    theme === "dark"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="h-24 rounded-lg bg-[#171B19] border border-[#35443A] p-3">
                    <div className="h-3 w-16 rounded bg-[#91A995]" />
                    <div className="h-2 w-full rounded bg-[#35443A] mt-3" />
                    <div className="h-2 w-2/3 rounded bg-[#35443A] mt-2" />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="font-medium flex items-center gap-2">
                      <Moon size={17} />
                      Dark
                    </span>
                    {theme === "dark" && (
                      <span className="text-xs text-primary">Selected</span>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setTheme("light")}
                  className={`p-5 rounded-xl border text-left transition ${
                    theme === "light"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="h-24 rounded-lg bg-[#F5F3EE] border border-[#D9E2D9] p-3">
                    <div className="h-3 w-16 rounded bg-[#718879]" />
                    <div className="h-2 w-full rounded bg-[#D9E2D9] mt-3" />
                    <div className="h-2 w-2/3 rounded bg-[#D9E2D9] mt-2" />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="font-medium flex items-center gap-2">
                      <Sun size={17} />
                      Light
                    </span>
                    {theme === "light" && (
                      <span className="text-xs text-primary">Selected</span>
                    )}
                  </div>
                </button>

              </div>

              <p className="text-xs text-muted">
                Your preference is automatically saved on this device.
              </p>

            </div>
          )}

          {activeSection === "account" && (
            <div className="space-y-6">

              <div>
                <h2 className="text-xl font-semibold">
                  Account
                </h2>
                <p className="text-sm text-muted mt-1">
                  Manage your CodeRoom session.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border">
                <div className="flex items-center gap-3">
                  <Monitor size={20} className="text-primary" />
                  <div>
                    <p className="font-medium text-sm">
                      Current account
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-danger/30">
                <h3 className="font-medium">
                  Sign out
                </h3>
                <p className="text-sm text-muted mt-1">
                  Sign out of your CodeRoom account on this device.
                </p>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-danger text-white hover:opacity-90 disabled:opacity-50"
                >
                  <LogOut size={17} />
                  {loggingOut ? "Signing out..." : "Logout"}
                </button>
              </div>

            </div>
          )}

        </section>
      </div>
    </div>
  );
}

export default SettingsPage;
