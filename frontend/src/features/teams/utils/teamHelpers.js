// Get initials from a user's name or email.
export const getUserInitials = (name = "", email = "") => {
  const value = name.trim() || email.trim();

  if (!value) return "U";

  const parts = value.split(/[\s@._-]+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

// Format dates consistently.
export const formatTeamDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Format invitation status for display.
export const getInvitationStatus = (invitation) => {
  if (invitation.status !== "pending") {
    return invitation.status;
  }

  if (new Date(invitation.expires_at) < new Date()) {
    return "expired";
  }

  return "pending";
};
