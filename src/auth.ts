import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { z } from "zod"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import type { DefaultSession } from "next-auth"
import { Role } from "@prisma/client/edge"



// Extend NextAuth types
declare module "next-auth" {
  interface User {
    role: Role
  }

  interface Session {
    user: {
      id: string
      role: Role
    } & DefaultSession["user"]
  }
}

declare module "next-auth" {
  interface JWT {
    role: Role
    sub: string
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          email: profile.email,
          name: profile.name,
          image: profile.avatar_url,
          // Default role for GitHub users, customize as needed
          role: profile.email === "admin@gmail.com" ? "ADMIN" : "USER",
        }
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const parsedCredentials = credentialsSchema.parse(credentials)

          const user = await prisma.user.findUnique({
            where: {
              email: parsedCredentials.email,
            },
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(parsedCredentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          // Return user object that matches NextAuth User interface
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role as Role,
          }
        } catch (error) {
          console.error("Error in authorize:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // JWT callback: runs whenever JWT is created/updated
    jwt: async ({ token, user }) => {
      // When user signs in, add role to token
      if (user) {
        token.role = user.role
        token.sub = user.id
        token.picture = user.image || null
      }
      return token
    },

    // Session callback: runs whenever session is checked
    session: async ({ session, token }) => {
      // Pass role and id from token to session
      if (token) {
        session.user.id = token.sub as string
        session.user.role = token.role as Role
        session.user.image = token.picture as string | null
      }
      return session
    },

    authorized: async ({ auth }) => {
      return !!auth
    },
  },
})
