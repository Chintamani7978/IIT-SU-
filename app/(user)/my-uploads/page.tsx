import Link from 'next/link';
import { FileText, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { getMyResources } from '@/lib/db';

export const dynamic = 'force-dynamic';

const STATUS_STYLE = {
  pending: { icon: Clock, label: 'Pending review', className: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  approved: { icon: CheckCircle2, label: 'Approved', className: 'text-green-400 bg-green-500/10 border-green-500/20' },
  rejected: { icon: XCircle, label: 'Rejected', className: 'text-red-400 bg-red-500/10 border-red-500/20' },
} as const;

export default async function MyUploadsPage() {
  const resources = await getMyResources();

  return (
    <div className="space-y-8">
      <div className="border-b border-[var(--border)] pb-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">My Uploads</h1>
        <p className="text-[var(--muted-foreground)] mt-1">Track the review status of everything you&apos;ve submitted</p>
      </div>

      {resources.length === 0 ? (
        <div className="dash-card p-12 text-center border-dashed">
          <FileText className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-medium text-[var(--foreground)]">No uploads yet</h2>
          <p className="text-[var(--muted-foreground)] mt-2">
            Visit a subject page to upload notes, PYQs, videos, or lab manuals.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {resources.map((resource) => {
            const status = STATUS_STYLE[resource.status];
            const StatusIcon = status.icon;
            return (
              <div
                key={resource.id}
                className="dash-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-2 py-0.5 bg-[var(--background)] text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider rounded border border-[var(--border)]">
                      {resource.type}
                    </span>
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">{resource.title}</h3>
                  </div>

                  <div className="text-sm text-[var(--muted-foreground)] flex flex-wrap gap-x-4 gap-y-1">
                    <span>
                      Subject:{' '}
                      <Link href={`/subject/${resource.subjectId}`} className="text-[var(--primary)]/80 hover:underline">
                        {resource.subjectName ? `${resource.subjectName} (${resource.subjectCode})` : resource.subjectId}
                      </Link>
                    </span>
                    <span>Submitted: {new Date(resource.createdAt).toLocaleDateString()}</span>
                    {resource.status === 'approved' && <span>{resource.upvotes} upvotes</span>}
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium shrink-0 ${status.className}`}
                >
                  <StatusIcon className="w-4 h-4" />
                  {status.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
