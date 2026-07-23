'use client';

import { useState, useTransition } from 'react';
import { Check, XCircle } from 'lucide-react';
import { moderateResource } from '@/lib/actions';

export default function ModerationActions({ resourceId }: { resourceId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const decide = (decision: 'approved' | 'rejected') => {
    setError(null);
    let reason: string | undefined;
    if (decision === 'rejected') {
      reason = window.prompt('Reason for rejection (shown to the uploader):') ?? undefined;
      if (reason === undefined) return; // cancelled
    }
    startTransition(async () => {
      const result = await moderateResource(resourceId, decision, reason);
      if (result.error) setError(result.error);
    });
  };

  return (
    <div className="flex flex-col items-end gap-2 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => decide('rejected')}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--background)] hover:bg-red-500/10 text-[var(--muted-foreground)] hover:text-red-400 border border-[var(--border)] hover:border-red-500/30 rounded-md transition-colors disabled:opacity-60"
        >
          <XCircle className="w-4 h-4" />
          Reject
        </button>
        <button
          onClick={() => decide('approved')}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] hover:bg-[var(--neon-hover)] text-[var(--primary-foreground)] rounded-md transition-colors font-bold disabled:opacity-60"
        >
          <Check className="w-4 h-4" />
          {isPending ? 'Saving…' : 'Approve'}
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
