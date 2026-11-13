import "./collaboration.css";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";

import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";

// Assign a consistent color to each user.
function getUserColor(userId = "") {
  const colors = [
    "#E06C75",
    "#61AFEF",
    "#C678DD",
    "#E5C07B",
    "#56B6C2",
    "#98C379",
  ];

  let hash = 0;

  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }

  return colors[hash % colors.length];
}

function CodeEditor({
  value = "",
  language = "javascript",
  onChange,
  ydoc,
  provider,
  fileId,
}) {
  const theme = useThemeStore((state) => state.theme);
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  const [editorInstance, setEditorInstance] = useState(null);

  const editorTheme = theme === "dark" ? "vs-dark" : "light";

  // 1. Publish current user's identity through Yjs Awareness.
  useEffect(() => {
    if (!provider || !user) return;

    const awareness = provider.awareness;

    const userName =
      profile?.full_name ||
      user.user_metadata?.full_name ||
      user.email ||
      "Anonymous";

    awareness.setLocalStateField("user", {
      id: user.id,
      name: userName,
      color: getUserColor(user.id),
    });

    const logAwareness = () => {
      console.table(
        Array.from(awareness.getStates().entries()).map(
          ([clientId, state]) => ({
            clientId,
            userId: state.user?.id,
            name: state.user?.name,
            color: state.user?.color,
          }),
        ),
      );
    };

    awareness.on("change", logAwareness);
    logAwareness();

    return () => {
      awareness.off("change", logAwareness);
      awareness.setLocalStateField("user", null);
    };
  }, [provider, user, profile]);

  // 2. Apply individual cursor colors and collaborator labels.
  useEffect(() => {
    if (!provider) return;

    const awareness = provider.awareness;

    const styleElement = document.createElement("style");
    styleElement.setAttribute("data-coderoom-cursors", "true");

    document.head.appendChild(styleElement);

    const updateCursorStyles = () => {
      const styles = [];

      awareness.getStates().forEach((state, clientId) => {
        const color = state.user?.color;
        const name = state.user?.name || "Collaborator";

        if (!color || !/^#[0-9a-fA-F]{6}$/.test(color)) {
          return;
        }

        // Remote text selection.
        styles.push(`
          .yRemoteSelection-${clientId} {
            background-color: ${color}35 !important;
            border-radius: 2px;
          }
        `);

        // Remote cursor.
        styles.push(`
          .yRemoteSelectionHead-${clientId} {
            position: absolute;
            border-left: 2px solid ${color} !important;
            border-top: none !important;
            border-bottom: none !important;
            color: ${color};
            z-index: 20;
          }
        `);

        // Collaborator name badge.
        styles.push(`
          .yRemoteSelectionHead-${clientId}::after {
            content: ${JSON.stringify(name)};
            position: absolute;
            left: -2px;
            top: -25px;
            padding: 4px 9px;
            background: ${color};
            color: #202824;
            border-radius: 5px 5px 5px 0;
            font-family: Arial, sans-serif;
            font-size: 11px;
            font-weight: 600;
            line-height: 16px;
            white-space: nowrap;
            pointer-events: none;
            z-index: 100;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          }
        `);
      });

      styleElement.textContent = styles.join("\n");
    };

    awareness.on("update", updateCursorStyles);
    updateCursorStyles();

    return () => {
      awareness.off("update", updateCursorStyles);
      styleElement.remove();
    };
  }, [provider]);

  // 3. Connect Monaco editor to the shared Yjs document.
  useEffect(() => {
    if (!editorInstance || !ydoc || !provider || !fileId) {
      return;
    }

    const model = editorInstance.getModel();

    if (!model) return;

    const binding = new MonacoBinding(
      ydoc.getText("monaco"),
      model,
      new Set([editorInstance]),
      provider.awareness,
    );

    console.log("Monaco Binding Created:", {
      fileId,
      clientId: provider.awareness.clientID,
    });

    return () => {
      binding.destroy();
    };
  }, [editorInstance, ydoc, provider, fileId]);

  // 4. Render Monaco editor.
  return (
    <div className="h-full w-full overflow-hidden">
      <Editor
        height="100%"
        width="100%"
        path={fileId}
        defaultValue={value}
        language={language}
        theme={editorTheme}
        onMount={(editor) => setEditorInstance(editor)}
        onChange={(newValue) => onChange?.(newValue ?? "")}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "Consolas, 'Courier New', monospace",
          wordWrap: "on",
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          roundedSelection: false,
          renderLineHighlight: "line",
          padding: { top: 16, bottom: 16 },
          tabSize: 2,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
        }}
      />
    </div>
  );
}

export default CodeEditor;
