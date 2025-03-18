"use client"

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Search, ShoppingCart, Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between border-b">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" aria-label="Menu">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <nav className="flex flex-col space-y-4 mt-8">
            <Link href="/" className="hover:text-gray-600 transition-colors text-lg">
              Home
            </Link>
            <Link href="/shop" className="hover:text-gray-600 transition-colors text-lg">
              Shop
            </Link>
            <Link href="/shop/featured" className="hover:text-gray-600 transition-colors text-lg">
              Featured
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Logo */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/vercel.svg"
            alt="Brand Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="text-xl font-bold hidden sm:inline">Mrs. Pots</span>
        </Link>
      </div>

      {/* Navigation Links - Desktop */}
      <nav className="hidden md:flex space-x-6 ml-8">
        <Link href="/" className="hover:text-gray-600 transition-colors">
          Home
        </Link>
        <Link href="/shop" className="hover:text-gray-600 transition-colors">
          Shop
        </Link>
        <Link href="/shop/featured" className="hover:text-gray-600 transition-colors">
          Featured
        </Link>
      </nav>

      {/* Search Bar */}
      <div className="hidden md:flex items-center justify-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                router.push(`/shop/search?q=${encodeURIComponent(searchQuery)}`);
              }
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            aria-label="Search"
            onClick={() =>
              router.push(`/shop/search?q=${encodeURIComponent(searchQuery)}`)
            }
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Cart and Auth */}
      <div className="flex items-center space-x-2">
        {/* Mobile Search */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search />
            </Button>
          </SheetTrigger>
          <SheetContent side="top">
            <div className="mt-6">
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-2"
              />
              <Button className="w-full">Search</Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Shopping Cart */}
        <Button variant="ghost" size="icon" aria-label="Shopping Cart">
          <ShoppingCart />
        </Button>

        {isLoading ? (
          // Show loading state
          <Button variant="ghost" size="icon" disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
          </Button>
        ) : session?.user ? (
          // Authenticated: show user dropdown
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">{session.user.name || "Account"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${session.user.name?.toLowerCase().replace(/\s+/g, '-') || 'profile'}/profile`}>
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${session.user.name?.toLowerCase().replace(/\s+/g, '-') || 'orders'}/orders`}>
                  Orders
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${session.user.name?.toLowerCase().replace(/\s+/g, '-') || 'wishlist'}/wishlist`}>
                  Wishlist
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          // Not authenticated: show login/signup buttons
          <div className="hidden sm:flex sm:items-center sm:space-x-2">
            <Link href="/login" legacyBehavior>
              <Button variant="outline" size="sm">Sign in</Button>
            </Link>
            <Link href="/register" legacyBehavior>
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        )}

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Mobile Auth Menu */}
        {!session?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="sm:hidden">
              <Button variant="ghost" size="icon">
                <User />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/login">Sign in</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/register">Sign up</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Navbar;