import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const problem = await prisma.problem.findUnique({
    where: { id: params.id },
    include: { testCases: true },
  });
  if (!problem) return NextResponse.error();
  return NextResponse.json(problem);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const updated = await prisma.problem.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await prisma.problem.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}
