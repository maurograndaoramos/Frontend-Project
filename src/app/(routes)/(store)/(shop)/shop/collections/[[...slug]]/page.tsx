import { redirect } from 'next/navigation';

// Redirect from old paths to new paths
export default function OldCollectionPage({ params }: { params?: { slug?: string[] } }) {
  // If it's the main collections page
  if (!params?.slug || params.slug.length === 0) {
    redirect('/collections');
  }
  
  // If it's a specific collection page
  redirect(`/collections/${params.slug.join('/')}`);
} 