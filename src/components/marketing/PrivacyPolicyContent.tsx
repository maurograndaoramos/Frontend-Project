"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  Database, 
  Settings, 
  Lock, 
  RefreshCw, 
  Mail,
  Eye,
  Bell,
  Share2
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const privacySections = [
  {
    icon: Database,
    title: "Information We Collect",
    description: "We may collect personal data such as your name, email address, and usage data when you interact with our website. This includes information you provide directly and data collected through cookies and similar technologies.",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: Settings,
    title: "How We Use Your Information",
    description: "The collected information is used to improve your browsing experience, personalize content, and for internal analytics. We do not share your data with third parties without your consent unless required by law.",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    icon: Lock,
    title: "Data Security",
    description: "We implement robust security measures to ensure your data is protected. However, no method of transmission over the internet is completely secure. We regularly review and update our security practices.",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    icon: Eye,
    title: "Your Rights",
    description: "You have the right to access, correct, or delete your personal information. You can also opt-out of marketing communications and request a copy of your data at any time.",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    icon: Bell,
    title: "Marketing Communications",
    description: "We may send you marketing communications if you've opted in. You can unsubscribe at any time by clicking the unsubscribe link in our emails or contacting us directly.",
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    icon: Share2,
    title: "Data Sharing",
    description: "We may share your data with trusted service providers who assist in operating our website and conducting our business. These partners are bound by confidentiality obligations.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
];

export default function PrivacyPolicyContent() {
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
            <Badge variant="secondary" className="mb-4">Data Protection</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
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
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Your Privacy Matters</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Your privacy is important to us. This Privacy Policy explains how we collect, use, and safeguard your personal information. We are committed to protecting your privacy and ensuring the security of your data.
              </p>
            </motion.div>

            {/* Privacy Sections */}
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {privacySections.map((section, index) => (
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
                      <RefreshCw className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">Policy Updates</h2>
                  </div>
                  <p className="text-muted-foreground">
                    We may update our Privacy Policy periodically. Any changes will be posted on this page, and the updated policy will be effective immediately upon posting. We encourage you to review this policy regularly.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">Data Protection</h2>
                  </div>
                  <p className="text-muted-foreground">
                    We implement industry-standard security measures to protect your data. This includes encryption, secure servers, and regular security assessments to ensure your information remains safe.
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
                <h2 className="text-xl font-bold">Contact Us</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                If you have any questions or concerns about our Privacy Policy, please contact our Data Protection Officer:
              </p>
              <Button variant="outline" asChild className="gap-2">
                <a href="mailto:privacy@bloomingdelights.com">
                  privacy@bloomingdelights.com
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}