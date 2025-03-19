"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Page titles mapping
const pageTitles: Record<string, string> = {
  "/about": "About Us",
  "/contact": "Contact Us",
  "/blog": "Our Blog",
  "/faq": "Frequently Asked Questions",
  "/terms": "Terms of Service",
  "/privacy": "Privacy Policy",
  "/cookies": "Cookie Policy"
};

// Related links based on current page
const relatedLinks: Record<string, Array<{ title: string; href: string }>> = {
  "/about": [
    { title: "Contact Us", href: "/contact" },
    { title: "Our Blog", href: "/blog" },
    { title: "FAQ", href: "/faq" }
  ],
  "/contact": [
    { title: "About Us", href: "/about" },
    { title: "FAQ", href: "/faq" }
  ],
  "/blog": [
    { title: "About Us", href: "/about" },
    { title: "Contact Us", href: "/contact" }
  ],
  "/faq": [
    { title: "Contact Us", href: "/contact" },
    { title: "Terms of Service", href: "/terms" }
  ],
  "/terms": [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Cookie Policy", href: "/cookies" }
  ],
  "/privacy": [
    { title: "Terms of Service", href: "/terms" },
    { title: "Cookie Policy", href: "/cookies" }
  ],
  "/cookies": [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" }
  ]
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // Get the current page title from the pathname
  const currentPageTitle = pageTitles[pathname] || "Information";
  
  // Get related links for the current page
  const currentRelatedLinks = relatedLinks[pathname] || [];
  
  // Determine if it's a company or legal page for proper styling
  const isLegalPage = ["/terms", "/privacy", "/cookies"].includes(pathname);
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center text-sm mb-6 text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="font-medium text-foreground">{currentPageTitle}</span>
      </nav>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <main className="lg:col-span-3">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">{currentPageTitle}</h1>
            <p className="text-muted-foreground mt-2">
              {isLegalPage 
                ? "Last updated: February 10, 2025" 
                : "Learn more about Blooming Delights and our mission to bring beautiful flowers to your life."}
            </p>
          </div>
          
          {/* Children content */}
          <div className={isLegalPage ? "text-sm leading-relaxed" : ""}>
            {children}
          </div>
          
          {/* Call to action section */}
          {!isLegalPage && (
            <div className="mt-12 bg-muted/50 rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Ready to explore our collection?</h2>
              <p className="text-muted-foreground mb-4">
                Discover fresh floral arrangements that bring natural beauty and fragrance to your home.
              </p>
              <Button asChild>
                <Link href="/shop">Shop Our Collection</Link>
              </Button>
            </div>
          )}
        </main>
        
        {/* Sidebar */}
        <aside className="space-y-6 lg:space-y-8">
          {/* Related links */}
          {currentRelatedLinks.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Related Pages</h3>
                <ul className="space-y-3">
                  {currentRelatedLinks.map((link) => (
                    <li key={link.href}>
                      <Link 
                        href={link.href} 
                        className="flex items-center text-sm text-primary hover:underline"
                      >
                        <ChevronRight className="h-3 w-3 mr-1" />
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          
          {/* Contact card */}
          {!pathname.includes("/contact") && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Get in Touch</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Have questions or need assistance? Our team is here to help.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Newsletter signup or social links */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-2">Follow Us</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Stay updated with our latest products and promotions.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                Instagram
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Facebook
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}