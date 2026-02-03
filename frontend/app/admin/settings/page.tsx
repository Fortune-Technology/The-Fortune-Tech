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

    // RTK Query hooks
    const { data: settingsResponse, isLoading } = useGetSettingsQuery();
    const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();

    useEffect(() => {
        if (settingsResponse?.data) {
            const settings = settingsResponse.data;
            setFormData({
                site: {
                    siteName: settings.siteName || '',
                    siteDescription: settings.siteDescription || '',
                    logo: settings.logo || '',
                    favicon: settings.favicon || '',
                },
                company: {
                    email: settings.email || '',
                    phone: settings.phone || '',
                    address: settings.address || '',
                },
                social: {
                    facebook: settings.socialMedia?.facebook || '',
                    twitter: settings.socialMedia?.twitter || '',
                    instagram: settings.socialMedia?.instagram || '',
                    linkedin: settings.socialMedia?.linkedin || '',
                    github: settings.socialMedia?.github || '',
                    youtube: settings.socialMedia?.youtube || '',
                },
                seo: {
                    defaultTitle: settings.seo?.defaultTitle || '',
                    defaultDescription: settings.seo?.defaultDescription || '',
                    keywords: settings.seo?.keywords?.join(', ') || '',
                    ogImage: settings.seo?.ogImage || '',
                },
                features: {
                    maintenanceMode: settings.maintenance?.enabled || false,
                    maintenanceMessage: settings.maintenance?.message || '',
                    googleAnalytics: settings.analytics?.googleAnalyticsId || '',
                    facebookPixel: settings.analytics?.facebookPixelId || '',
                },
            });
        }
    }, [settingsResponse]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // Transform form data back to Settings structure
        const dataToSend: Partial<Settings> = {
            siteName: formData.site?.siteName,
            siteDescription: formData.site?.siteDescription,
            logo: formData.site?.logo,
            favicon: formData.site?.favicon,
            email: formData.company?.email,
            phone: formData.company?.phone,
            address: formData.company?.address,
            socialMedia: formData.social,
            seo: {
                defaultTitle: formData.seo?.defaultTitle,
                defaultDescription: formData.seo?.defaultDescription,
                keywords: formData.seo?.keywords?.split(',').map((k: string) => k.trim()).filter((k: string) => k),
                ogImage: formData.seo?.ogImage,
            },
            analytics: {
                googleAnalyticsId: formData.features?.googleAnalytics,
                facebookPixelId: formData.features?.facebookPixel,
            },
            maintenance: {
                enabled: formData.features?.maintenanceMode,
                message: formData.features?.maintenanceMessage,
            },
        };

        try {
            await updateSettings(dataToSend).unwrap();
            dispatch(showSuccessNotification('Settings saved successfully'));
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

    const tabs = [
        { id: 'site', label: 'General', icon: FaGlobe },
        { id: 'company', label: 'Company', icon: FaBuilding },
        { id: 'social', label: 'Social', icon: FaShareAlt },
        { id: 'seo', label: 'SEO', icon: FaSearch },
        { id: 'features', label: 'Features', icon: FaCogs },
    ];

    const renderField = (section: string, key: string, value: any, label: string) => {
        const type = typeof value;

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
