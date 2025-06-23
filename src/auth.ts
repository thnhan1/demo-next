
import NextAuth, { type DefaultSession, type NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export type Role = "ADMIN" | "USER" | "GUEST"

declare module "next-auth" {
  interface Session {
    user?: { id: string; role: Role } & DefaultSession["user"]
  }
  interface User {
    role: Role
    password?: string | null
  }
}
const config = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user || !user.password) return null
        const isValid = await bcrypt.compare(credentials.password, user.password)
        return isValid ? user : null
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = user.role
      }
      return session
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
