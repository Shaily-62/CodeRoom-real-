import { useEffect, useState } from "react";
import { X, UserPlus, Users, Mail } from "lucide-react";

import TeamMembersList from "../components/TeamMembersList";
import PendingInvitations from "../components/PendingInvitations";
import InviteMemberModal from "./InviteMemberModal";

import { useTeamStore } from "../../../store/teamStore";
import { useAuthStore } from "../../../store/authStore";

function TeamManagementModal({ isOpen, onClose, projectId, projectOwnerId }) {
  const [activeTab, setActiveTab] = useState("members");
  const [showInviteModal, setShowInviteModal] = useState(false);

  const user = useAuthStore((state) => state.user);

  const {
    members,
    invitations,
    loading,
    actionLoading,
    error,
    fetchTeamData,
    inviteMember,
    revokeInvitation,
    changeMemberRole,
    removeMember,
    clearTeam,
  } = useTeamStore();

  const currentUserId = user?.id;

  const isOwner = currentUserId === projectOwnerId;

  useEffect(() => {
    if (isOpen && projectId) {
      fetchTeamData(projectId).catch(() => {});
    }

    if (!isOpen) {
      clearTeam();
    }
  }, [isOpen, projectId, fetchTeamData, clearTeam]);

  if (!isOpen) return null;

  const handleRoleChange = async (memberId, role) => {
    try {
      await changeMemberRole(projectId, memberId, role);
    } catch (error) {
      console.error("Unable to update member role:", error);
    }
  };

  const handleRemoveMember = async (member) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${member.full_name || "this member"} from the project?`
    );

    if (!confirmed) return;

    try {
      await removeMember(projectId, member.user_id);
    } catch (error) {
      console.error("Unable to remove member:", error);
    }
  };

  const handleRevokeInvitation = async (invitation) => {
    const confirmed = window.confirm(
      `Revoke invitation sent to ${invitation.invited_email}?`
    );

    if (!confirmed) return;

    try {
      await revokeInvitation(projectId, invitation.id);
    } catch (error) {
      console.error("Unable to revoke invitation:", error);
    }
  };

  const handleInvite = async (invitationData) => {
    await inviteMember(projectId, invitationData);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-secondary)] text-[var(--primary)]">
                <Users size={20} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Project team
                </h2>
                <p className="text-xs text-[var(--muted)]">
                  Manage members and invitations
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--surface-secondary)]"
            >
              <X size={19} />
            </button>
          </div>

          {/* Tabs and invite button */}
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5">
            <div className="flex gap-5">
              <button
                type="button"
                onClick={() => setActiveTab("members")}
                className={`border-b-2 py-3 text-sm font-medium ${
                  activeTab === "members"
                    ? "border-[var(--primary)] text-[var(--foreground)]"
                    : "border-transparent text-[var(--muted)]"
                }`}
              >
                Members ({members.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("invitations")}
                className={`border-b-2 py-3 text-sm font-medium ${
                  activeTab === "invitations"
                    ? "border-[var(--primary)] text-[var(--foreground)]"
                    : "border-transparent text-[var(--muted)]"
                }`}
              >
                Invitations ({invitations.length})
              </button>
            </div>

            {isOwner && (
              <button
                type="button"
                onClick={() => setShowInviteModal(true)}
                className="mb-2 inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-[#171B19] hover:opacity-90"
              >
                <UserPlus size={15} />
                Invite
              </button>
            )}
          </div>

          {/* Content */}
          <div className="min-h-[250px] flex-1 overflow-y-auto p-5">
            {loading ? (
              <div className="py-12 text-center text-sm text-[var(--muted)]">
                Loading team information...
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-500">
                {error}
              </div>
            ) : activeTab === "members" ? (
              <TeamMembersList
                members={members}
                currentUserId={currentUserId}
                isOwner={isOwner}
                actionLoading={actionLoading}
                onRoleChange={handleRoleChange}
                onRemove={handleRemoveMember}
              />
            ) : (
              <PendingInvitations
                invitations={invitations}
                isOwner={isOwner}
                actionLoading={actionLoading}
                onRevoke={handleRevokeInvitation}
              />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[var(--border)] px-5 py-3">
            <p className="text-xs text-[var(--muted)]">
              {members.length} / 4 members
            </p>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-[var(--muted)] hover:bg-[var(--surface-secondary)]"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInvite}
        loading={actionLoading}
      />
    </>
  );
}

export default TeamManagementModal;