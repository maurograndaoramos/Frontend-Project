import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailContent from "@/components/shop/ProductDetailContent";

interface PageProps {
  params: Promise<{ identifier: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  // Await the params object
  const { identifier } = await params;

  // First try to find the product by slug
  let product = await prisma.product.findFirst({
    where: {
      OR: [
        { slug: identifier },
        { id: identifier }
      ]
    }
  });

  if (!product) {
    return redirect('/404');
  }

  // If we found the product by ID but it has a slug, redirect to the slug URL
  if (product.slug && identifier !== product.slug) {
    return redirect(`/shop/product/${product.slug}`);
  }

  return <ProductDetailContent />;
} 