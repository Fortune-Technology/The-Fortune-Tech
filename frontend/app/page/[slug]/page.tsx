'use client';

import { useParams } from 'next/navigation';
import { useGetCMSPageBySlugQuery } from '../../../lib/store/api/cmsApi';
import PageHeader from '../../../components/ui/PageHeader';
import { FaSpinner, FaSearch } from 'react-icons/fa';

export default function CMSPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const { data: pageResponse, isLoading, isError } = useGetCMSPageBySlugQuery(slug, {
        skip: !slug,
    });

    const page = pageResponse?.data;

    if (isLoading) {
        return (
            <div className="section" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="text-center">
                    <FaSpinner className="spinner mb-4" style={{ fontSize: '2rem' }} />
                    <p>Loading page...</p>
                </div>
                <style jsx>{`
                    .spinner {
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (isError || !page) {
        return (
            <div className="section" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="text-center">
                    <FaSearch style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-muted)' }} />
                    <h2>Page Not Found</h2>
                    <p>The page "{slug}" could not be found.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <PageHeader
                title={page.title}
                subtitle={page.excerpt}
            />

            <section className="section">
                <div className="container">
                    <div
                        className="cms-content"
                        style={{ maxWidth: '800px', margin: '0 auto' }}
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />

                    {page.seo && page.seo.keywords && page.seo.keywords.length > 0 && (
                        <div style={{ maxWidth: '800px', margin: '3rem auto 0', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                            <div className="tech-pills">
                                {page.seo.keywords.map((keyword: string, idx: number) => (
                                    <span key={idx} className="tech-pill">{keyword}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
