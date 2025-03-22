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
        <footer className="bg-background border-t mt-8">
            <div className="container mx-auto px-4 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
                    {/* Left space to match shop layout */}
                    <div className="hidden lg:block lg:col-span-3">
                        {/* Spacer */}
                    </div>

                    <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-y-12 gap-x-16">
                        {/* Company Info */}
                        <div className="md:col-span-3">
                            {/* Mobile version with button */}
                            <button 
                                onClick={() => toggleSection('company')}
                                className="w-full flex items-center justify-between group mb-4 md:hidden"
                            >
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
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
                            <h3 className="hidden md:block font-semibold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
                                Company
                            </h3>
                            <div className={cn(
                                "overflow-hidden transition-all duration-200 ease-in-out md:overflow-visible md:max-h-none",
                                sectionsState.company ? "max-h-40" : "max-h-0 md:max-h-none"
                            )}>
                                <ul className="space-y-3">
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
                        <div className="md:col-span-3">
                            {/* Mobile version with button */}
                            <button 
                                onClick={() => toggleSection('resources')}
                                className="w-full flex items-center justify-between group mb-4 md:hidden"
                            >
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
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
                            <h3 className="hidden md:block font-semibold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
                                Resources
                            </h3>
                            <div className={cn(
                                "overflow-hidden transition-all duration-200 ease-in-out md:overflow-visible md:max-h-none",
                                sectionsState.resources ? "max-h-40" : "max-h-0 md:max-h-none"
                            )}>
                                <ul className="space-y-3">
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

                        {/* Newsletter - Always collapsible */}
                        <div className="md:col-span-6 flex flex-col items-end">
                            <button 
                                onClick={() => toggleSection('newsletter')}
                                className="flex items-center gap-2 group mb-4"
                            >
                                <h3 className="font-semibold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
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
                                    <p className="text-sm text-muted-foreground">
                                        Subscribe to our newsletter for exclusive offers and updates.
                                    </p>
                                    <form className="space-y-2 mt-4">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full px-3 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Subscribe</Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
                    {/* Left space to match shop layout */}
                    <div className="hidden lg:block lg:col-span-3">
                        {/* Spacer */}
                    </div>
                    <div className="lg:col-span-9 flex flex-col md:flex-row justify-between items-center">
                        <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0">
                            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Blooming Delights. All rights reserved.</p>
                            <div className="flex space-x-4">
                                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</Link>
                                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
                                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookies</Link>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <Button variant="ghost" size="icon" className="hover:bg-accent/50">
                                <Instagram className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-accent/50">
                                <Facebook className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;