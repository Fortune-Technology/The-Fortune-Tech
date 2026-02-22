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
    const [isHovering, setIsHovering] = useState(false);
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
            {label && <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{label}</label>}

            <div
                className="image-upload-area"
                onClick={handleClick}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                style={{
                    border: `2px dashed ${previewUrl ? 'var(--primary, #3b82f6)' : 'var(--glass-border, #ccc)'}`,
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: 'var(--glass-bg, rgba(255,255,255,0.05))',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    minHeight: `${height}px`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    overflow: 'hidden'
                }}
            >
                <input
                    type="file"
                    ref={inputRef}
                    onChange={handleFileChange}
                    accept={accept}
                    style={{ display: 'none' }}
                />

                {previewUrl ? (
                    <div className="preview-container" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                        <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            style={{ objectFit: 'contain', padding: '0.5rem' }}
                            unoptimized
                        />

                        {/* Overlay on hover */}
                        <div className="preview-overlay" style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: isHovering ? 1 : 0,
                            transition: 'opacity 0.2s',
                            gap: '1rem'
                        }}>
                            <span style={{ color: 'white', fontWeight: 600 }}>Change Image</span>
                        </div>

                        {/* Remove button */}
                        <button
                            type="button"
                            onClick={handleRemove}
                            style={{
                                position: 'absolute',
                                top: '0.5rem',
                                right: '0.5rem',
                                backgroundColor: 'var(--danger, #ef4444)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                zIndex: 10,
                                opacity: isHovering ? 1 : 0,
                                transition: 'opacity 0.2s'
                            }}
                            title="Remove image"
                        >
                            <FaTrash size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="upload-placeholder" style={{ color: 'var(--text-muted, #999)', padding: '2rem' }}>
                        <FaCloudUploadAlt size={48} style={{ marginBottom: '1rem', opacity: 0.7 }} />
                        <p style={{ margin: 0, fontWeight: 500, fontSize: '1rem' }}>Click to upload image</p>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', opacity: 0.8 }}>SVG, PNG, JPG or GIF</p>
                    </div>
                )}
            </div>

            {folderPath && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #999)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                    Will be stored in: {folderPath}
                </div>
            )}
        </div>
    );
}