import { notFound } from "next/navigation";
import ProblemViewer from "@/components/ProblemViewer";
import problems from "@/data/problems.json";
import { Problem } from "@/components/ProblemList";

export async function generateStaticParams() {
  // Enable static generation for each problem at build time
  return problems.map((p) => ({ id: p.id }));
}

export default function ProblemPage({
  params,
}: {
  params: { id: string };
}) {
  const problem = (problems as Problem[]).find((p) => p.id === params.id);
  if (!problem) notFound();

  return <ProblemViewer problem={problem!} />;
}

