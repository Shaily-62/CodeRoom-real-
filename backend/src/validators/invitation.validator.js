import { z } from "zod";

export const createInvitationSchema = z.object({
  invited_email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .transform((email) => email.toLowerCase()),

  role: z
    .enum(["editor", "viewer"])
    .default("editor"),
});