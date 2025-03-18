// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.review.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});

  // Create products
const products = [
    {
        name: "Elegant Flower Arrangement",
        description:
            "A beautiful arrangement featuring a mix of roses, daisies, and orchids — perfect for brightening up any space.",
        price: 45.99,
        originalPrice: 59.99,
        images: [
            "/images/products/flower-arrangement-1.jpg",
            "/images/products/flower-arrangement-1-alt.jpg",
        ],
        inStock: true,
        quantity: 15,
        category: "Floral",
        subcategory: "Mixed Arrangements",
        tags: ["floral", "arrangement", "elegant"],
        isNew: true,
        isFeatured: true,
        dimensions: { height: 12, width: 10, depth: 10, unit: "in" },
        weight: { value: 3.0, unit: "lb" },
        material: "Fresh Flowers",
        care: ["Keep in water", "Place in a cool spot"],
    },
    {
        name: "Orchid Bouquet",
        description:
            "A sophisticated bouquet of exotic orchids arranged with finesse to create a stunning centerpiece.",
        price: 59.99,
        originalPrice: 79.99,
        images: [
            "/images/products/orchid-bouquet-1.jpg",
            "/images/products/orchid-bouquet-1-alt.jpg",
        ],
        inStock: true,
        quantity: 25,
        category: "Floral",
        subcategory: "Orchids",
        tags: ["orchids", "bouquet", "exotic"],
        isNew: false,
        isFeatured: true,
        dimensions: { height: 14, width: 12, depth: 12, unit: "in" },
        weight: { value: 2.5, unit: "lb" },
        material: "Fresh Orchids",
        care: ["Mist regularly", "Indirect sunlight"],
    },
    {
        name: "Rose Bouquet",
        description:
            "A classic bouquet of fresh roses, expertly arranged to convey emotions of love and admiration.",
        price: 39.99,
        originalPrice: 49.99,
        images: [
            "/images/products/rose-bouquet-1.jpg",
            "/images/products/rose-bouquet-1-alt.jpg",
        ],
        inStock: true,
        quantity: 30,
        category: "Floral",
        subcategory: "Roses",
        tags: ["roses", "bouquet", "classic"],
        isNew: true,
        isFeatured: false,
        dimensions: { height: 10, width: 8, depth: 8, unit: "in" },
        weight: { value: 2.0, unit: "lb" },
        material: "Fresh Roses",
        care: ["Change water daily", "Trim stems"],
    },
    {
        name: "Daisy Delight Arrangement",
        description:
            "A cheerful arrangement featuring daisies and other seasonal blooms, perfect for adding a touch of joy.",
        price: 24.99,
        originalPrice: 34.99,
        images: [
            "/images/products/daisy-arrangement-1.jpg",
            "/images/products/daisy-arrangement-1-alt.jpg",
        ],
        inStock: true,
        quantity: 40,
        category: "Floral",
        subcategory: "Daisies",
        tags: ["daisies", "floral", "cheerful"],
        isNew: false,
        isFeatured: true,
        dimensions: { height: 8, width: 7, depth: 7, unit: "in" },
        weight: { value: 1.5, unit: "lb" },
        material: "Fresh Daisies",
        care: ["Keep watered", "Avoid direct sun"],
    },
    {
        name: "Mixed Seasonal Floral Basket",
        description:
            "A vibrant assortment of seasonal flowers arranged in a decorative basket, ideal for any celebration.",
        price: 49.99,
        originalPrice: 64.99,
        images: [
            "/images/products/floral-basket-1.jpg",
            "/images/products/floral-basket-1-alt.jpg",
        ],
        inStock: true,
        quantity: 20,
        category: "Floral",
        subcategory: "Mixed Arrangements",
        tags: ["mixed", "seasonal", "floral"],
        isNew: true,
        isFeatured: false,
        dimensions: { height: 15, width: 12, depth: 12, unit: "in" },
        weight: { value: 3.5, unit: "lb" },
        material: "Mixed Fresh Flowers",
        care: ["Replace water daily", "Keep in a cool environment"],
    },
    {
        name: "Deluxe Wedding Floral Decor",
        description:
            "A luxurious floral decor set designed for weddings, featuring a curated selection of roses, orchids, and lilies.",
        price: 89.99,
        originalPrice: 109.99,
        images: [
            "/images/products/wedding-floral-1.jpg",
            "/images/products/wedding-floral-1-alt.jpg",
        ],
        inStock: true,
        quantity: 10,
        category: "Floral",
        subcategory: "Wedding Arrangements",
        tags: ["wedding", "floral", "luxury"],
        isNew: false,
        isFeatured: true,
        dimensions: { height: 20, width: 18, depth: 18, unit: "in" },
        weight: { value: 4.0, unit: "lb" },
        material: "Fresh Flowers",
        care: ["Professional care recommended", "Keep hydrated"],
    },
];

  // Insert products
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`Database has been seeded with ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });