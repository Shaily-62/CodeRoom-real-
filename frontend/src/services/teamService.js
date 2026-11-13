import api from "./api";

// ============================================
// TEAM MEMBERS
// ============================================

// Fetch all members of a project.
export const getProjectTeam = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/members`);

  return response.data;
};

// Update a team member's role.
export const updateMemberRole = async (projectId, memberId, role) => {
  const response = await api.patch(
    `/projects/${projectId}/members/${memberId}/role`,
    { role },
  );

  return response.data;
};

// Remove a member from a project.
export const removeTeamMember = async (projectId, memberId) => {
  const response = await api.delete(
    `/projects/${projectId}/members/${memberId}`,
  );

  return response.data;
};

// ============================================
// PROJECT INVITATIONS
// ============================================

// Send an invitation to a teammate.
export const sendProjectInvitation = async (projectId, invitationData) => {
  const response = await api.post(
    `/projects/${projectId}/invitations`,
    invitationData,
  );

  return response.data;
};

// Fetch pending invitations.
export const getPendingInvitations = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/invitations`);

  return response.data;
};

// Revoke a pending invitation.
export const revokeProjectInvitation = async (projectId, invitationId) => {
  const response = await api.delete(
    `/projects/${projectId}/invitations/${invitationId}`,
  );

  return response.data;
};
