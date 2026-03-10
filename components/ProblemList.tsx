"use client";

import { useEffect, useState } from "react";
import ProblemCard from "./ProblemCard";
import { Box, CircularProgress } from "@mui/material";

/* ---------- EXPORT THE PROBLEM TYPE ---------- */
export type Problem = {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  testCases: { input: string; output: string }[];
};
/* ------------------------------------------------ */

import problemsData from "@/data/problems.json"; // static import – tiny JSON, no extra bundle size

export default function ProblemList() {
  const [problems, setProblems] = useState<Problem[]>([]);

  // Load JSON once (client‑side) and tell TS that it *is* a Problem[]
  useEffect(() => {
    // `as unknown as Problem[]` is a safe cast because we control the data shape
    setProblems(problemsData as unknown as Problem[]);
  }, []); // empty deps → run only on mount

  // While the data is loading we can show a small spinner (optional)
  if (!problems.length) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "1rem",
      }}
    >
      {problems.map((p, i) => (
        <ProblemCard key={p.id} problem={p} index={i} />
      ))}
    </Box>
  );
}
