// src/components/marketing/TestimonialsSection.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: "1",
    content: "The craftsmanship of these ceramic pieces is exceptional. Each item I've purchased has become a cherished part of my home.",
    author: {
      name: "Sarah Johnson",
      role: "Interior Designer",
      avatar: "/api/placeholder/40/40",
    },
  },
  {
    id: "2",
    content: "I purchased a set of dinner plates and bowls for my new apartment, and they've received so many compliments. The quality is outstanding.",
    author: {
      name: "Michael Chen",
      role: "Food Blogger",
      avatar: "/api/placeholder/40/40",
    },
  },
  {
    id: "3",
    content: "Mrs. Pots delivers not just beautiful pieces, but excellent customer service. My order arrived safely packaged and exactly as described.",
    author: {
      name: "Emily Rodriguez",
      role: "Loyal Customer",
      avatar: "/api/placeholder/40/40",
    },
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">What Our Customers Say</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          We take pride in creating beautiful, functional pottery that brings joy to our customers' lives.
        </p>

        <Tabs defaultValue="1" className="w-full max-w-3xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            {testimonials.map((testimonial) => (
              <TabsTrigger key={testimonial.id} value={testimonial.id}>
                {testimonial.author.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {testimonials.map((testimonial) => (
            <TabsContent key={testimonial.id} value={testimonial.id}>
              <Card>
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-primary/40 mb-4" />
                  <p className="text-lg italic mb-6">{testimonial.content}</p>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={testimonial.author.avatar} alt={testimonial.author.name} />
                      <AvatarFallback>{testimonial.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.author.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.author.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}