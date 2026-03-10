'use client';

import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Typography,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeEditor from "./CodeEditor";
import { submitCode } from "@/lib/api";
import SubmissionResult from "./SubmissionResult";
import SubmissionHistory from "./SubmissionHistory";
import { toast } from "react-hot-toast";

/* -----------------------------------------------------------------
   Props type – mirrors the shape you store in the DB.
----------------------------------------------------------------- */
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

/* -----------------------------------------------------------------
   Helper: map difficulty → default language for the demo UI.
----------------------------------------------------------------- */
const languageMap: Record<string, string> = {
  Easy: "python",
  Medium: "javascript",
  Hard: "cpp",
};

/* -----------------------------------------------------------------
   Main component – client‑side (needs hooks & Monaco).
----------------------------------------------------------------- */
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

  /** -----------------------------------------------------------------
   *  Submit handler – talks to our thin wrapper (`/api/submissions`)
   * ----------------------------------------------------------------- */
  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const exec = await submitCode({
        language,
        source: code,
        stdin: problem.testCases[0].input,
      });

      const passed =
        exec.stdout.trim() === problem.testCases[0].output.trim();

      setResult({
        passed,
        stdout: exec.stdout,
        exitCode: exec.exitCode,
      });

      if (passed) toast.success("All test cases passed!");
      else toast.error("Wrong answer – keep trying!");
    } catch (e: any) {
      console.error(e);
      toast.error("Submission failed");
    } finally {
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
      {/* ------------------ Header ------------------ */}
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

      {/* ------------------ Description ------------------ */}
      <Box sx={{ my: 2 }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {problem.description}
        </ReactMarkdown>
      </Box>

      {/* ------------------ Sample I/O ------------------ */}
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

      {/* ------------------ Editor ------------------ */}
      <Box sx={{ mt: 3 }}>
        <CodeEditor language={language} code={code} onChange={setCode} />
      </Box>

      {/* ------------------ Run button ------------------ */}
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

      {/* ------------------ Result (confetti etc.) ------------------ */}
      {result && <SubmissionResult result={result} />}

      {/* ------------------ Past submissions for this problem ------------------ */}
      <SubmissionHistory problemId={problem.id} />
    </Box>
  );
}

/* -----------------------------------------------------------------
   Tiny starter templates – you can replace with anything you like.
----------------------------------------------------------------- */
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
