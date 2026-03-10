import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

/**
 * Returns `null` on success (the request is authenticated) or a NextResponse
 * with 401/403 if the token is missing/invalid.
 * The authenticated user data is attached to `req.auth`.
 */
export async function authGuard(req: Request) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.sub) {
    // not logged in
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // attach a simple auth payload for downstream handlers
  (req as any).auth = { user: { id: token.sub, email: token.email } };
  return null;
}
