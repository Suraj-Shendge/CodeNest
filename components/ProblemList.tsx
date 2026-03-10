"use client";

import { useEffect, useState } from "react";
import ProblemCard from "./ProblemCard";
import { Problem } from "./ProblemCard";

const ProblemList = () => {
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    // In a real app you’d fetch from an API.
    // Here we just import a static JSON.
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
};

export default ProblemList;

