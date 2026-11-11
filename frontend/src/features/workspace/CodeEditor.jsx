import Editor from "@monaco-editor/react";
import { useThemeStore } from "../../store/themeStore";

function CodeEditor({ value = "", language = "javascript", onChange }) {
  const theme = useThemeStore((state) => state.theme);

  const editorTheme = theme === "dark" ? "vs-dark" : "light";

  return (
    <div className="h-full w-full overflow-hidden">
      <Editor
        height="100%"
        width="100%"
        language={language}
        theme={editorTheme}
        value={value}
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
