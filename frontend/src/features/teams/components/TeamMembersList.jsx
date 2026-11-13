import { Trash2, UserRound } from "lucide-react";
import MemberRoleSelect from "./MemberRoleSelect";
import { getUserInitials } from "../utils/teamHelpers";

function TeamMembersList({
  members = [],
  currentUserId,
  isOwner,
  actionLoading,
  onRoleChange,
  onRemove,
}) {
  if (!members.length) {
    return (
      <div className="py-8 text-center text-sm text-[var(--muted)]">
        No team members found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {members.map((member) => {
        const isProjectOwner = member.role === "owner";
        const isCurrentUser = member.user_id === currentUserId;

        const name = member.full_name || "";
        const email = member.email || "";

        return (
          <div
            key={member.user_id}
            className="
              flex items-center justify-between gap-3
              rounded-xl border border-[var(--border)]
              bg-[var(--surface)]
              p-3
            "
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="
                  flex h-10 w-10 shrink-0 items-center justify-center
                  rounded-full
                  bg-[var(--surface-secondary)]
                  text-sm font-semibold
                  text-[var(--foreground)]
                "
              >
                {getUserInitials(name, email)}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--foreground)]">
                  {name || email || "Unknown user"}
                  {isCurrentUser && (
                    <span className="ml-1 text-xs text-[var(--muted)]">
                      (You)
                    </span>
                  )}
                </p>

                <p className="truncate text-xs text-[var(--muted)]">{email}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <MemberRoleSelect
                role={member.role}
                isOwner={isProjectOwner}
                disabled={!isOwner || isCurrentUser || actionLoading}
                onChange={(role) => onRoleChange(member.user_id, role)}
              />

              {isOwner && !isProjectOwner && (
                <button
                  type="button"
                  onClick={() => onRemove(member)}
                  disabled={actionLoading}
                  title="Remove member"
                  className="
                    rounded-lg p-2
                    text-[var(--muted)]
                    transition-colors
                    hover:bg-red-500/10 hover:text-red-500
                    disabled:cursor-not-allowed disabled:opacity-50
                  "
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TeamMembersList;
