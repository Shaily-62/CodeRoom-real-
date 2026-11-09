// This prevents invalid roles from reaching the database.
import { z } from "zod";

export const updateMemberRoleSchema = z.object({
  role: z.enum(
    ["editor", "viewer"],
    {
      error: "Role must be either editor or viewer",
    }
  ),
});
