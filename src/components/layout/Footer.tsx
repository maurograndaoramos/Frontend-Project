"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Footer: React.FC = () => {
    const [sectionsState, setSectionsState] = useState({
        company: false,
        resources: false,
        newsletter: false
    });

    const toggleSection = (section: keyof typeof sectionsState) => {
        setSectionsState(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <footer className="bg-primary/5 border-t mt-8">
            <div className="container mx-auto px-4 py-16">
                {/* Main Footer Content */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
                            {/* Company Info */}
                            <div className="min-w-[160px]">
                                {/* Mobile version with button */}
                                <button 
                                    onClick={() => toggleSection('company')}
                                    className="w-full flex items-center justify-between group mb-6 md:hidden"
                                >
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                            Company
                                        </h3>
                                        <ChevronDown 
                                            className={cn(
                                                "h-4 w-4 text-muted-foreground transition-transform",
                                                sectionsState.company && "transform rotate-180"
                                            )} 
                                        />
                                    </div>
                                </button>
                                {/* Desktop version without button */}
                                <h3 className="hidden md:block font-semibold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">
                                    Company
                                </h3>
                                <div className={cn(
                                    "overflow-hidden transition-all duration-200 ease-in-out md:overflow-visible md:max-h-none",
                                    sectionsState.company ? "max-h-40" : "max-h-0 md:max-h-none"
                                )}>
                                    <ul className="space-y-4">
                                        <li>
                                            <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                                                About Us
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                                                Contact
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Resources */}
                            <div className="min-w-[160px]">
                                {/* Mobile version with button */}
                                <button 
                                    onClick={() => toggleSection('resources')}
                                    className="w-full flex items-center justify-between group mb-6 md:hidden"
                                >
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                            Resources
                                        </h3>
                                        <ChevronDown 
                                            className={cn(
                                                "h-4 w-4 text-muted-foreground transition-transform",
                                                sectionsState.resources && "transform rotate-180"
                                            )} 
                                        />
                                    </div>
                                </button>
                                {/* Desktop version without button */}
                                <h3 className="hidden md:block font-semibold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">
                                    Resources
                                </h3>
                                <div className={cn(
                                    "overflow-hidden transition-all duration-200 ease-in-out md:overflow-visible md:max-h-none",
                                    sectionsState.resources ? "max-h-40" : "max-h-0 md:max-h-none"
                                )}>
                                    <ul className="space-y-4">
                                        <li>
                                            <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                                                Blog
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                                                FAQ
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Newsletter - Always collapsible */}
                        <div className="mt-8 md:mt-0 md:max-w-sm w-full">
                            <button 
                                onClick={() => toggleSection('newsletter')}
                                className="flex items-center gap-2 group mb-6 w-full justify-start md:justify-end"
                            >
                                <h3 className="font-semibold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                    Stay Updated
                                </h3>
                                <ChevronDown 
                                    className={cn(
                                        "h-4 w-4 text-muted-foreground transition-transform",
                                        sectionsState.newsletter && "transform rotate-180"
                                    )} 
                                />
                            </button>
                            <div className={cn(
                                "w-full overflow-hidden transition-all duration-200 ease-in-out",
                                sectionsState.newsletter ? "max-h-96" : "max-h-0"
                            )}>
                                <div className="w-full">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Subscribe to our newsletter for exclusive offers and updates.
                                    </p>
                                    <form className="space-y-3">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full px-4 py-2.5 rounded-md border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5">
                                            Subscribe
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-12" />

                {/* Bottom Section */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0">
                            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Blooming Delights. All rights reserved.</p>
                            <div className="flex space-x-6">
                                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</Link>
                                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
                                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookies</Link>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;