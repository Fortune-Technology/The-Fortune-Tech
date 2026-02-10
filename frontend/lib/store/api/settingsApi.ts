/**
 * Settings API Slice
 * Get and update application settings
 */

import { baseApi } from './baseApi';

export interface Settings {
    _id?: string;
    site?: {
        name?: string;
        tagline?: string;
        description?: string;
        url?: string;
        logo?: string;
        favicon?: string;
    };
    company?: {
        legalName?: string;
        email?: string;
        phone?: string;
        address?: {
            street?: string;
            city?: string;
            state?: string;
            postalCode?: string;
            country?: string;
        } | string; // Handle legacy string or object
        businessHours?: Record<string, string>;
    };
    social?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
        dribbble?: string;
        facebook?: string;
        instagram?: string;
        youtube?: string;
    };
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
        ogImage?: string;
    };
    features?: Record<string, boolean | string>;
    analytics?: { // Legacy field support if needed, or mapped to features
        googleAnalyticsId?: string;
        facebookPixelId?: string;
    };
    maintenance?: { // Legacy field support if needed
        enabled?: boolean;
        message?: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

interface SettingsResponse {
    success: boolean;
    data: Settings;
}

export const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSettings: builder.query<SettingsResponse, void>({
            query: () => '/settings',
            providesTags: ['Settings'],
        }),

        updateSettings: builder.mutation<SettingsResponse, Partial<Settings>>({
            query: (data) => ({
                url: '/settings',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Settings'],
        }),
    }),
});

export const {
    useGetSettingsQuery,
    useUpdateSettingsMutation,
} = settingsApi;
