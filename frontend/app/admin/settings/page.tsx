'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { FaSave, FaGlobe, FaBuilding, FaShareAlt, FaSearch, FaCogs, FaSpinner } from 'react-icons/fa';
import { useGetSettingsQuery, useUpdateSettingsMutation, Settings } from '../../../lib/store/api/settingsApi';
import { useAppDispatch } from '../../../lib/store/hooks';
import { showSuccessNotification, showErrorNotification } from '../../../lib/store/slices/notificationSlice';

export default function SettingsPage() {
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState('site');
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [faviconFile, setFaviconFile] = useState<File | null>(null);

    // RTK Query hooks
    const { data: settingsResponse, isLoading, refetch } = useGetSettingsQuery();
    const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();

    useEffect(() => {
        if (settingsResponse?.data) {
            const settings = settingsResponse.data;
            setFormData({
                site: {
                    name: settings.site?.name || '',
                    description: settings.site?.description || '',
                    logo: settings.site?.logo || '',
                    favicon: settings.site?.favicon || '',
                },
                company: {
                    email: settings.company?.email || '',
                    phone: settings.company?.phone || '',
                    address: typeof settings.company?.address === 'string' ? settings.company.address : '',
                },
                social: {
                    facebook: settings.social?.facebook || '',
                    twitter: settings.social?.twitter || '',
                    instagram: settings.social?.instagram || '',
                    linkedin: settings.social?.linkedin || '',
                    github: settings.social?.github || '',
                    youtube: settings.social?.youtube || '',
                },
                seo: {
                    title: settings.seo?.title || '',
                    description: settings.seo?.description || '',
                    keywords: settings.seo?.keywords?.join(', ') || '',
                    ogImage: settings.seo?.ogImage || '',
                },
                features: {
                    maintenanceMode: settings.features?.maintenanceMode || false,
                    maintenanceMessage: settings.features?.maintenanceMessage || '',
                    googleAnalytics: settings.features?.googleAnalytics || '',
                    facebookPixel: settings.features?.facebookPixel || '',
                },
            });
        }
    }, [settingsResponse]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // Transform form data back to Settings structure
        const dataToSend: any = { // Using any temporarily to bypass strict typing during migration
            site: {
                name: formData.site?.name,
                description: formData.site?.description,
                // Logo and favicon handled separately
            },
            company: {
                email: formData.company?.email,
                phone: formData.company?.phone,
                address: formData.company?.address, // Simple string address
            },
            social: formData.social,
            seo: {
                title: formData.seo?.title,
                description: formData.seo?.description,
                keywords: typeof formData.seo?.keywords === 'string'
                    ? formData.seo?.keywords?.split(',').map((k: string) => k.trim()).filter((k: string) => k)
                    : formData.seo?.keywords,
                ogImage: formData.seo?.ogImage,
            },
            features: {
                maintenanceMode: formData.features?.maintenanceMode,
                maintenanceMessage: formData.features?.maintenanceMessage,
                googleAnalytics: formData.features?.googleAnalytics,
                facebookPixel: formData.features?.facebookPixel,
            },
        };

        try {
            const submitData = new FormData();
            submitData.append('data', JSON.stringify(dataToSend));

            if (logoFile) {
                submitData.append('logo', logoFile);
            }

            if (faviconFile) {
                submitData.append('favicon', faviconFile);
            }

            await updateSettings(submitData as any).unwrap();
            dispatch(showSuccessNotification('Settings saved successfully'));
            // Clear file inputs state
            setLogoFile(null);
            setFaviconFile(null);
            // Refetch to get updated URLs
            refetch();
        } catch (err: any) {
            dispatch(showErrorNotification(err?.data?.message || 'Failed to save settings'));
        }
    };

    const handleInputChange = (section: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'logo') setLogoFile(e.target.files[0]);
            else setFaviconFile(e.target.files[0]);
        }
    };

    const tabs = [
        { id: 'site', label: 'General', icon: FaGlobe },
        { id: 'company', label: 'Company', icon: FaBuilding },
        { id: 'social', label: 'Social', icon: FaShareAlt },
        { id: 'seo', label: 'SEO', icon: FaSearch },
        { id: 'features', label: 'Features', icon: FaCogs },
    ];

    const renderField = (section: string, key: string, value: any, label: string) => {
        const type = typeof value;

        // Custom render for logo and favicon
        if (section === 'site' && (key === 'logo' || key === 'favicon')) {
            return (
                <div key={key} className="form-group">
                    <label className="form-label">{label}</label>
                    <div className="file-input-wrapper">
                        <input
                            type="file"
                            accept="image/*"
                            className="form-input"
                            onChange={(e) => handleFileChange(e, key as 'logo' | 'favicon')}
                        />
                        {value && (
                            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Current: <a href={value.startsWith('http') || value.startsWith('/') ? `${value.startsWith('http') ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')}${value.startsWith('/') ? '' : '/'}${value}` : value} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>View Current Image</a>
                            </div>
                        )}
                        {(key === 'logo' ? logoFile : faviconFile) && (
                            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--success)' }}>
                                Selected: {(key === 'logo' ? logoFile : faviconFile)?.name}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                {type === 'boolean' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleInputChange(section, key, e.target.checked)}
                        />
                        <span>Enable {label}</span>
                    </div>
                ) : (
                    <input
                        type={type === 'number' ? 'number' : 'text'}
                        className="form-input"
                        value={value || ''}
                        onChange={(e) => handleInputChange(section, key, type === 'number' ? Number(e.target.value) : e.target.value)}
                    />
                )}
            </div>
        );
    };

    const formatLabel = (key: string) => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
    };

    if (isLoading) {
        return (
            <AdminLayout pageTitle="Settings">
                <div className="admin-loading">
                    <FaSpinner className="spinner" />
                    <p>Loading settings...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout pageTitle="Settings">
            <div className="settings-container">
                <div className="settings-sidebar admin-card">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="settings-content admin-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">
                            {tabs.find(t => t.id === activeTab)?.label} Settings
                        </h3>
                    </div>

                    <form onSubmit={handleSave} style={{ padding: '1.5rem' }}>
                        <div className="admin-form-grid">
                            {formData[activeTab] && Object.entries(formData[activeTab]).map(([key, value]) => {
                                const label = formatLabel(key);
                                return renderField(activeTab, key, value, label);
                            })}
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn btn-primary" disabled={isSaving}>
                                {isSaving ? <FaSpinner className="spinner" /> : <FaSave />}
                                {' '}{isSaving ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </AdminLayout>
    );
}
