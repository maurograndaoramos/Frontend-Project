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
                  Founded in 1990, Blooming Delights began as a small flower shop in the Algarve with a mission to create beautiful, 
                  memorable floral arrangements that bring joy to every occasion.
                </p>
                <p>
                  Our founder, Maria Flores, discovered her passion for floral design while growing up surrounded by the 
                  vibrant flora of the Algarve region, where she learned traditional Portuguese techniques passed down through 
                  generations.
                </p>
                <p>
                  Today, our shop has grown into a team of skilled florists dedicated to creating stunning 
                  arrangements and delivering them across the entire Algarve region.
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
                  src="/images/about/about-1.jpg"
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

      {/* Map Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">Our Location</Badge>
            <h2 className="text-3xl font-bold">Serving the Algarve Since 1990</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
              We deliver beautiful flower arrangements to all areas across the Algarve region.
            </p>
          </motion.div>
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://maps.googleapis.com/maps/api/staticmap?center=Algarve,Portugal&zoom=9&size=1200x600&maptype=roadmap&path=color:0xDA0A0A66|weight:3|fillcolor:0xDA0A0A33|37.3406,-8.8034|37.1880,-8.5961|37.1377,-8.4515|37.1006,-8.2711|37.0135,-7.9347|37.1258,-7.6494|37.1983,-7.3992|37.4174,-7.5275|37.3508,-7.9825|37.3041,-8.1001|37.3053,-8.5527|37.3175,-8.8034&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8" 
              alt="Map of Algarve region" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>
    </div>
  );
}