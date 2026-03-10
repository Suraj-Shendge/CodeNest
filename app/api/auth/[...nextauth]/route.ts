// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

/* ------------------------------------------------------------
   1️⃣  Define the Next‑Auth options.
   ------------------------------------------------------------ */
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

  /* --------------------------------------------------------
     2️⃣  Callback – give the parameters an explicit type.
     -------------------------------------------------------- */
  callbacks: {
    async session({
      session,
      user,
    }: {
      session: any;   // ← explicit – avoids “implicitly has an any type”
      user: any;      // you can tighten the type later if you wish
    }) {
      // Attach extra fields to the client‑side session.
      // These @ts-ignore comments silence the “property does not exist” warning.
      // (Next‑Auth’s Session type only has `user: { name?, email?, image? }`.)
      // We add the DB‑id and the premium flag for our own logic.
      // --------------------------------------------------------
      // @ts-ignore
      session.user.id = user.id;
      // @ts-ignore
      session.user.premium = user.premium;
      return session;
    },
  },
};

/* ------------------------------------------------------------
   3️⃣  Create a single handler and export it as GET & POST
       (the only two HTTP verbs that Next‑Auth needs).
   ------------------------------------------------------------ */
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
