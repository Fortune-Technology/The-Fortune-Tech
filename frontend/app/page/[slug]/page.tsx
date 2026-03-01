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
            <div className="section cms-loading-section">
                <div className="loading-state">
                    <FaSpinner className="spinner cms-loading-spinner" />
                    <p>Loading page...</p>
                </div>
            </div>
        );
    }

    if (isError || !page) {
        return (
            <div className="section cms-loading-section">
                <div className="loading-state">
                    <FaSearch className="cms-not-found-icon" />
                    <h2>Page Not Found</h2>
                    <p>The page &quot;{slug}&quot; could not be found.</p>
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
                        className="cms-content cms-content-wrapper"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />

                    {page.seo && page.seo.keywords && page.seo.keywords.length > 0 && (
                        <div className="cms-meta-footer">
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
