"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";

  return (
    <header className="w-full bg-gray-100 border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Header</h1>
      <nav className="flex gap-6">
        <Link
          href="/"
          className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
        >
          Home
        </Link>

        <Link
          href="/product"
          className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
        >
          Product
        </Link>

        <Link
          href="/about"
          className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
        >
          Contact
        </Link>
        {isAdmin && (
          <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
            Admin
          </Link>
        )}
        {session ? (
          <button
            onClick={() => signOut()}
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            Sign out
          </button>
        ) : (
          <Link
            href="/login"
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}