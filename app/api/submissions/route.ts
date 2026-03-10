import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { authGuard } from "@/lib/authMiddleware";

export async function POST(req: Request) {
  const err = await authGuard(req);
  if (err) return err;

  const { problemId, language, source } = await req.json();

  const sub = await prisma.submission.create({
    data: {
      problemId,
      language,
      sourceCode: source,
      user: { connect: { id: (req as any).auth.user.id } },
    },
  });

  // fire‑and‑forget judge (same logic you already had)
  (async () => {
    try {
      await prisma.submission.update({
        where: { id: sub.id },
        data: { status: "RUNNING" },
      });

      const exec = await fetch(
        `${process.env.NEXT_PUBLIC_PISTON_ENDPOINT}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language,
            version: "latest",
            files: [{ name: "main", content: source }],
            stdin: "",
          }),
        }
      ).then((r) => r.json());

      // Very naive correctness check – you’ll replace with proper test‑case matching later
      const passed = exec.stdout?.trim() === "EXPECTED_OUTPUT";

      await prisma.submission.update({
        where: { id: sub.id },
        data: {
          status: "FINISHED",
          verdict: passed ? "Accepted" : "Wrong Answer",
          output: exec.stdout,
          runtimeMs: exec.run?.duration ?? null,
        },
      });

      if (passed) {
        await prisma.user.update({
          where: { id: (req as any).auth.user.id },
          data: { rating: { increment: 10 } },
        });
      }
    } catch (e) {
      await prisma.submission.update({
        where: { id: sub.id },
        data: {
          status: "FINISHED",
          verdict: "Error",
          output: String(e),
        },
      });
    }
  })();

  return NextResponse.json({ submissionId: sub.id });
}

// GET – list submissions for the logged‑in user (optionally filtered by problem)
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
