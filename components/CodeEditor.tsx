'use client';

import { useEffect, useRef, useState } from "react";
import { Box, CircularProgress } from "@mui/material";

/**
 * Client‑only code editor that loads Monaco *after* the component mounts.
 * This prevents `window is not defined` during the server‑side build.
 */
export default function CodeEditor({
  language,
  code,
  onChange,
}: {
  language: string;
  code: string;
  onChange: (value: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const [monacoReady, setMonacoReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamically import Monaco – runs only in the browser
    import("monaco-editor")
      .then((monaco) => {
        // Create the editor only once
        if (!editorRef.current) {
          editorRef.current = monaco.editor.create(containerRef.current!, {
            value: code,
            language,
            theme: "vs-dark",
            automaticLayout: true,
            minimap: { enabled: false },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
          });

          // Keep the parent component in sync when the user types
          editorRef.current.onDidChangeModelContent(() => {
            const newValue = editorRef.current?.getValue() ?? "";
            if (newValue !== code) {
              onChange(newValue);
            }
          });
        } else {
          // Update language or content when props change
          monaco.editor.setModelLanguage(
            editorRef.current.getModel(),
            language
          );
          if (code !== editorRef.current.getValue()) {
            editorRef.current.setValue(code);
          }
        }
        setMonacoReady(true);
      })
      .catch((err) => {
        console.error("Failed to load Monaco:", err);
      });
  }, [language, code, onChange]);

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        height: "400px",
        position: "relative",
      }}
    >
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {/* Show a spinner until Monaco has been loaded */}
      {!monacoReady && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "background.default",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
