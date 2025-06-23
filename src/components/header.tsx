import Link from "next/link";

export default function Header() {
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

<Link href={"/product"} className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Product</Link>

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
      </nav>
    </header>
  );
}