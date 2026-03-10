'use client';                     // <─ ★ THIS LINE MAKES IT A CLIENT COMPONENT

import { useSession, signOut } from "next-auth/react";
import { Box, Avatar, Typography, Button } from "@mui/material";

/**
 * Profile page – shows the logged‑in user’s avatar, name & email.
 * Uses next‑auth’s `useSession` hook, so it must be a client component.
 */
export default function Profile() {
  const { data: session, status } = useSession();

  // Loading state while next‑auth fetches the session
  if (status === "loading")
    return <Typography>Loading…</Typography>;

  // Not signed‑in – you could optionally redirect to /api/auth/signin
  if (!session)
    return <Typography>You are not signed in.</Typography>;

  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <Avatar
        src={session.user?.image ?? undefined}
        sx={{ width: 96, height: 96, mx: "auto", mb: 2 }}
      />
      <Typography variant="h5">
        {session.user?.name ?? "Unnamed"}
      </Typography>
      <Typography variant="subtitle1">{session.user?.email}</Typography>

      <Button
        variant="outlined"
        sx={{ mt: 2 }}
        onClick={() => signOut()}
      >
        Sign out
      </Button>
    </Box>
  );
}
