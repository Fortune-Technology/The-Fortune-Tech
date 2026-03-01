import { Metadata } from 'next';
import BlogListingClient from './BlogListingClient';

export const metadata: Metadata = {
    title: 'Blog | The Fortune Tech - Latest Tech Insights & News',
    description: 'Stay updated with the latest technology trends, insights, and expert articles from The Fortune Tech team. Web development, AI, cloud computing, and more.',
    keywords: ['tech blog', 'web development blog', 'technology articles', 'Fortune Tech blog', 'software development insights'],
    openGraph: {
        title: 'Blog | The Fortune Tech',
        description: 'Latest technology insights, tutorials, and expert articles from The Fortune Tech.',
        type: 'website',
        url: '/blog',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog | The Fortune Tech',
        description: 'Latest technology insights, tutorials, and expert articles from The Fortune Tech.',
    },
};

export default function BlogPage() {
    return <BlogListingClient />;
}
