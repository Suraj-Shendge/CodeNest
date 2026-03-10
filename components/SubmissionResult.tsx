"use client";

import { Box, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function SubmissionResult({
  result,
}: {
  result: {
    passed: boolean;
    stdout: string;
    exitCode: number;
  };
}) {
  const { width, height } = useWindowSize();

  return (
    <Box sx={{ mt: 4 }}>
      {result.passed && <Confetti width={width} height={height} recycle={false} />}

      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderLeft: 4,
          borderColor: result.passed ? "success.main" : "error.main",
          bgcolor: result.passed ? "success.light" : "error.light",
        }}
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Typography variant="h6" gutterBottom>
          {result.passed ? "✅ Accepted!" : "❌ Wrong Answer"}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Exit code: {result.exitCode}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Output:
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
          {result.stdout}
        </Box>
      </Paper>
    </Box>
  );
}

