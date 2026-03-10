"use client";

import Link from "next/link";
import { Card, CardContent, Chip, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Problem } from "./ProblemList";

export default function ProblemCard({
  problem,
  index,
}: {
  problem: Problem;
  index: number;
}) {
  const difficultyColors = {
    Easy: "success.main",
    Medium: "warning.main",
    Hard: "error.main",
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.07, type: "spring", stiffness: 80 },
    }),
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <Link href={`/problem/${problem.id}`} style={{ textDecoration: "none" }}>
        <Card sx={{ height: "100%", ":hover": { boxShadow: 8 } }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
              {problem.title}
            </Typography>
            <Chip
              label={problem.difficulty}
              size="small"
              sx={{
                bgcolor: difficultyColors[problem.difficulty],
                color: "common.white",
                mr: 1,
              }}
            />
            {problem.tags.map((t) => (
              <Chip
                key={t}
                label={t}
                size="small"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

