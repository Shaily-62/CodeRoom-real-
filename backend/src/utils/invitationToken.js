import crypto from "crypto";

// Generate a secure invitation token
export const generateInvitationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Convert token into SHA-256 hash
export const hashInvitationToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};