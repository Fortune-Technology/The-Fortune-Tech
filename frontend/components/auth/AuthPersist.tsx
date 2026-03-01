'use client';

import { useEffect, useRef } from 'react';
import { useLazyGetCurrentUserQuery } from '../../lib/store/api/authApi';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { selectCurrentUser, selectAccessToken, setUser, setLoading } from '../../lib/store/slices/authSlice';

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
            if (!user) {
                try {
                    const result = await triggerGetMe().unwrap();
                    if (result.success && result.data) {
                        dispatch(setUser(result.data));
                    } else {
                        // No user data returned — auth check complete, not authenticated
                        dispatch(setLoading(false));
                    }
                } catch (error) {
                    // Auth failed — mark loading as complete so pages can render
                    dispatch(setLoading(false));
                }
            } else {
                // User already exists in store — loading complete
                dispatch(setLoading(false));
            }
        };

        checkAuth();
    }, [dispatch, triggerGetMe, user]);

    return null;
}
