'use client';

import { useState } from 'react';
import { FileText, X, ExternalLink } from 'lucide-react';

export default function PdfPreviewModal({ url, label = 'View PDF' }: { url: string; label?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!url || url === '#') {
    return <span className="text-sm text-[var(--muted-foreground)]">No file</span>;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-[var(--primary)] hover:text-[var(--neon-hover)] font-medium"
      >
        {label} →
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <div className="relative w-full max-w-4xl h-[90vh] bg-[var(--card)] border border-[var(--border)] shadow-2xl rounded-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0">
              <div className="flex items-center gap-2 text-[var(--foreground)] font-medium">
                <FileText className="w-4 h-4 text-[var(--primary)]" />
                PDF preview
              </div>
              <div className="flex items-center gap-4">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[var(--primary)] hover:text-[var(--neon-hover)]"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in new tab
                </a>
                <button onClick={() => setIsOpen(false)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <iframe src={url} title="PDF preview" className="flex-1 w-full bg-white" />
          </div>
        </div>
      )}
    </>
  );
}
