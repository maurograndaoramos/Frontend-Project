"use client";

import HeroSection from "./marketing-components/HeroSection";
import FeaturedProductsCarousel from "./marketing-components/FeaturedProductsCarousel";
import CategoriesShowcase from "./marketing-components/CategoriesShowcase";
import NewsletterSignup from "./marketing-components/NewsletterSignup";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProductsCarousel />
      <CategoriesShowcase />
      <NewsletterSignup />
    </>
  );
}