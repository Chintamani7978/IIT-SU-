'use client';

import { useState, useEffect } from 'react';
import { getPendingResources, approveResource } from '@/lib/mockDb';
import { Resource } from '@/lib/types';
import { ShieldCheck, Check, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ModerationPage() {
  const [pending, setPending] = useState<Resource[]>([]);
  const router = useRouter();

  useEffect(() => {
    // In a real app, this would be an API call
    setPending(getPendingResources());
  }, []);

  const handleApprove = (id: string) => {
    approveResource(id);
    setPending(getPendingResources());
    router.refresh();
  };

  const handleReject = (id: string) => {
    // Basic mock rejection (just removing it from the pending list view for now)
    setPending(pending.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 border-b border-[var(--border)] pb-6">
        <ShieldCheck className="w-8 h-8 text-[var(--primary)]" />
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Moderation Queue</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Approve or reject community uploaded resources</p>
        </div>
      </div>

      {pending.length === 0 ? (
        <div className="dash-card p-12 text-center border-dashed">
          <ShieldCheck className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-medium text-[var(--foreground)]">All caught up!</h2>
          <p className="text-[var(--muted-foreground)] mt-2">There are no pending resources to moderate.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((resource) => (
            <div key={resource.id} className="dash-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[var(--card-hover)] transition-colors">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-[var(--background)] text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider rounded border border-[var(--border)]">
                    {resource.type}
                  </span>
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">{resource.title}</h3>
                </div>
                
                <div className="text-sm text-[var(--muted-foreground)] flex flex-wrap gap-x-4 gap-y-1">
                  <span>Subject ID: <span className="text-[var(--primary)]/80">{resource.subjectId}</span></span>
                  <span>Author: {resource.authorName} {resource.batch && `(${resource.batch})`}</span>
                  <span>Submitted: {new Date(resource.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleReject(resource.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--background)] hover:bg-red-500/10 text-[var(--muted-foreground)] hover:text-red-400 border border-[var(--border)] hover:border-red-500/30 rounded-md transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(resource.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] hover:bg-[var(--neon-hover)] text-[var(--primary-foreground)] rounded-md transition-colors font-bold"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
