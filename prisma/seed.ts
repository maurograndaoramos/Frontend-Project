// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Helper function to generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Define Season enum to match schema
enum Season {
  SPRING = "SPRING",
  SUMMER = "SUMMER",
  FALL = "FALL",
  WINTER = "WINTER",
  ANY = "ANY"
}

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.collection.deleteMany({});
  await prisma.productType.deleteMany({});

  // Create product types
  const productTypes = [
    { name: "Plant", description: "Live potted plants" },
    { name: "Flower Arrangement", description: "Arranged fresh cut flowers" },
    { name: "Bouquet", description: "Hand-tied flower bouquets" },
  ];

  // Insert product types and store references
  const createdProductTypes = {};
  for (const type of productTypes) {
    const createdType = await prisma.productType.create({ data: type });
    createdProductTypes[type.name] = createdType;
  }

  // Create collections
  const collections = [
    {
      name: "Wedding Collection",
      description: "Beautiful floral arrangements and bouquets perfect for weddings",
      heroImage: "/images/collections/wedding-hero.jpg",
      features: ["Premium quality", "Custom arrangements", "Delivery available"],
      isActive: true,
    },
    {
      name: "Birthday Collection",
      description: "Celebrate birthdays with our vibrant and cheerful flower arrangements",
      heroImage: "/images/collections/birthday-hero.jpg",
      features: ["Show that you care", "Personalized messages", "Perfect for gifting"],
      isActive: true,
    },
    {
      name: "Condolences Collection",
      description: "Express your sympathies with our thoughtful and respectful arrangements",
      heroImage: "/images/collections/condolences-hero.jpg",
      features: ["Elegant designs", "Tasteful arrangements", "Respectful presentation"],
      isActive: true,
    },
    {
      name: "Home Decor Collection",
      description: "Transform your living space with our elegant plants and floral arrangements",
      heroImage: "/images/collections/home-decor-hero.jpg",
      features: ["Interior design favorites", "Air purifying plants", "Low maintenance options"],
      isActive: true,
    },
    {
      name: "Seasonal Collection",
      description: "Celebrate the beauty of each season with our curated seasonal selections",
      heroImage: "/images/collections/seasonal-hero.jpg",
      features: ["Seasonal blooms", "Limited editions", "Nature's finest selections"],
      isActive: true,
    },
  ];

  // Insert collections and store references
  const createdCollections = {};
  for (const collection of collections) {
    const createdCollection = await prisma.collection.create({
      data: {
        ...collection,
        slug: generateSlug(collection.name),
      }
    });
    createdCollections[collection.name] = createdCollection;
  }

  // Create products
  const products = [
    // Plants (3)
    {
      name: "Monstera Deliciosa",
      description: "The Swiss Cheese Plant, known for its distinctive leaf holes and tropical appearance.",
      price: 45.99,
      originalPrice: 59.99,
      images: ["/images/products/monstera-1.jpg", "/images/products/monstera-2.jpg"],
      inStock: true,
      quantity: 25,
      category: "Indoor Plants",
      subcategory: "Tropical",
      tags: ["easy-care", "air-purifying", "tropical"],
      isNew: true,
      isFeatured: true,
      dimensions: { height: "40cm", width: "30cm", depth: "30cm" },
      weight: { value: 3.5, unit: "kg" },
      material: "Ceramic pot",
      care: ["Water weekly", "Indirect light", "Occasional misting"],
      season: [Season.ANY],
      productTypeId: createdProductTypes["Plant"].id,
      collections: {
        connect: [
          { id: createdCollections["Home Decor Collection"].id }
        ]
      }
    },
    {
      name: "Peace Lily",
      description: "Elegant flowering plant with glossy leaves and white blooms. Excellent air purifier.",
      price: 29.99,
      originalPrice: 34.99,
      images: ["/images/products/peace-lily-1.jpg", "/images/products/peace-lily-2.jpg"],
      inStock: true,
      quantity: 18,
      category: "Indoor Plants",
      subcategory: "Flowering",
      tags: ["air-purifying", "low-light", "flowering"],
      isNew: false,
      isFeatured: true,
      dimensions: { height: "35cm", width: "25cm", depth: "25cm" },
      weight: { value: 2.8, unit: "kg" },
      material: "Terracotta pot",
      care: ["Keep soil moist", "Low to medium light", "Avoid direct sunlight"],
      season: [Season.ANY],
      productTypeId: createdProductTypes["Plant"].id,
      collections: {
        connect: [
          { id: createdCollections["Home Decor Collection"].id },
          { id: createdCollections["Condolences Collection"].id }
        ]
      }
    },
    {
      name: "Fiddle Leaf Fig",
      description: "Trendy houseplant with large, violin-shaped leaves that add drama to any space.",
      price: 65.99,
      originalPrice: 79.99,
      images: ["/images/products/fiddle-leaf-1.jpg", "/images/products/fiddle-leaf-2.jpg"],
      inStock: true,
      quantity: 12,
      category: "Indoor Plants",
      subcategory: "Statement",
      tags: ["statement", "trending", "large-leaf"],
      isNew: false,
      isFeatured: true,
      dimensions: { height: "120cm", width: "40cm", depth: "40cm" },
      weight: { value: 8.5, unit: "kg" },
      material: "Decorative planter",
      care: ["Water when top soil is dry", "Bright indirect light", "Rotate occasionally"],
      season: [Season.ANY],
      productTypeId: createdProductTypes["Plant"].id,
      collections: {
        connect: [
          { id: createdCollections["Home Decor Collection"].id }
        ]
      }
    },

    // Flower Arrangements (3)
    {
      name: "Elegant Rose Centerpiece",
      description: "Stunning arrangement of premium roses perfect for special occasions.",
      price: 89.99,
      originalPrice: 105.99,
      images: ["/images/products/rose-centerpiece-1.jpg", "/images/products/rose-centerpiece-2.jpg"],
      inStock: true,
      quantity: 8,
      category: "Flower Arrangements",
      subcategory: "Centerpieces",
      tags: ["roses", "elegant", "centerpiece"],
      isNew: true,
      isFeatured: true,
      dimensions: { height: "30cm", width: "35cm", depth: "35cm" },
      weight: { value: 2.2, unit: "kg" },
      material: "Glass vase",
      care: ["Change water every 2 days", "Keep away from direct sunlight", "Add flower food"],
      season: [Season.SPRING, Season.SUMMER],
      productTypeId: createdProductTypes["Flower Arrangement"].id,
      collections: {
        connect: [
          { id: createdCollections["Wedding Collection"].id },
          { id: createdCollections["Birthday Collection"].id }
        ]
      }
    },
    {
      name: "Rustic Wildflower Mix",
      description: "Charming arrangement of seasonal wildflowers in a rustic container.",
      price: 55.99,
      originalPrice: 65.99,
      images: ["/images/products/wildflower-1.jpg", "/images/products/wildflower-2.jpg"],
      inStock: true,
      quantity: 10,
      category: "Flower Arrangements",
      subcategory: "Rustic",
      tags: ["wildflowers", "rustic", "seasonal"],
      isNew: false,
      isFeatured: false,
      dimensions: { height: "25cm", width: "28cm", depth: "28cm" },
      weight: { value: 1.8, unit: "kg" },
      material: "Wooden box",
      care: ["Change water every 2-3 days", "Trim stems occasionally", "Keep in cool location"],
      season: [Season.SPRING, Season.SUMMER],
      productTypeId: createdProductTypes["Flower Arrangement"].id,
      collections: {
        connect: [
          { id: createdCollections["Home Decor Collection"].id },
          { id: createdCollections["Seasonal Collection"].id }
        ]
      }
    },
    {
      name: "Zen Lily Arrangement",
      description: "Minimalist arrangement featuring calla lilies and ornamental grasses.",
      price: 75.99,
      originalPrice: 89.99,
      images: ["/images/products/zen-lily-1.jpg", "/images/products/zen-lily-2.jpg"],
      inStock: true,
      quantity: 6,
      category: "Flower Arrangements",
      subcategory: "Modern",
      tags: ["minimalist", "calla-lily", "zen"],
      isNew: true,
      isFeatured: false,
      dimensions: { height: "40cm", width: "25cm", depth: "25cm" },
      weight: { value: 2.5, unit: "kg" },
      material: "Ceramic vessel",
      care: ["Change water every 2 days", "Keep away from heat sources", "Mist occasionally"],
      season: [Season.ANY],
      productTypeId: createdProductTypes["Flower Arrangement"].id,
      collections: {
        connect: [
          { id: createdCollections["Condolences Collection"].id },
          { id: createdCollections["Home Decor Collection"].id }
        ]
      }
    },

    // Bouquets (3)
    {
      name: "Classic Rose Bouquet",
      description: "Timeless bouquet of premium long-stemmed roses wrapped in elegant paper.",
      price: 49.99,
      originalPrice: 59.99,
      images: ["/images/products/rose-bouquet-1.jpg", "/images/products/rose-bouquet-2.jpg"],
      inStock: true,
      quantity: 15,
      category: "Bouquets",
      subcategory: "Classic",
      tags: ["roses", "romantic", "classic"],
      isNew: false,
      isFeatured: true,
      dimensions: { height: "50cm", width: "30cm", depth: "30cm" },
      weight: { value: 1.2, unit: "kg" },
      material: "Premium wrapping paper",
      care: ["Trim stems before placing in vase", "Change water daily", "Remove leaves below water line"],
      season: [Season.ANY],
      productTypeId: createdProductTypes["Bouquet"].id,
      collections: {
        connect: [
          { id: createdCollections["Birthday Collection"].id },
          { id: createdCollections["Wedding Collection"].id }
        ]
      }
    },
    {
      name: "Summer Sunshine Bouquet",
      description: "Vibrant bouquet of sunflowers, daisies, and seasonal blooms to brighten any day.",
      price: 42.99,
      originalPrice: 49.99,
      images: ["/images/products/sunshine-bouquet-1.jpg", "/images/products/sunshine-bouquet-2.jpg"],
      inStock: true,
      quantity: 12,
      category: "Bouquets",
      subcategory: "Seasonal",
      tags: ["sunflowers", "bright", "cheerful"],
      isNew: true,
      isFeatured: true,
      dimensions: { height: "45cm", width: "35cm", depth: "35cm" },
      weight: { value: 1.4, unit: "kg" },
      material: "Kraft paper wrap",
      care: ["Place in fresh water immediately", "Keep away from fruit", "Change water every 2 days"],
      season: [Season.SUMMER],
      productTypeId: createdProductTypes["Bouquet"].id,
      collections: {
        connect: [
          { id: createdCollections["Birthday Collection"].id },
          { id: createdCollections["Seasonal Collection"].id }
        ]
      }
    },
    {
      name: "Winter Frost Bouquet",
      description: "Elegant white and silver bouquet featuring seasonal blooms and eucalyptus.",
      price: 58.99,
      originalPrice: 69.99,
      images: ["/images/products/winter-bouquet-1.jpg", "/images/products/winter-bouquet-2.jpg"],
      inStock: true,
      quantity: 8,
      category: "Bouquets",
      subcategory: "Seasonal",
      tags: ["winter", "white", "elegant"],
      isNew: false,
      isFeatured: false,
      dimensions: { height: "45cm", width: "30cm", depth: "30cm" },
      weight: { value: 1.3, unit: "kg" },
      material: "Premium white wrap",
      care: ["Keep in cool location", "Change water every 2 days", "Trim stems at an angle"],
      season: [Season.WINTER],
      productTypeId: createdProductTypes["Bouquet"].id,
      collections: {
        connect: [
          { id: createdCollections["Wedding Collection"].id },
          { id: createdCollections["Seasonal Collection"].id }
        ]
      }
    },
  ];

  // Insert products
  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  console.log(`Database has been seeded with 3 product types, 5 collections, and 9 products!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });