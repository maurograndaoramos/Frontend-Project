"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, Leaf, Users, Flower2, Instagram, Facebook, Twitter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
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
            <Badge variant="secondary" className="mb-4">Our Story</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Blooming Delights</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From humble beginnings to a thriving floral studio, 
              we've built Blooming Delights on creativity, passion, and community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company history section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Journey</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2015, Blooming Delights began as a small flower shop with a mission to create beautiful, 
                  memorable floral arrangements that bring joy to every occasion.
                </p>
                <p>
                  Our founder, Eleanor Bloom, discovered her passion for floral design while traveling through rural 
                  villages in the Netherlands, where she was captivated by the traditional techniques passed down through 
                  generations of artisans.
                </p>
                <p>
                  Today, our studio has grown into a team of skilled florists dedicated to creating stunning 
                  arrangements using both traditional methods and contemporary designs.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-lg overflow-hidden shadow-xl">
                <Image 
                  src="/api/placeholder/600/400" 
                  alt="Our flower studio" 
                  width={600} 
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary p-4 rounded-lg shadow-lg">
                <Flower2 className="w-8 h-8 text-primary-foreground" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">Our Values</Badge>
            <h2 className="text-3xl font-bold">What We Stand For</h2>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Heart,
                title: "Quality Freshness",
                description: "We take pride in the quality of our flowers, ensuring each arrangement meets our high standards."
              },
              {
                icon: Leaf,
                title: "Sustainability",
                description: "We source flowers responsibly and work to minimize waste in our design process."
              },
              {
                icon: Users,
                title: "Community",
                description: "We believe in building connections through our craft and supporting other local businesses."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">Our Team</Badge>
            <h2 className="text-3xl font-bold">Meet the People Behind the Blooms</h2>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { name: "Eleanor Bloom", role: "Founder & Lead Florist", image: "/api/placeholder/300/300" },
              { name: "Michael Rivera", role: "Master Florist", image: "/api/placeholder/300/300" },
              { name: "Sophia Chen", role: "Design Director", image: "/api/placeholder/300/300" },
            ].map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative"
              >
                <div className="relative rounded-xl overflow-hidden mb-6">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    width={300} 
                    height={300}
                    className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-muted-foreground mb-4">{member.role}</p>
                <div className="flex gap-4 justify-center">
                  <Button variant="ghost" size="icon">
                    <Instagram className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Twitter className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge variant="secondary" className="mb-4">Visit Us</Badge>
            <h2 className="text-3xl font-bold mb-6">Explore Our Collection</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Discover our handcrafted arrangements and find the perfect blooms for your special moments.
            </p>
            <Button size="lg" asChild className="gap-2">
              <Link href="/shop">
                Browse Collection
                <Flower2 className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}