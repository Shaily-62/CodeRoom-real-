import * as Y from "yjs";

import { createUserSupabaseClient } from "../config/supabaseUser.js";

// Load a document's saved Yjs state from Supabase.
// If it has never been collaboratively edited, seed it
// with the existing content from project_files.
export const loadCollaborationDocument = async ({ fileId, accessToken }) => {
  const db = createUserSupabaseClient(accessToken);

  const { data: savedDocument, error: loadError } = await db
    .from("collaboration_documents")
    .select("state_base64")
    .eq("file_id", fileId)
    .maybeSingle();

  if (loadError) {
    throw new Error(`Failed to load collaboration state: ${loadError.message}`);
  }

  const ydoc = new Y.Doc();

  // Restore the existing Yjs document.
  if (savedDocument?.state_base64) {
    const state = Buffer.from(savedDocument.state_base64, "base64");

    Y.applyUpdate(ydoc, new Uint8Array(state));

    return ydoc;
  }

  // No Yjs state exists yet. Load the original file content.
  const { data: file, error: fileError } = await db
    .from("project_files")
    .select("content")
    .eq("id", fileId)
    .maybeSingle();

  if (fileError || !file) {
    throw new Error(
      `Failed to load original file content: ${
        fileError?.message || "File not found"
      }`,
    );
  }

  const sharedText = ydoc.getText("monaco");

  if (file.content) {
    sharedText.insert(0, file.content);
  }

  return ydoc;
};

// Save the Yjs state and synchronize project_files.content.
export const storeCollaborationDocument = async ({
  fileId,
  projectId,
  accessToken,
  userId,
  document,
}) => {
  if (!accessToken || !userId) {
    throw new Error("Missing collaboration user context.");
  }

  const db = createUserSupabaseClient(accessToken);

  // Verify project editing permission.
  const { data: canEdit, error: permissionError } = await db.rpc(
    "is_project_editor",
    {
      p_project_id: projectId,
    },
  );

  if (permissionError) {
    throw new Error(
      `Failed to verify project permissions: ${permissionError.message}`,
    );
  }

  if (!canEdit) {
    throw new Error("You do not have permission to edit this project.");
  }

  // Verify file editing permission.
  const { data: canEditFile, error: filePermissionError } = await db.rpc(
    "can_edit_collaboration_file",
    {
      p_file_id: fileId,
    },
  );

  if (filePermissionError) {
    throw new Error(
      `Failed to verify file permissions: ${filePermissionError.message}`,
    );
  }

  if (!canEditFile) {
    throw new Error("You do not have permission to edit this file.");
  }

  const now = new Date().toISOString();

  // Encode the complete Yjs document state.
  const stateBase64 = Buffer.from(Y.encodeStateAsUpdate(document)).toString(
    "base64",
  );

  const content = document.getText("monaco").toString();

  // Insert a new collaboration document or update an existing one.
  const { data: savedState, error: stateError } = await db
    .from("collaboration_documents")
    .upsert(
      {
        file_id: fileId,
        state_base64: stateBase64,
        updated_at: now,
      },
      {
        onConflict: "file_id",
      },
    )
    .select("file_id")
    .maybeSingle();

  if (stateError) {
    throw new Error(
      `Failed to save collaboration state: ${stateError.message}`,
    );
  }

  if (!savedState) {
    throw new Error("Collaboration document was not saved.");
  }

  // Synchronize the regular file record.
  const { error: fileError } = await db
    .from("project_files")
    .update({
      content,
      updated_by: userId,
      updated_at: now,
    })
    .eq("id", fileId)
    .eq("project_id", projectId);

  if (fileError) {
    throw new Error(`Failed to synchronize file content: ${fileError.message}`);
  }
};
