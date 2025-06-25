"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOutIcon, Menu, User as UserIcon } from "lucide-react";
import * as React from "react";
import { useAppSelector } from "@/store/hooks";
import { Badge } from "@/components/ui/badge";
import { useState, useRef } from "react";

function UserDropdown({ user }: { user: any }) {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-accent transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-label="User menu"
      >
        <UserIcon className="w-6 h-6" />
        <span className="hidden md:inline text-sm font-medium">
          {user?.name || user?.email || "Account"}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-popover border rounded shadow-lg z-50">
          <Link
            href="/account"
            className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
            onClick={() => setOpen(false)}
          >
            <span className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              Account
            </span>
          </Link>
          <button
            className="block w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
          >
            <span className="flex items-center gap-2">
              <LogOutIcon className="w-4 h-4" />
              Logout
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { data: session } = useSession();
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/cart", label: "Cart" },
  ];

  return (
    <header className="w-full border-b bg-background py-4 px-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-foreground">Header</h1>
      {/* Desktop nav */}

      <nav className="hidden md:flex gap-4 items-center">
        {(() => {
          // For hover/focus cart summary
          const [cartOpen, setCartOpen] = useState(false);
          const cartSummaryRef = useRef<HTMLDivElement>(null);
          const cartButtonRef = useRef<HTMLButtonElement>(null);
          const cartItems = useAppSelector((state) => state.cart.items);
          const cartCount = cartItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
            null
          );

          // Handlers to keep summary open on hover/focus
          const handleCartEnter = () => {
            if (leaveTimeoutRef.current) {
              clearTimeout(leaveTimeoutRef.current);
            }
            setCartOpen(true);
          };
          const handleCartLeave = () => {
            leaveTimeoutRef.current = setTimeout(() => {
              setCartOpen(false);
            }, 200);
          };

          return navLinks.map((link) =>
            link.href === "/cart" ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={handleCartEnter}
                onMouseLeave={handleCartLeave}
                onFocus={handleCartEnter}
                onBlur={handleCartLeave}
                tabIndex={-1}
              >
                <Button
                  asChild
                  variant="ghost"
                  className="font-medium relative"
                  ref={cartButtonRef}
                  aria-haspopup="true"
                  aria-expanded={cartOpen}
                >
                  <Link href={link.href} className="flex items-center gap-1">
                    {link.label}
                    <Badge
                      className="ml-1 px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground"
                      variant="secondary"
                    >
                      {cartCount}
                    </Badge>
                  </Link>
                </Button>
                {/* Cart summary on hover/focus */}
                <div
                  ref={cartSummaryRef}
                  className={`absolute right-0 mt-2 w-64 bg-popover border rounded shadow-lg z-50 transition-opacity duration-200 ${
                    cartOpen
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                  tabIndex={-1}
                  onMouseEnter={handleCartEnter}
                  onMouseLeave={handleCartLeave}
                >
                  <div className="p-4">
                    <span className="font-semibold">Cart Summary</span>
                    <div className="text-sm text-muted-foreground mt-2">
                      {cartItems.length === 0 ? (
                        <>No items in cart.</>
                      ) : (
                        <ul className="space-y-1 max-h-32 overflow-y-auto">
                          {cartItems.map((item) => (
                            <li
                              key={item.productId}
                              className="flex justify-between"
                            >
                              <span>{item.name}</span>
                              <span>x{item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <Button asChild variant="default" className="mt-4 w-full">
                      <Link href="/cart">Checkout</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Button
                key={link.href}
                asChild
                variant="ghost"
                className="font-medium"
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            )
          );
        })()}
        <UserDropdown user={session?.user} />
      </nav>
      {/* Mobile nav */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col gap-4 pt-10">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                asChild
                variant="ghost"
                className="justify-start font-medium w-full"
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
            {session ? (
              <div className="flex flex-col gap-2 mt-2">
                <Link
                  href="/account"
                  className="block px-4 py-2 text-sm rounded hover:bg-accent transition-colors"
                >
                  Account
                </Link>
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                  className="font-medium w-full"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button asChild variant="default" className="font-medium w-full">
                <Link href="/login">Sign in</Link>
              </Button>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
