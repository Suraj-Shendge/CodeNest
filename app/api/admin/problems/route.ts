import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const problems = await prisma.problem.findMany({
    select: { id: true, title: true, difficulty: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(problems);
}

export async function POST(req: Request) {
  const { title, description, difficulty, tags } = await req.json();

  const problem = await prisma.problem.create({
    data: {
      title,
      description,
      difficulty,
      tags,
      createdBy: { connect: { id: (req as any).auth?.user?.id } }, // will be filled later when we add auth guard
    },
  });

  return NextResponse.json(problem);
}
