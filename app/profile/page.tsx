'use client';
import { useSession, signOut } from "next-auth/react";
import { Box, Avatar, Typography, Button } from "@mui/material";

export default function Profile() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Typography>Loading…</Typography>;
  if (!session) return <Typography>You are not signed in.</Typography>;

  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <Avatar
        src={session.user?.image ?? undefined}
        sx={{ width: 96, height: 96, mx: "auto", mb: 2 }}
      />
      <Typography variant="h5">{session.user?.name ?? "Unnamed"}</Typography>
      <Typography variant="subtitle1">{session.user?.email}</Typography>
      <Button variant="outlined" sx={{ mt: 2 }} onClick={() => signOut()}>
        Sign out
      </Button>
    </Box>
  );
}
