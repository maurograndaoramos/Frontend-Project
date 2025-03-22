import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Results - Blooming Delights",
  description: "Search results for products at Blooming Delights"
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 