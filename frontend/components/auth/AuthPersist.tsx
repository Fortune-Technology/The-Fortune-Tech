'use client';

import { useEffect, useRef } from 'react';
import { useLazyGetCurrentUserQuery } from '../../lib/store/api/authApi';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { selectCurrentUser, selectAccessToken, setUser } from '../../lib/store/slices/authSlice';

export default function AuthPersist() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectCurrentUser);
    const accessToken = useAppSelector(selectAccessToken);
    const [triggerGetMe] = useLazyGetCurrentUserQuery();

    // We use a ref to prevent double-firing in Strict Mode
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const checkAuth = async () => {
            // Even if we have a token in the store (from initial hydration if we had persist),
            // or if we rely on httpOnly cookies (which baseApi handles),
            // we should try to fetch the user if they are missing but we think we might be logged in.

            // Note: Since we don't have redux-persist visible here, we rely on finding a way to restore.
            // If the token is null, we assume we might need to check with the backend 
            // (e.g. if using httpOnly cookies that are sent automatically).

            // If the user object is missing, try to fetch it.
            if (!user) {
                try {
                    // This call will fail with 401 if no valid cookie/token.
                    // If it triggers 401, baseApi logic will try /refresh.
                    // If /refresh succeeds, it sets the token.
                    // Then we need to retry fetching user? 
                    // Actually, baseApi re-tries the original query after refresh!

                    const result = await triggerGetMe().unwrap();
                    if (result.success && result.data) {
                        dispatch(setUser(result.data));
                    }
                } catch (error) {
                    // Auth failed, silently fail - user stays logged out
                    console.log('Auth check failed or user not logged in');
                }
            }
        };

        checkAuth();
    }, [dispatch, triggerGetMe, user]);

    return null;
}
