"use client";

import FeaturedProductPageContent from "@/components/shop/FeaturedCollectionsContent"

export default function FeaturedPage() {
    return <FeaturedProductPageContent />
}

// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { ShoppingCart, TrendingUp } from "lucide-react";

// // Featured collections
// const collections = [
//   {
//     id: "spring-collection",
//     name: "Spring Collection",
//     description: "Embrace the season with our vibrant new pottery designs",
//     image: "/api/placeholder/600/400",
//     badge: "New Season",
//   },
//   {
//     id: "dining-essentials",
//     name: "Dining Essentials",
//     description: "Elevate your dining experience with our premium tableware",
//     image: "/api/placeholder/600/400",
//     badge: "Best Sellers",
//   },
//   {
//     id: "artisan-collection",
//     name: "Artisan Collection",
//     description: "Handcrafted pieces from our master pottery artists",
//     image: "/api/placeholder/600/400",
//     badge: "Limited Edition",
//   },
// ];

// // Featured products
// const featuredProducts = [
//   {
//     id: "1",
//     name: "Handcrafted Ceramic Vase",
//     price: 45.99,
//     originalPrice: 59.99,
//     image: "/api/placeholder/400/500",
//     badge: "Best Seller",
//   },
//   {
//     id: "4",
//     name: "Ceramic Dinner Plates (Set of 6)",
//     price: 85.00,
//     originalPrice: null,
//     image: "/api/placeholder/400/500",
//     badge: "New Arrival",
//   },
//   {
//     id: "6",
//     name: "Decorative Wall Plate Set",
//     price: 120.00,
//     originalPrice: 150.00,
//     image: "/api/placeholder/400/500",
//     badge: "Limited Edition",
//   },
// ];

// export default function FeaturedPage() {
//   return (
//     <div>
//       {/* Hero section */}
//       <div className="relative rounded-lg overflow-hidden mb-12">
//         <Image
//           src="/api/placeholder/1200/400"
//           alt="Featured collections"
//           width={1200}
//           height={400}
//           className="w-full object-cover h-64 md:h-80"
//         />
//         <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-6">
//           <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight mb-2">
//             Featured Collections
//           </h1>
//           <p className="text-white/90 max-w-md mb-6">
//             Discover our curated selection of premium pottery and ceramic pieces
//           </p>
//           <div>
//             <Button asChild>
//               <Link href="/shop">Explore All Collections</Link>
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Featured collections */}
//       <section className="mb-16">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold tracking-tight">
//             Curated Collections
//           </h2>
//           <Link href="/shop" className="text-primary hover:underline text-sm font-medium">
//             View All Collections
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {collections.map((collection) => (
//             <Card key={collection.id} className="overflow-hidden group cursor-pointer">
//               <div className="relative">
//                 <Image
//                   src={collection.image}
//                   alt={collection.name}
//                   width={600}
//                   height={400}
//                   className="w-full h-48 object-cover transition-transform group-hover:scale-105 duration-300"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
//                   <Badge className="self-start mb-2">{collection.badge}</Badge>
//                   <h3 className="text-white text-lg font-semibold mb-1">{collection.name}</h3>
//                   <p className="text-white/80 text-sm line-clamp-2">{collection.description}</p>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       </section>

//       {/* Trending section */}
//       <section className="mb-16">
//         <div className="flex items-center mb-6">
//           <TrendingUp className="mr-2 h-5 w-5 text-primary" />
//           <h2 className="text-2xl font-bold tracking-tight">Trending Now</h2>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {featuredProducts.map((product) => (
//             <Card key={product.id} className="overflow-hidden h-full flex flex-col">
//               <div className="relative">
//                 <Image
//                   src={product.image}
//                   alt={product.name}
//                   width={400}
//                   height={500}
//                   className="w-full h-64 object-cover"
//                 />
//                 <Badge className="absolute top-3 left-3">{product.badge}</Badge>
//               </div>
//               <CardContent className="flex flex-col flex-grow p-4">
//                 <h3 className="font-semibold line-clamp-2 mb-2">{product.name}</h3>
//                 <div className="flex items-center mt-1 mb-auto">
//                   <span className="font-medium">${product.price.toFixed(2)}</span>
//                   {product.originalPrice && (
//                     <span className="ml-2 text-sm text-muted-foreground line-through">
//                       ${product.originalPrice.toFixed(2)}
//                     </span>
//                   )}
//                 </div>
//                 <Button
//                   className="w-full mt-4"
//                 >
//                   <ShoppingCart className="h-4 w-4 mr-2" />
//                   Add to Cart
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </section>

//       {/* Newsletter signup */}
//       <section className="bg-muted/30 rounded-lg p-6 text-center">
//         <h2 className="text-xl font-semibold mb-2">Stay Updated</h2>
//         <p className="text-muted-foreground mb-6 max-w-md mx-auto">
//           Subscribe to our newsletter to receive updates on new collections, limited editions, and exclusive offers.
//         </p>
//         <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
//           <input
//             type="email"
//             placeholder="Enter your email"
//             className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
//           />
//           <Button className="sm:w-auto">Subscribe</Button>
//         </div>
//       </section>
//     </div>
//   );
// }