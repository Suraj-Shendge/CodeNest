import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const sub = await prisma.submission.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      status: true,
      verdict: true,
      output: true,
      runtimeMs: true,
    },
  });
  if (!sub) return NextResponse.error();
  return NextResponse.json(sub);
}
