'use client';

import { useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { addResource } from '@/lib/mockDb';
import { Resource } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function UploadModal({ subjectId }: { subjectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    authorName: '',
    batch: '',
    type: 'note',
    unit: '',
    link: '',
    examType: 'mid-sem',
    year: new Date().getFullYear().toString(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newResource: any = {
      id: `res-${Date.now()}`,
      subjectId,
      title: formData.title,
      authorName: formData.authorName,
      batch: formData.batch,
      type: formData.type as any,
      upvotes: 0,
      isVerified: false,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    if (formData.type === 'note' || formData.type === 'lab') {
      newResource.pdfUrl = formData.link || '#';
      if (formData.type === 'note') newResource.badges = [];
      newResource.unit = formData.unit;
    } else if (formData.type === 'pyq') {
      newResource.pdfUrl = formData.link || '#';
      newResource.examType = formData.examType;
      newResource.year = formData.year;
    } else if (formData.type === 'video') {
      newResource.videoUrl = formData.link || '#';
      newResource.unit = formData.unit;
    }

    addResource(newResource as Resource);
    setIsOpen(false);
    alert('Resource submitted for moderation successfully!');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--neon-hover)] text-[var(--primary-foreground)] px-4 py-2 rounded-md font-bold transition-colors shadow-lg shadow-[var(--primary)]/20"
      >
        <UploadCloud className="w-5 h-5" />
        Upload Resource
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-lg bg-[var(--card)] border border-[var(--border)] shadow-2xl rounded-xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Upload Resource</h2>
              <button onClick={() => setIsOpen(false)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Resource Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md p-2 text-[var(--foreground)] focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                >
                  <option value="note">Class Notes</option>
                  <option value="pyq">PYQs & Solutions</option>
                  <option value="video">Video Lecture</option>
                  <option value="lab">Lab Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md p-2 text-[var(--foreground)] focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                  placeholder="e.g., Unit 1 Complete Notes"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Author Name</label>
                  <input
                    required
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md p-2 text-[var(--foreground)] focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Batch</label>
                  <input
                    type="text"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md p-2 text-[var(--foreground)] focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                    placeholder="e.g., 2024"
                  />
                </div>
              </div>

              {(formData.type === 'note' || formData.type === 'video' || formData.type === 'lab') && (
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Unit / Topic</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md p-2 text-[var(--foreground)] focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                    placeholder="e.g., Unit 3"
                  />
                </div>
              )}

              {formData.type === 'pyq' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Exam Type</label>
                    <select
                      value={formData.examType}
                      onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md p-2 text-[var(--foreground)] focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                    >
                      <option value="mid-sem">Mid-Sem</option>
                      <option value="end-sem">End-Sem</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Year</label>
                    <input
                      required
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md p-2 text-[var(--foreground)] focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                      placeholder="e.g., 2023"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Link (PDF/Video URL)</label>
                <input
                  required
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md p-2 text-[var(--foreground)] focus:ring-[var(--primary)] focus:border-[var(--primary)] outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[var(--primary)] hover:bg-[var(--neon-hover)] text-[var(--primary-foreground)] font-bold py-2 rounded-md transition-colors"
                >
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
