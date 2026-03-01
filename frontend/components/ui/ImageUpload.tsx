'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import { getImageUrl } from '@/lib/utils';

interface ImageUploadProps {
    label?: string;
    value?: string | File | null;
    onChange: (file: File | null) => void;
    folderPath?: string; // Optional context about where it will be stored
    className?: string;
    accept?: string;
    height?: number; // custom height
}

export default function ImageUpload({
    label = "Upload Image",
    value,
    onChange,
    folderPath,
    className = "",
    accept = "image/*",
    height = 250
}: ImageUploadProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Update preview when value changes
    useEffect(() => {
        if (!value) {
            setPreviewUrl(null);
            return;
        }

        if (typeof value === 'string') {
            setPreviewUrl(getImageUrl(value));
        } else if (value instanceof File) {
            const objectUrl = URL.createObjectURL(value);
            setPreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onChange(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className={`image-upload-container ${className}`}>
            {label && <label className="form-label form-label-block">{label}</label>}

            <div
                className={`image-upload-area ${previewUrl ? 'has-preview' : ''}`}
                onClick={handleClick}
                style={{ '--upload-height': `${height}px` } as React.CSSProperties}
            >
                <input
                    type="file"
                    ref={inputRef}
                    onChange={handleFileChange}
                    accept={accept}
                    className="sr-only"
                />

                {previewUrl ? (
                    <div className="preview-container">
                        <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            unoptimized
                        />

                        {/* Overlay on hover */}
                        <div className="preview-overlay">
                            <span className="preview-overlay-text">Change Image</span>
                        </div>

                        {/* Remove button */}
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="preview-remove-btn"
                            title="Remove image"
                        >
                            <FaTrash size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="upload-placeholder">
                        <FaCloudUploadAlt size={48} className="upload-icon" />
                        <p className="upload-title">Click to upload image</p>
                        <p className="upload-hint">SVG, PNG, JPG or GIF</p>
                    </div>
                )}
            </div>

            {folderPath && (
                <div className="upload-storage-info">
                    Will be stored in: {folderPath}
                </div>
            )}
        </div>
    );
}