import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      role: "ADMIN" | "USER" | "GUEST";
    } & DefaultSession["user"];
  }

  interface User {
    role: "ADMIN" | "USER" | "GUEST";
    password?: string | null;
  }
}
