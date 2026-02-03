/**
 * Settings API Slice
 * Get and update application settings
 */

import { baseApi } from './baseApi';

export interface Settings {
    _id?: string;
    siteName?: string;
    siteDescription?: string;
    logo?: string;
    favicon?: string;
    email?: string;
    phone?: string;
    address?: string;
    socialMedia?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
        github?: string;
        youtube?: string;
    };
    seo?: {
        defaultTitle?: string;
        defaultDescription?: string;
        keywords?: string[];
        ogImage?: string;
    };
    analytics?: {
        googleAnalyticsId?: string;
        facebookPixelId?: string;
    };
    maintenance?: {
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
