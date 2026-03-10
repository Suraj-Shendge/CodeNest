import axios from "axios";

/**
 * Thin wrapper around our `/api/execute` route.
 */
export async function submitCode(params: {
  language: string;
  source: string;
  stdin?: string;
}): Promise<{
  stdout: string;
  stderr: string;
  exitCode: number;
}> {
  const { data } = await axios.post("/api/execute", params);
  return {
    stdout: data.stdout,
    stderr: data.stderr,
    exitCode: data.exitCode,
  };
}

