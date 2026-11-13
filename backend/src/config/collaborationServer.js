import { Server } from "@hocuspocus/server";

import { authenticateCollaborationUser } from "../services/collaborationAuth.service.js";

import {
  loadCollaborationDocument,
  storeCollaborationDocument,
} from "../services/collaborationPersistence.service.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const parseDocumentName = (documentName) => {
  const parts = documentName.split(":");

  if (parts.length !== 2) {
    throw new Error("Invalid collaboration document name.");
  }

  const [projectId, fileId] = parts;

  if (!UUID_REGEX.test(projectId) || !UUID_REGEX.test(fileId)) {
    throw new Error("Invalid project or file ID.");
  }

  return { projectId, fileId };
};

export const collaborationServer = new Server({
  name: "CodeRoom Collaboration Server",
  port: 1234,
  address: "127.0.0.1",

  // 1. Authenticate the connecting user.
  async onAuthenticate({ token, documentName, connectionConfig }) {
    const { projectId, fileId } = parseDocumentName(documentName);

    const user = await authenticateCollaborationUser(token, projectId, fileId);

    // Viewers can connect but cannot edit.
    connectionConfig.readOnly = !user.canEdit;

    console.log(
      `Authenticated ${user.email} as ${user.role} for file ${fileId}`,
    );

    // This context is available to the document lifecycle hooks.
    return {
      user,
      accessToken: token,
      projectId,
      fileId,
    };
  },

  // 2. Load the saved document when someone opens a file.
  async onLoadDocument({ documentName, context }) {
    const { projectId, fileId } = parseDocumentName(documentName);

    if (!context?.accessToken) {
      throw new Error("Missing authentication context.");
    }

    console.log(`Loading collaboration document: ${fileId}`);

    return await loadCollaborationDocument({
      fileId,
      accessToken: context.accessToken,
    });
  },

  // 3. Persist changes after collaborative editing.

  async onStoreDocument({ documentName, document, lastContext }) {
    const { projectId, fileId } = parseDocumentName(documentName);

    console.log("\n--- CodeRoom Save Diagnostics ---");
    console.log("File ID:", fileId);
    console.log("Project ID:", projectId);
    console.log("User ID:", lastContext?.user?.id);
    console.log("User email:", lastContext?.user?.email);
    console.log("User role:", lastContext?.user?.role);
    console.log("Access token exists:", Boolean(lastContext?.accessToken));
    console.log("Access token length:", lastContext?.accessToken?.length || 0);

    if (!lastContext?.accessToken || !lastContext?.user?.id) {
      throw new Error("Missing collaboration user context.");
    }

    await storeCollaborationDocument({
      fileId,
      projectId,
      accessToken: lastContext.accessToken,
      userId: lastContext.user.id,
      document,
    });

    console.log(`Saved collaboration document: ${fileId}`);
  },

  // 4. Connection lifecycle logs.
  async onConnect({ documentName, socketId }) {
    console.log(
      `Collaboration connection established: ${documentName} (${socketId})`,
    );
  },

  async onDisconnect({ documentName, socketId }) {
    console.log(
      `Collaboration connection closed: ${documentName} (${socketId})`,
    );
  },
});
