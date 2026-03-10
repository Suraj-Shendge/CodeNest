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
export default function ProblemList() {
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    import("@/data/problems.json").then((module) => setProblems(module.default));
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "1rem",
      }}
    >
      {problems.map((p, i) => (
        <ProblemCard key={p.id} problem={p} index={i} />
      ))}
    </div>
  );
}
