import {
  LayoutDashboard,
  FolderKanban,
  Activity,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Code2,
} from "lucide-react";

import { NavLink, useLocation } from "react-router-dom";

function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  const navigation = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      path: "/dashboard",
      exact: true,
    },
    {
      label: "My Projects",
      icon: FolderKanban,
      path: "/dashboard#projects",
    },
    {
      label: "Recent Activity",
      icon: Activity,
      path: "/dashboard#activity",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <aside
      className={`h-screen shrink-0 border-r border-border bg-surface flex flex-col transition-all duration-200 ${
        collapsed ? "w-[76px]" : "w-[250px]"
      }`}
    >
      {/* Brand */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-border">
        <div className="flex items-center gap-2 overflow-hidden">
          <Code2 size={26} className="text-primary shrink-0" />

          {!collapsed && (
            <span className="text-xl font-bold tracking-tight whitespace-nowrap">
              Code<span className="text-primary">Room</span>
            </span>
          )}
        </div>

        <button
          onClick={onToggle}
          className="text-muted hover:text-foreground transition"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen size={19} />
          ) : (
            <PanelLeftClose size={19} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {!collapsed && (
          <p className="text-xs font-semibold uppercase tracking-wider text-muted px-3 mb-4">
            Workspace
          </p>
        )}

        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive = item.exact
            ? location.pathname === item.path
            : item.path === "/settings"
              ? location.pathname === item.path
              : location.pathname === "/dashboard" &&
                location.hash === item.path.split("#")[1];

          return (
            <NavLink
              key={item.label}
              to={item.path}
              title={collapsed ? item.label : ""}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-surface-secondary hover:text-foreground"
              }`}
            >
              <Icon size={20} className="shrink-0" />

              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        {!collapsed ? (
          <p className="text-xs text-muted">
            CodeRoom Workspace
            <span className="block mt-1">Build together. Ship together.</span>
          </p>
        ) : (
          <Code2 size={20} className="text-muted mx-auto" />
        )}
      </div>
    </aside>
  );
}

export default Sidebar;