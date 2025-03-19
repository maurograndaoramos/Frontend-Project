"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Story</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          From humble beginnings to a thriving floral studio, 
          we've built Blooming Delights on creativity, passion, and community.
        </p>
      </div>

      {/* Company history section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
          <p className="mb-4">
            Founded in 2015, Blooming Delights began as a small flower shop with a mission to create beautiful, 
            memorable floral arrangements that bring joy to every occasion.
          </p>
          <p className="mb-4">
            Our founder, Eleanor Bloom, discovered her passion for floral design while traveling through rural 
            villages in the Netherlands, where she was captivated by the traditional techniques passed down through 
            generations of artisans.
          </p>
          <p>
            Today, our studio has grown into a team of skilled florists dedicated to creating stunning 
            arrangements using both traditional methods and contemporary designs.
          </p>
        </div>
        <div className="rounded-lg overflow-hidden">
          <Image 
            src="/api/placeholder/600/400" 
            alt="Our flower studio" 
            width={600} 
            height={400}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Values section */}
      <div className="py-16 bg-muted/20 rounded-xl px-8 mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m7 10 3.5 3.5 7-7"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Quality Freshness</h3>
            <p className="text-muted-foreground">
              We take pride in the quality of our flowers, ensuring each arrangement meets our high standards.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path><line x1="18" x2="12" y1="9" y2="15"></line><line x1="12" x2="18" y1="9" y2="15"></line></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Sustainability</h3>
            <p className="text-muted-foreground">
              We source flowers responsibly and work to minimize waste in our design process.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p className="text-muted-foreground">
              We believe in building connections through our craft and supporting other local businesses.
            </p>
          </div>
        </div>
      </div>

      {/* Team section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Eleanor Bloom", role: "Founder & Lead Florist", image: "/api/placeholder/300/300" },
            { name: "Michael Rivera", role: "Master Florist", image: "/api/placeholder/300/300" },
            { name: "Sophia Chen", role: "Design Director", image: "/api/placeholder/300/300" },
          ].map((member, index) => (
            <div key={index} className="text-center">
              <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  width={160} 
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA section */}
      <div className="text-center mb-12">
        <Separator className="mb-12" />
        <h2 className="text-3xl font-bold mb-4">Visit Our Shop</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Explore our collection of beautiful flowers and find the perfect arrangement for any occasion.
        </p>
        <Button size="lg" asChild>
          <Link href="/shop">Browse Collection</Link>
        </Button>
      </div>
    </div>
  );
}