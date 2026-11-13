import { create } from "zustand";

import {
  getProjectTeam,
  updateMemberRole,
  removeTeamMember,
  sendProjectInvitation,
  getPendingInvitations,
  revokeProjectInvitation,
} from "../services/teamService";

export const useTeamStore = create((set, get) => ({
  // State
  members: [],
  invitations: [],
  loading: false,
  actionLoading: false,
  error: null,

  // Fetch team members and pending invitations.
  fetchTeamData: async (projectId) => {
    if (!projectId) return;

    set({ loading: true, error: null });

    try {
      const [teamResponse, invitationResponse] = await Promise.all([
        getProjectTeam(projectId),
        getPendingInvitations(projectId),
      ]);

      set({
        members: teamResponse.data || [],
        invitations: invitationResponse.data || [],
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Unable to fetch team information.",
      });

      throw error;
    }
  },

  // Send an invitation.
  inviteMember: async (projectId, invitationData) => {
    set({ actionLoading: true, error: null });

    try {
      const response = await sendProjectInvitation(projectId, invitationData);

      await get().fetchTeamData(projectId);

      set({ actionLoading: false });

      return response;
    } catch (error) {
      set({
        actionLoading: false,
        error: error.response?.data?.message || "Unable to send invitation.",
      });

      throw error;
    }
  },

  // Revoke an invitation.
  revokeInvitation: async (projectId, invitationId) => {
    set({ actionLoading: true, error: null });

    try {
      const response = await revokeProjectInvitation(projectId, invitationId);

      await get().fetchTeamData(projectId);

      set({ actionLoading: false });

      return response;
    } catch (error) {
      set({
        actionLoading: false,
        error: error.response?.data?.message || "Unable to revoke invitation.",
      });

      throw error;
    }
  },

  // Change a member's role.
  changeMemberRole: async (projectId, memberId, role) => {
    set({ actionLoading: true, error: null });

    try {
      const response = await updateMemberRole(projectId, memberId, role);

      await get().fetchTeamData(projectId);

      set({ actionLoading: false });

      return response;
    } catch (error) {
      set({
        actionLoading: false,
        error: error.response?.data?.message || "Unable to update member role.",
      });

      throw error;
    }
  },

  // Remove a team member.
  removeMember: async (projectId, memberId) => {
    set({ actionLoading: true, error: null });

    try {
      const response = await removeTeamMember(projectId, memberId);

      await get().fetchTeamData(projectId);

      set({ actionLoading: false });

      return response;
    } catch (error) {
      set({
        actionLoading: false,
        error: error.response?.data?.message || "Unable to remove team member.",
      });

      throw error;
    }
  },

  // Clear team state when leaving a workspace.
  clearTeam: () => {
    set({
      members: [],
      invitations: [],
      loading: false,
      actionLoading: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
