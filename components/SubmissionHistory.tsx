'use client';

import { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";

type Submission = {
  id: string;
  language: string;
  verdict: string | null;
  runtimeMs: number | null;
  createdAt: string;
};

export default function SubmissionHistory({ problemId }: { problemId: string }) {
  const { data: session } = useSession();
  const [subs, setSubs] = useState<Submission[] | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return; // not logged in → nothing to load
    fetch(`/api/submissions?problemId=${problemId}`)
      .then((r) => r.json())
      .then(setSubs)
      .catch(() => setSubs([]));
  }, [session, problemId]);

  if (!subs) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  if (subs.length === 0) {
    return (
      <Typography variant="body2" sx={{ mt: 2 }}>
        You have not submitted anything for this problem yet.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Your submission history
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>When</TableCell>
            <TableCell>Language</TableCell>
            <TableCell>Verdict</TableCell>
            <TableCell>Runtime (ms)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subs.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{new Date(s.createdAt).toLocaleString()}</TableCell>
              <TableCell>{s.language}</TableCell>
              <TableCell>{s.verdict ?? "—"}</TableCell>
              <TableCell>{s.runtimeMs ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
