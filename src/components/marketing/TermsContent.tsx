"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Scale, 
  ShoppingCart, 
  Truck, 
  RefreshCw, 
  Copyright, 
  Shield, 
  Gavel,
  Mail,
  Clock
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const termsSections = [
  {
    icon: Scale,
    title: "1. Introduction",
    description: "Welcome to Blooming Delights! These Terms and Conditions govern your use of our website and services. By accessing and using our site, you agree to be bound by these terms. Please read them carefully.",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: ShoppingCart,
    title: "2. Use of Our Website",
    description: "Our website is intended for customers who wish to purchase floral arrangements and related products. You agree to use our website responsibly and in accordance with these Terms.",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    icon: Truck,
    title: "3. Orders and Payment",
    description: "All orders placed through our website are subject to product availability and confirmation of the order price. Payment must be made through the available payment methods on our site.",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    icon: RefreshCw,
    title: "4. Shipping and Delivery",
    description: "We take pride in delivering fresh and beautiful floral arrangements. Delivery times may vary depending on your location and the availability of specific products.",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    icon: Copyright,
    title: "5. Intellectual Property",
    description: "All content on this website, including text, graphics, logos, images, and software, is the property of Blooming Delights or its content suppliers.",
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    icon: Shield,
    title: "6. Limitation of Liability",
    description: "Blooming Delights will not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our website or its products.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
];

export default function TermsContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary/5 overflow-hidden">
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
            <Badge variant="secondary" className="mb-4">Legal Information</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms and Conditions</h1>
            <p className="text-xl text-muted-foreground">
              Last updated: March 22, 2024
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Terms Sections */}
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {termsSections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="border-none shadow-lg h-full">
                    <CardContent className="p-6">
                      <div className={`${section.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                        <section.icon className={`w-6 h-6 ${section.color}`} />
                      </div>
                      <h2 className="text-xl font-bold mb-3">{section.title}</h2>
                      <p className="text-muted-foreground">{section.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card p-6 rounded-xl shadow-lg mb-16"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Gavel className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">Governing Law</h2>
                  </div>
                  <p className="text-muted-foreground">
                    These Terms are governed by and construed in accordance with the laws of the jurisdiction in which our business operates. Any disputes will be subject to the exclusive jurisdiction of the appropriate courts.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">Changes to Terms</h2>
                  </div>
                  <p className="text-muted-foreground">
                    We reserve the right to modify these Terms and Conditions at any time. Any changes will be posted on this page and will become effective immediately upon posting.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Contact Information</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <Button variant="outline" asChild className="gap-2">
                <a href="mailto:contact@bloomingdelights.com">
                  contact@bloomingdelights.com
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}