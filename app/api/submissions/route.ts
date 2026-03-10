import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { submitCode } from "@/lib/api"; // our thin wrapper for Piston

export async function POST(req: Request) {
  // we expect the client to send: { problemId, language, source }
  const { problemId, language, source } = await req.json();

  // First, create a DB row with status = PENDING
  const sub = await prisma.submission.create({
    data: {
      problemId,
      language,
      sourceCode: source,
      user: { connect: { id: (req as any).auth?.user?.id } },
    },
  });

  // **Asynchronously** call the judge – we don't await it.
  // This is a fire‑and‑forget pattern: we start the request,
  // then the client will poll or use SSE to get live updates.
  // (Later, replace with a Message Queue + worker.)
  (async () => {
    try {
      // update status to RUNNING
      await prisma.submission.update({
        where: { id: sub.id },
        data: { status: "RUNNING" },
      });

      const exec = await submitCode({
        language,
        source,
        // You can also send the first test case input if you have it
      });

      const passed = exec.stdout.trim() === "…expected…" /* placeholder */;
      await prisma.submission.update({
        where: { id: sub.id },
        data: {
          status: "FINISHED",
          verdict: passed ? "Accepted" : "Wrong Answer",
          runtimeMs: exec.exitCode, // you can map to actual time after you fetch it
          output: exec.stdout,
        },
      });
    } catch (err) {
      await prisma.submission.update({
        where: { id: sub.id },
        data: { status: "FINISHED", verdict: "Error", output: String(err) },
      });
    }
  })();

  // Respond immediately with the submission id (client will poll)
  return NextResponse.json({ submissionId: sub.id });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const problemId = url.searchParams.get("problemId");
  const userId = (req as any).auth?.user?.id; // auth guard needed later

  const subs = await prisma.submission.findMany({
    where: { problemId: problemId ?? undefined, userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      language: true,
      status: true,
      verdict: true,
      runtimeMs: true,
      createdAt: true,
    },
  });
  return NextResponse.json(subs);
}
