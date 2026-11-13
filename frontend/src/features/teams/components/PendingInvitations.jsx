import { Clock3, Mail, X } from "lucide-react";
import { formatTeamDate, getInvitationStatus } from "../utils/teamHelpers";

function PendingInvitations({
  invitations = [],
  isOwner,
  actionLoading,
  onRevoke,
}) {
  if (!invitations.length) {
    return (
      <div className="py-8 text-center text-sm text-[var(--muted)]">
        No pending invitations.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invitations.map((invitation) => {
        const status = getInvitationStatus(invitation);

        return (
          <div
            key={invitation.id}
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
                  text-[var(--muted)]
                "
              >
                <Mail size={17} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--foreground)]">
                  {invitation.invited_email}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                  <span className="capitalize">{invitation.role}</span>

                  <span>·</span>

                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={12} />
                    Expires {formatTeamDate(invitation.expires_at)}
                  </span>
                </div>

                {status === "expired" && (
                  <p className="mt-1 text-xs text-amber-500">
                    Invitation expired
                  </p>
                )}
              </div>
            </div>

            {isOwner && status === "pending" && (
              <button
                type="button"
                onClick={() => onRevoke(invitation)}
                disabled={actionLoading}
                title="Revoke invitation"
                className="
                  shrink-0 rounded-lg p-2
                  text-[var(--muted)]
                  transition-colors
                  hover:bg-red-500/10 hover:text-red-500
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                <X size={17} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default PendingInvitations;
