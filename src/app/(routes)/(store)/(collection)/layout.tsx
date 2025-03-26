import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollectionLayoutProps {
  children: ReactNode;
}

export default function CollectionLayout({
  children,
}: CollectionLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center space-x-2 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center">
              <Home className="h-4 w-4 mr-1" />
              <span>Home</span>
            </Link>
          </Button>
          <span className="text-muted-foreground">/</span>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/collections" className="flex items-center">
              <span>Collections</span>
            </Link>
          </Button>
        </div>
      </div>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 