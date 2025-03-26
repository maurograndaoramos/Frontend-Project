import { Metadata } from "next";
import CollectionDetailContent from "@/components/shop/CollectionDetailContent";

type Props = {
  params: {
    collection: string;
  };
};

// Generate metadata based on collection slug
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // In Next.js 15, params need to be awaited
  const resolvedParams = await params;
  const { collection } = resolvedParams;
  
  const formattedName = collection
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${formattedName} | Flora`,
    description: `View our beautiful ${formattedName.toLowerCase()} of floral arrangements and plants.`,
    openGraph: {
      title: `${formattedName} | Flora`,
      description: `View our beautiful ${formattedName.toLowerCase()} of floral arrangements and plants.`,
      type: 'website',
    },
  };
}

export default function CollectionPage({ params }: Props) {
  return <CollectionDetailContent />;
} 