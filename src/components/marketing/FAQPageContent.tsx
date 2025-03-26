"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const faqCategories = [
  "General",
  "Products",
  "Delivery",
  "Orders",
  "Care & Maintenance"
];

const faqItems = [
  {
    id: 1,
    question: "What types of flowers do you offer?",
    answer: "We offer a wide variety of fresh flowers including roses, lilies, tulips, daisies, and seasonal selections. Our collection is carefully curated to ensure the highest quality and freshness. Browse our catalog for more details.",
    category: "Products"
  },
  {
    id: 2,
    question: "Do you offer custom arrangements?",
    answer: "Yes! We specialize in bespoke floral arrangements for any occasion. Our expert florists can create unique designs based on your preferences, color scheme, and budget. Contact our customer service to discuss your ideas and preferences.",
    category: "Products"
  },
  {
    id: 3,
    question: "What are your delivery options?",
    answer: "We provide same-day delivery in select areas and standard next-day delivery elsewhere. Delivery times and fees may vary based on your location. We ensure your flowers are delivered in perfect condition with proper packaging and care instructions.",
    category: "Delivery"
  },
  {
    id: 4,
    question: "How can I track my order?",
    answer: "Once your order is shipped, you'll receive an email with tracking details so you can follow its progress. You can also log into your account to view order status and tracking information.",
    category: "Orders"
  },
  {
    id: 5,
    question: "How should I care for my flowers?",
    answer: "Each bouquet comes with detailed care instructions. Generally, you should trim the stems, change the water daily, and keep them away from direct sunlight and heat sources. We recommend using the provided flower food for optimal longevity.",
    category: "Care & Maintenance"
  },
  {
    id: 6,
    question: "What is your return policy?",
    answer: "We offer a 7-day satisfaction guarantee. If you're not completely satisfied with your flowers, please contact our customer service within 7 days of delivery, and we'll make it right.",
    category: "General"
  }
];

export default function FAQPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const filteredItems = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary/5">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full transform rotate-12" />
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full transform -rotate-12" />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers to common questions about our products, services, and policies
            </p>
            <form className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedCategory === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("All")}
              className="transition-all duration-300"
            >
              All Questions
            </Button>
            {faqCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-300"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Accordion
              type="multiple"
              value={openItems}
              onValueChange={setOpenItems}
              className="space-y-4"
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <AccordionItem
                    value={`item-${item.id}`}
                    className="border rounded-lg px-4 bg-card"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <Badge variant="secondary" className="shrink-0">
                          {item.category}
                        </Badge>
                        <span className="font-medium">{item.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>

            {/* No Results */}
            {filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <h3 className="text-xl font-semibold mb-2">No questions found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-8">
              Can't find what you're looking for? Our team is here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button variant="outline" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Email Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}