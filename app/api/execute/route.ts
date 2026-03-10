import { NextResponse } from "next/server";

/**
 * POST /api/execute
 * Body: { language: string, source: string, stdin?: string }
 * Returns: { stdout, stderr, output, exitCode }
 *
 * The route forwards the request to the public Piston API:
 * https://emkc.org/api/v2/piston/execute
 */
export async function POST(request: Request) {
  try {
    const { language, source, stdin = "" } = await request.json();

    // Choose a default version for the language (hard‑coded list works fine)
    const versionMap: Record<string, string> = {
      python: "3.10.0",
      javascript: "18.15.0",
      cpp: "22.0.0",
      java: "17.0.0",
      go: "1.20.0",
      ruby: "3.2.0",
    };
    const version = versionMap[language] ?? "latest";

    // Helper to map language → file extension for Piston
    const extMap: Record<string, string> = {
      python: "py",
      javascript: "js",
      cpp: "cpp",
      java: "java",
      go: "go",
      ruby: "rb",
    };
    const ext = extMap[language] ?? "txt";

    const payload = {
      language,
      version,
      files: [{ name: `main.${ext}`, content: source }],
      stdin,
    };

    const pistonResp = await fetch(
      process.env.NEXT_PUBLIC_PISTON_ENDPOINT ??
        "https://emkc.org/api/v2/piston/execute",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!pistonResp.ok) {
      const txt = await pistonResp.text();
      return NextResponse.json(
        { error: "Piston request failed", details: txt },
        { status: 502 }
      );
    }

    const data: any = await pistonResp.json();
    const { stdout, stderr, output, code } = data.run;

    return NextResponse.json({
      stdout,
      stderr,
      output,
      exitCode: code,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

