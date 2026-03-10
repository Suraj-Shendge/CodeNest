"use client";

import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { Box, CircularProgress } from "@mui/material";

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
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  // Load monaco only on the client
  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize once
    if (!editorRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: code,
        language,
        theme: "vs-dark",
        automaticLayout: true,
        minimap: { enabled: false },
        lineNumbers: "on",
        scrollBeyondLastLine: false,
      });

      editorRef.current.onDidChangeModelContent(() => {
        const val = editorRef.current?.getValue() ?? "";
        onChange(val);
      });
    } else {
      // Change language / content if props change
      monaco.editor.setModelLanguage(editorRef.current.getModel()!, language);
      if (code !== editorRef.current.getValue()) {
        editorRef.current.setValue(code);
      }
    }
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
      {/* Fallback loader */}
      {!editorRef.current && (
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

