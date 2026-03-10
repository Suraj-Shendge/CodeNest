// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

/* -------------------------------------------------------------
   1️⃣  Define the Next‑Auth options – **do NOT export them**.
   ------------------------------------------------------------- */
const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER!,
      from: process.env.EMAIL_FROM!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user }) {
      // expose the DB id (and premium flag) to the client side
      // @ts-ignore – we add custom fields to the session object
      session.user.id = user.id;
      // @ts-ignore
      session.user.premium = user.premium;
      return session;
    },
  },
};

/* -------------------------------------------------------------
   2️⃣  Create the handler once and re‑export it as GET & POST
   ------------------------------------------------------------- */
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
