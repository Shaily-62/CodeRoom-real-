import { Users } from "lucide-react";

function TeamButton({ memberCount = 1, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        inline-flex items-center gap-2
        rounded-lg border border-[var(--border)]
        bg-[var(--surface)]
        px-3 py-2
        text-sm font-medium
        text-[var(--foreground)]
        transition-colors
        hover:bg-[var(--surface-secondary)]
      "
    >
      <Users size={16} />

      <span>Team</span>

      <span
        className="
          rounded-md
          bg-[var(--surface-secondary)]
          px-1.5 py-0.5
          text-xs
          text-[var(--muted)]
        "
      >
        {memberCount}
      </span>
    </button>
  );
}

export default TeamButton;
