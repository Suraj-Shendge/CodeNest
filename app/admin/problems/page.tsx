'use client';
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type ProblemRow = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

export default function AdminProblemList() {
  const [problems, setProblems] = useState<ProblemRow[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/problems")
      .then((r) => r.json())
      .then(setProblems);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this problem?")) return;
    await fetch(`/api/admin/problems/${id}`, { method: "DELETE" });
    setProblems((prev) => prev?.filter((p) => p.id !== id) ?? null);
  };

  if (!problems) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Button component={Link} href="/admin/problems/new" variant="contained">
        New Problem
      </Button>

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Difficulty</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {problems.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.title}</TableCell>
              <TableCell>{p.difficulty}</TableCell>
              <TableCell align="right">
                <IconButton component={Link} href={`/admin/problems/${p.id}`}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(p.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
