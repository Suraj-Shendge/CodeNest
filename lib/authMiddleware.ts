import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function authGuard(req: Request) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.sub) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // attach a tiny auth payload for downstream handlers
  (req as any).auth = { user: { id: token.sub, email: token.email } };
  return null;
}
