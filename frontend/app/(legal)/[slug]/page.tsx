import { notFound } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import cmsData from '@/data/cms.json';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return cmsData.pages.map((page: { id: string }) => ({
        slug: page.id,
    }));
}

export default async function LegalPage({ params }: PageProps) {
    const { slug } = await params;
    const page = cmsData.pages.find((p: { id: string }) => p.id === slug);

    if (!page) {
        notFound();
    }

    return (
        <>
            <PageHeader
                title={page.title}
                subtitle={`Last Updated: ${page.lastUpdated}`}
            />

            <section className="section">
                <div className="container">
                    <div className="legal-content cms-content-wrapper">
                        {page.content.map((section: { heading: string; html: string }, idx: number) => (
                            <div key={idx} className="legal-section">
                                <h2 className="legal-section-heading">
                                    {section.heading}
                                </h2>
                                <div
                                    className="legal-section-text"
                                    dangerouslySetInnerHTML={{ __html: section.html }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
