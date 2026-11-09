import api from "../../services/api";

// Accept a project invitation using its token
export const acceptInvitation = async (token) => {
  const response = await api.post("/invitations/accept", {
    token,
  });

  return response.data;
};
