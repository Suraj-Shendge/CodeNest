// app/api/submissions/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { authGuard } from "@/lib/authMiddleware";

// POST – create a new submission (already existed in Sprint‑3)
export async function POST(req: Request) {
  const err = await authGuard(req);
  if (err) return err;

  const { problemId, language, source } = await req.json();

  // Create a pending submission in the DB
  const sub = await prisma.submission.create({
    data: {
      problemId,
      language,
      sourceCode: source,
      user: { connect: { id: (req as any).auth.user.id } },
    },
  });

  // Fire‑and‑forget to the Piston API (same logic you already used)
  (async () => {
    try {
      // Mark as RUNNING
      await prisma.submission.update({
        where: { id: sub.id },
        data: { status: "RUNNING" },
      });

      // Call the thin wrapper that talks to Piston (lib/api.ts)
      const exec = await fetch(`${process.env.NEXT_PUBLIC_PISTON_ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          version: "latest",
          files: [{ name: "main", content: source }],
          stdin: "", // could forward first test case if you want
        }),
      }).then((r) => r.json());

      const passed = exec.stdout.trim() === "EXPECTED_OUTPUT"; // you’ll replace with real logic

      await prisma.submission.update({
        where: { id: sub.id },
        data: {
          status: "FINISHED",
          verdict: passed ? "Accepted" : "Wrong Answer",
          output: exec.stdout,
          runtimeMs: exec.run?.duration ?? null,
        },
      });

      // Simple rating bump (optional, you can refine later)
      if (passed) {
        await prisma.user.update({
          where: { id: (req as any).auth.user.id },
          data: { rating: { increment: 10 } },
        });
      }
    } catch (e) {
      await prisma.submission.update({
        where: { id: sub.id },
        data: { status: "FINISHED", verdict: "Error", output: String(e) },
      });
    }
  })();

  return NextResponse.json({ submissionId: sub.id });
}

// GET – list submissions for the logged‑in user + optional problemId filter
export async function GET(req: Request) {
  const err = await authGuard(req);
  if (err) return err;

  const url = new URL(req.url);
  const problemId = url.searchParams.get("problemId");

  const subs = await prisma.submission.findMany({
    where: {
      userId: (req as any).auth.user.id,
      ...(problemId ? { problemId } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      language: true,
      verdict: true,
      runtimeMs: true,
      createdAt: true,
    },
  });

  return NextResponse.json(subs);
}
