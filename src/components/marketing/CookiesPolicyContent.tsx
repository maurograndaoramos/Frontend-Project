"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  Cookie, 
  Settings, 
  BarChart, 
  ShoppingCart, 
  ExternalLink,
  CheckCircle2,
  XCircle
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const cookieTypes = [
  {
    icon: Shield,
    title: "Essential Cookies",
    description: "These cookies are necessary for the website to function and cannot be switched off in our systems.",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: BarChart,
    title: "Performance and Analytics",
    description: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    icon: ShoppingCart,
    title: "Advertising Cookies",
    description: "These cookies may be set by our advertising partners to build a profile of your interests and show you relevant adverts on other sites.",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
];

export default function CookiePolicyContent() {
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
            <Badge variant="secondary" className="mb-4">Privacy & Security</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Cookie Policy</h1>
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
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold mb-6">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                This Cookie Policy explains how Blooming Delights ("we", "us", and "our") uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
              </p>
            </motion.div>

            {/* What are cookies? */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Cookie className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">What are cookies?</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
              </p>
            </motion.div>

            {/* Cookie Types */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold mb-6">How do we use cookies?</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We use cookies for a variety of reasons as outlined below. In most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this website.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {cookieTypes.map((type, index) => (
                  <Card key={index} className="border-none shadow-lg">
                    <CardContent className="p-6">
                      <div className={`${type.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                        <type.icon className={`w-6 h-6 ${type.color}`} />
                      </div>
                      <h3 className="font-semibold mb-2">{type.title}</h3>
                      <p className="text-muted-foreground text-sm">{type.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Cookie Choices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Your Choices Regarding Cookies</h2>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-lg">
                <div className="flex items-start gap-4 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Accept Cookies</h3>
                    <p className="text-muted-foreground">
                      By accepting cookies, you'll get the best experience on our website with all features enabled.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <XCircle className="w-6 h-6 text-red-500 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Reject Cookies</h3>
                    <p className="text-muted-foreground">
                      You can adjust your browser settings to reject cookies, but this may affect the functionality of our website.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* More Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-4">More Information</h2>
              <p className="text-muted-foreground mb-4">
                For further details on cookies and how to manage them, please visit our recommended resource:
              </p>
              <Button variant="outline" asChild className="gap-2">
                <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">
                  www.allaboutcookies.org
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}