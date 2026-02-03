/**
 * Base API Configuration
 * RTK Query base API with auth token handling and automatic refresh
 */

import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { logOut, setCredentials } from '../slices/authSlice';

// Auth state type for accessing token
interface AuthState {
    accessToken: string | null;
}

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`,
    credentials: 'include', // Include cookies for refresh token
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as { auth: AuthState };
        const token = state.auth.accessToken;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

/**
 * Base query with automatic token refresh on 401 errors
 */
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Try to refresh the token
        const refreshResult = await baseQuery(
            { url: '/auth/refresh', method: 'POST' },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            const data = refreshResult.data as { data: { accessToken: string } };
            // Store the new token
            api.dispatch(setCredentials({ accessToken: data.data.accessToken }));
            // Retry the original query
            result = await baseQuery(args, api, extraOptions);
        } else {
            // Refresh failed, log out
            api.dispatch(logOut());
        }
    }

    return result;
};

/**
 * Base API - all other API slices will inject endpoints into this
 */
export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        'User',
        'Users',
        'Service',
        'Services',
        'Portfolio',
        'Portfolios',
        'Technology',
        'Technologies',
        'Testimonial',
        'Testimonials',
        'Career',
        'Careers',
        'CMS',
        'CMSPages',
        'Settings',
    ],
    endpoints: () => ({}),
});
