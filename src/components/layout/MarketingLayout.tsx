"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  Instagram, 
  Facebook, 
  Twitter, 
  Mail, 
  Bell,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
const relatedLinks: Record<string, Array<{ title: string; href: string; description: string }>> = {
  "/about": [
    { 
      title: "Contact Us", 
      href: "/contact",
      description: "Get in touch with our team"
    },
    { 
      title: "Our Blog", 
      href: "/blog",
      description: "Read our latest articles"
    },
    { 
      title: "FAQ", 
      href: "/faq",
      description: "Find answers to common questions"
    }
  ],
  "/contact": [
    { 
      title: "About Us", 
      href: "/about",
      description: "Learn more about our story"
    },
    { 
      title: "FAQ", 
      href: "/faq",
      description: "Find answers to common questions"
    }
  ],
  "/blog": [
    { 
      title: "About Us", 
      href: "/about",
      description: "Learn more about our story"
    },
    { 
      title: "Contact Us", 
      href: "/contact",
      description: "Get in touch with our team"
    }
  ],
  "/faq": [
    { 
      title: "Contact Us", 
      href: "/contact",
      description: "Get in touch with our team"
    },
    { 
      title: "Terms of Service", 
      href: "/terms",
      description: "Read our terms and conditions"
    }
  ],
  "/terms": [
    { 
      title: "Privacy Policy", 
      href: "/privacy",
      description: "Learn about our privacy practices"
    },
    { 
      title: "Cookie Policy", 
      href: "/cookies",
      description: "Understand our cookie usage"
    }
  ],
  "/privacy": [
    { 
      title: "Terms of Service", 
      href: "/terms",
      description: "Read our terms and conditions"
    },
    { 
      title: "Cookie Policy", 
      href: "/cookies",
      description: "Understand our cookie usage"
    }
  ],
  "/cookies": [
    { 
      title: "Privacy Policy", 
      href: "/privacy",
      description: "Learn about our privacy practices"
    },
    { 
      title: "Terms of Service", 
      href: "/terms",
      description: "Read our terms and conditions"
    }
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
    <div className="min-h-screen bg-background">
      {/* Breadcrumb navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-4"
      >
        <div className="flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
          <span className="font-medium text-foreground">{currentPageTitle}</span>
        </div>
      </motion.nav>
      
      {/* Main content grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <main className="lg:col-span-3">
            {/* Page header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {currentPageTitle}
              </h1>
              <p className="text-muted-foreground mt-4 text-lg">
                {isLegalPage 
                  ? "Last updated: February 10, 2025" 
                  : "Learn more about Blooming Delights and our mission to bring beautiful flowers to your life."}
              </p>
            </div>
            
            {/* Children content */}
            <div className={`prose prose-lg dark:prose-invert max-w-none ${isLegalPage ? "text-sm leading-relaxed" : ""}`}>
              {children}
            </div>
            
            {/* Call to action section */}
            {!isLegalPage && (
              <div className="mt-16 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-semibold mb-4">Ready to explore our collection?</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Discover fresh floral arrangements that bring natural beauty and fragrance to your home.
                </p>
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/shop">Shop Our Collection</Link>
                </Button>
              </div>
            )}
          </main>
          
          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Related links */}
            {currentRelatedLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-primary/10">
                  <CardContent className="pt-6">
                    <Badge variant="secondary" className="mb-4">Related Pages</Badge>
                    <ul className="space-y-4">
                      {currentRelatedLinks.map((link) => (
                        <li key={link.href}>
                          <Link 
                            href={link.href} 
                            className="group block p-4 rounded-lg hover:bg-primary/5 transition-colors"
                          >
                            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                              {link.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {link.description}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            {/* Contact card */}
            {!pathname.includes("/contact") && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border-primary/10">
                  <CardContent className="pt-6">
                    <Badge variant="secondary" className="mb-4">Get in Touch</Badge>
                    <p className="text-sm text-muted-foreground mb-6">
                      Have questions or need assistance? Our team is here to help.
                    </p>
                    <Button variant="outline" className="w-full hover:bg-accent/50" asChild>
                      <Link href="/contact" className="flex items-center justify-center gap-2">
                        Contact Us
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            {/* Newsletter signup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6"
            >
              <Badge variant="secondary" className="mb-4">Stay Updated</Badge>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to our newsletter for exclusive offers and updates.
              </p>
              <form className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-background/50 focus:ring-2 focus:ring-primary/20"
                />
                <Button className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center gap-2">
                  <Bell className="w-4 h-4" />
                  Subscribe
                </Button>
              </form>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6"
            >
              <Badge variant="secondary" className="mb-4">Follow Us</Badge>
              <div className="flex space-x-3">
                <Button variant="outline" size="icon" className="hover:bg-accent/50">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="hover:bg-accent/50">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="hover:bg-accent/50">
                  <Twitter className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}