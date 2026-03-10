'use client';

import { useState } from "react";
import { Box, Button, Chip, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeEditor from "./CodeEditor";
import { submitCode } from "@/lib/api";
import SubmissionResult from "./SubmissionResult";
import { toast } from "react-hot-toast";

export interface ProblemViewerProps {
  problem: {
    id: string;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    tags: string[];
    description: string;
    testCases: { input: string; output: string }[];
  };
}

/* ---------- helper: map difficulty → default language ---------- */
const languageMap: Record<string, string> = {
  Easy: "python",
  Medium: "javascript",
  Hard: "cpp",
};
/* ------------------------------------------------------------ */

export default function ProblemViewer({
  problem,
}: {
  problem: ProblemViewerProps["problem"];
}) {
  const language = languageMap[problem.difficulty];
  const [code, setCode] = useState<string>(defaultTemplate(language));
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    passed: boolean;
    stdout: string;
    exitCode: number;
  } | null>(null);

  const handleSubmit = async () => {
  setSubmitting(true);
  setResult(null);
  try {
    const { submissionId } = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        problemId: problem.id,
        language,
        source: code,
      }),
    }).then((r) => r.json());

    // -------------------------------------------------
    // **Polling** – every 1 s we ask the server for the latest status.
    // A more production‑ready solution would be SSE/WS.
    // -------------------------------------------------
    const poll = async () => {
      const data = await fetch(`/api/submissions/${submissionId}`).then((r) => r.json());

      if (data.status === "FINISHED") {
        setResult({
          passed: data.verdict === "Accepted",
          stdout: data.output ?? "",
          exitCode: data.runtimeMs ?? 0,
        });
        setSubmitting(false);
      } else {
        // still pending/running → keep polling
        setTimeout(poll, 800);
      }
    };
    poll();
  } catch (e) {
    console.error(e);
    toast.error("Submission failed");
    setSubmitting(false);
  }
};


  const difficultyColor = {
    Easy: "success.main",
    Medium: "warning.main",
    Hard: "error.main",
  }[problem.difficulty];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {problem.title}
      </Typography>
      <Chip
        label={problem.difficulty}
        sx={{
          bgcolor: difficultyColor,
          color: "common.white",
          mr: 1,
        }}
      />
      {problem.tags.map((t) => (
        <Chip key={t} label={t} variant="outlined" sx={{ mr: 0.5 }} />
      ))}

      {/* description */}
      <Box sx={{ my: 2 }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {problem.description}
        </ReactMarkdown>
      </Box>

      {/* sample I/O */}
      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Sample Input
        </Typography>
        <Box
          sx={{
            fontFamily: "monospace",
            bgcolor: "grey.100",
            p: 1,
            borderRadius: 1,
            whiteSpace: "pre-wrap",
          }}
        >
          {problem.testCases[0].input}
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
          Sample Output
        </Typography>
        <Box
          sx={{
            fontFamily: "monospace",
            bgcolor: "grey.100",
            p: 1,
            borderRadius: 1,
            whiteSpace: "pre-wrap",
          }}
        >
          {problem.testCases[0].output}
        </Box>
      </Box>

      {/* editor */}
      <Box sx={{ mt: 3 }}>
        <CodeEditor language={language} code={code} onChange={setCode} />
      </Box>

      {/* run button */}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting…" : "Run"}
        </Button>
      </Box>

      {/* result */}
      {result && <SubmissionResult result={result} />}
    </Box>
  );
}

/* ---------- tiny starter templates ---------- */
function defaultTemplate(lang: string): string {
  switch (lang) {
    case "python":
      return "# Write your solution in Python\n";
    case "javascript":
      return "// Write your solution in JavaScript\n";
    case "cpp":
      return `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your solution in C++
    return 0;
}
`;
    default:
      return "";
  }
}
