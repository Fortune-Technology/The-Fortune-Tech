'use client';

import { useState } from 'react';

interface UseDeleteConfirmOptions {
    onConfirm: () => void | Promise<void>;
    title?: string;
    message?: string;
    itemName?: string;
}

export function useDeleteConfirm() {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<UseDeleteConfirmOptions>({
        onConfirm: () => { },
    });

    const showDeleteConfirm = (opts: UseDeleteConfirmOptions) => {
        setOptions(opts);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleConfirm = async () => {
        await options.onConfirm();
        closeModal();
    };

    return {
        isOpen,
        showDeleteConfirm,
        closeModal,
        handleConfirm,
        modalProps: {
            isOpen,
            onClose: closeModal,
            onConfirm: handleConfirm,
            title: options.title,
            message: options.message,
            itemName: options.itemName,
        },
    };
}
