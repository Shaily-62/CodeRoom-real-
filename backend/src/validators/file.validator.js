import { z } from "zod";

const fileNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(255, "Name must be at most 255 characters")
  .refine(
    (name) => ![".", ".."].includes(name) && !/[\\/]/.test(name),
    "Name cannot contain path separators",
  );

export const createFileSchema = z
  .object({
    name: fileNameSchema,
    type: z.enum(["file", "folder"]),
    parent_id: z.string().uuid().nullable().optional(),
    content: z.string().optional(),
    language: z.string().max(50).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "folder" && data.content) {
      ctx.addIssue({
        code: "custom",
        path: ["content"],
        message: "Folders cannot contain file content",
      });
    }
  });

export const updateFileSchema = z
  .object({
    name: fileNameSchema.optional(),
    content: z.string().optional(),
    language: z.string().max(50).nullable().optional(),
    parent_id: z.string().uuid().nullable().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided",
  );

export const fileIdSchema = z.string().uuid();
