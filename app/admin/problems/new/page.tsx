'use client';
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Chip,
  Stack,
} from "@mui/material";

export default function NewProblem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Easy"
  );
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleSubmit = async () => {
    await fetch("/api/admin/problems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        difficulty,
        tags,
      }),
    });
    // redirect back to list
    window.location.href = "/admin/problems";
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        New Problem
      </Typography>

      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        multiline
        rows={6}
        label="Description (markdown)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        select
        label="Difficulty"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value as any)}
        sx={{ mb: 2, width: 150 }}
      >
        <MenuItem value="Easy">Easy</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="Hard">Hard</MenuItem>
      </TextField>

      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1}>
          <TextField
            label="Add tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
          />
          <Button onClick={handleAddTag}>Add</Button>
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

      <Button variant="contained" onClick={handleSubmit}>
        Save
      </Button>
    </Box>
  );
}
