'use client'; // 👈🏻 This MUST be the very first line – makes the file a client component

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Chip,
  Stack,
} from "@mui/material";
import { toast } from "react-hot-toast";

/* --------------------------------------------------------------
   Types – keep them in sync with your Prisma schema.
   If you added extra fields (e.g. `isPremium`) include them here.
----------------------------------------------------------------*/
type Problem = {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  testCases: { input: string; output: string }[];
};

/* --------------------------------------------------------------
   EditProblem – Admin UI for a single problem (dynamic route `[id]`)
---------------------------------------------------------------*/
export default function EditProblem() {
  const router = useRouter();
  const { id } = useParams() as { id: string }; // the problem id from the URL

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // UI state for the form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Problem["difficulty"]>("Easy");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // -----------------------------------------------------------------
  // 1️⃣ Load the problem data when the component mounts
  // -----------------------------------------------------------------
  useEffect(() => {
    async function fetchProblem() {
      try {
        const res = await fetch(`/api/admin/problems/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Problem = await res.json();
        setProblem(data);
        // Populate the form fields
        setTitle(data.title);
        setDescription(data.description);
        setDifficulty(data.difficulty);
        setTags(data.tags);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load problem data.");
      } finally {
        setLoading(false);
      }
    }

    fetchProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // -----------------------------------------------------------------
  // 2️⃣ Helper to add a new tag (Enter or click “Add”)
  // -----------------------------------------------------------------
  const addTag = () => {
    const clean = tagInput.trim();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput("");
    }
  };

  // -----------------------------------------------------------------
  // 3️⃣ Save (PUT) handler
  // -----------------------------------------------------------------
  const handleSave = async () => {
    if (!problem) return;
    setSaving(true);
    try {
      const payload = {
        title,
        description,
        difficulty,
        tags,
        // Keep testCases untouched for now (admin can edit them later)
        // If you want to edit test cases here, add UI for them and include them in payload
      };

      const res = await fetch(`/api/admin/problems/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success("Problem saved!");
      // Optional: redirect back to the problem list
      router.push("/admin/problems");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save problem.");
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------------------------------
  // 4️⃣ Render
  // -----------------------------------------------------------------
  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading problem…</Typography>
      </Box>
    );
  }

  // This guard should never happen (loading ensures `problem` is set),
  // but TypeScript likes the check.
  if (!problem) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Problem not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Problem
      </Typography>

      {/* ----- Title ----- */}
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* ----- Description (markdown) ----- */}
      <TextField
        fullWidth
        multiline
        rows={6}
        label="Description (markdown)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* ----- Difficulty selector ----- */}
      <TextField
        select
        label="Difficulty"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value as Problem["difficulty"])}
        sx={{ mb: 2, width: 180 }}
      >
        <MenuItem value="Easy">Easy</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="Hard">Hard</MenuItem>
      </TextField>

      {/* ----- Tags input ----- */}
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            label="Add tag"
            value={tagInput}
            size="small"
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
          />
          <Button variant="contained" size="small" onClick={addTag}>
            Add
          </Button>
        </Stack>
        <Box sx={{ mt: 1 }}>
          {tags.map((t) => (
            <Chip
              key={t}
              label={t}
              onDelete={() => setTags(tags.filter((x) => x !== t))}
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>
      </Box>

      {/* ----- Save button ----- */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
}

