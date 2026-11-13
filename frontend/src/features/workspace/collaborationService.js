import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";

const COLLABORATION_URL =
  import.meta.env.VITE_COLLABORATION_URL || "ws://127.0.0.1:1234";

export const createCollaborationSession = ({
  projectId,
  fileId,
  accessToken,
  onStatus,
  onSynced,
  onAuthenticationFailed,
}) => {
  if (!projectId || !fileId || !accessToken) {
    throw new Error("Project ID, file ID and access token are required.");
  }

  const ydoc = new Y.Doc();

  const documentName = `${projectId}:${fileId}`;

  const provider = new HocuspocusProvider({
    url: COLLABORATION_URL,
    name: documentName,
    document: ydoc,
    token: accessToken,

    onStatus: ({ status }) => {
      onStatus?.(status);
    },

    onSynced: ({ state }) => {
      onSynced?.(state);
    },

    onAuthenticationFailed: (data) => {
      console.error("Collaboration authentication failed:", data);

      onAuthenticationFailed?.(data);
    },
  });

  return {
    ydoc,
    provider,

    destroy: () => {
      provider.destroy();
      ydoc.destroy();
    },
  };
};
