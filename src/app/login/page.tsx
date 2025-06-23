"use client"

import { signIn } from "next-auth/react"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    if (!res?.error) {
      router.push("/")
    }
  }

  return (
    <div className="mx-auto max-w-sm py-10">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => signIn("github")}
        >
          Sign in with GitHub
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        Don&apos;t have an account? <Link href="/register" className="underline">Register</Link>
      </p>
    </div>
  )
}
