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
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useCart } from "@/lib/context/CartContext";

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchSheetOpen, setSearchSheetOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const { toggleCart, getCartCount } = useCart();
  const cartCount = getCartCount();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}&page=1`);
      setSearchQuery(""); // Clear the search input after searching
      setSearchSheetOpen(false); // Close the search sheet after searching
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 transition-all duration-300 shadow-sm">
      {/* Mobile menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" aria-label="Menu" className="hover:bg-accent/50 transition-colors duration-200">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <SheetTitle>Navigation Menu</SheetTitle>
          <nav className="flex flex-col space-y-6 mt-8">
            <Link 
              href="/" 
              className="hover:text-primary transition-colors text-lg font-medium hover:translate-x-1 duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className="hover:text-primary transition-colors text-lg font-medium hover:translate-x-1 duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              href="/collections" 
              className="hover:text-primary transition-colors text-lg font-medium hover:translate-x-1 duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Collections
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Logo */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center group">
          <div className="w-10 h-10 rounded-full bg-accent/50 flex items-center justify-center p-1 mr-2">
            <Image
              src="/flower-shop-logo.svg"
              alt="Brand Logo"
              width={32}
              height={32}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span className="text-xl font-bold hidden sm:inline bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent transition-opacity duration-200 group-hover:opacity-80">Blooming Delights</span>
        </Link>
      </div>

      {/* Navigation Links - Desktop */}
      <nav className="hidden md:flex space-x-8 ml-8">
        <Link href="/" className="hover:text-primary transition-all duration-200 font-medium hover:translate-y-[-1px]">
          Home
        </Link>
        <Link href="/shop" className="hover:text-primary transition-all duration-200 font-medium hover:translate-y-[-1px]">
          Shop
        </Link>
        <Link href="/collections" className="hover:text-primary transition-all duration-200 font-medium hover:translate-y-[-1px]">
          Collections
        </Link>
      </nav>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center justify-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Input
            type="search"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full hover:bg-accent/50 transition-colors duration-200"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Cart and Auth */}
      <div className="flex items-center space-x-4">
        {/* Mobile Search */}
        <Sheet open={searchSheetOpen} onOpenChange={setSearchSheetOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Search" className="hover:bg-accent/50 transition-colors duration-200">
              <Search className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top">
            <SheetTitle>Search Products</SheetTitle>
            <form onSubmit={handleSearch} className="mt-6">
              <Input
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-2 focus:ring-2 focus:ring-primary/20 transition-all duration-200 hover:border-primary/50"
              />
              <Button type="submit" className="w-full">Search</Button>
            </form>
          </SheetContent>
        </Sheet>

        {/* Shopping Cart */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Shopping Cart"
          onClick={() => toggleCart(true)}
          className="relative hover:bg-accent/50 transition-all duration-200 hover:scale-105"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center animate-in fade-in-0 zoom-in-95 shadow-sm">
              {cartCount}
            </span>
          )}
        </Button>

        {isLoading ? (
          <Button variant="ghost" size="icon" disabled>
            <Loader2 className="h-5 w-5 animate-spin" />
          </Button>
        ) : session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative hover:bg-accent/50 transition-all duration-200 hover:scale-105">
                <User className="h-5 w-5 mr-2" />
                <span className="hidden md:inline">{session.user.name || "Account"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-medium">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent/50 transition-colors duration-200">
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent/50 transition-colors duration-200">
                <Link href={`/dashboard/${session.user.name?.toLowerCase().replace(/\s+/g, '-') || 'profile'}/profile`}>
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent/50 transition-colors duration-200">
                <Link href={`/dashboard/${session.user.name?.toLowerCase().replace(/\s+/g, '-') || 'orders'}/orders`}>
                  Orders
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent/50 transition-colors duration-200">
                <Link href={`/dashboard/${session.user.name?.toLowerCase().replace(/\s+/g, '-') || 'wishlist'}/wishlist`}>
                  Wishlist
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10 transition-colors duration-200">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link href="/login" legacyBehavior>
              <Button variant="outline" size="sm" className="hover:bg-accent/50 transition-all duration-200">Sign in</Button>
            </Link>
            <Link href="/register" legacyBehavior>
              <Button size="sm" className="bg-primary hover:bg-primary/90 transition-all duration-200">Sign up</Button>
            </Link>
          </div>
        )}

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Mobile Auth Menu */}
        {!session?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="sm:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-accent/50 transition-colors duration-200">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent/50 transition-colors duration-200">
                <Link href="/login">Sign in</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer hover:bg-accent/50 transition-colors duration-200">
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