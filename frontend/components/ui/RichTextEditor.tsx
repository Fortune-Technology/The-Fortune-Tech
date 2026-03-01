'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import '@/styles/quill-custom.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
});

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    height?: number;
    placeholder?: string;
}

export default function RichTextEditor({
    value,
    onChange,
    height = 300,
    placeholder,
}: RichTextEditorProps) {
    return (
        <div
            className="rich-text-editor-wrapper"
            style={{
                '--editor-height': `${height}px`,
                '--editor-content-height': `${height - 42}px`,
            } as React.CSSProperties}
        >
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                modules={{
                    toolbar: [
                        [{ font: [] }, { size: [] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ color: [] }, { background: [] }],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        [{ align: [] }],
                        ['link', 'image', 'code-block'],
                        ['clean'],
                    ],
                }}
            />
        </div>
    );
}
