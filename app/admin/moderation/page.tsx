import { ShieldCheck, ExternalLink } from 'lucide-react';
import { getPendingResources } from '@/lib/db';
import ModerationActions from '@/components/ModerationActions';
import PdfPreviewModal from '@/components/PdfPreviewModal';

export const dynamic = 'force-dynamic';

export default async function ModerationPage() {
  const pending = await getPendingResources();

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
          {pending.map((resource) => {
            const previewUrl =
              resource.type === 'video' ? resource.videoUrl : resource.pdfUrl;
            return (
              <div
                key={resource.id}
                className="dash-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[var(--card-hover)] transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-[var(--background)] text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider rounded border border-[var(--border)]">
                      {resource.type}
                    </span>
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">{resource.title}</h3>
                  </div>

                  <div className="text-sm text-[var(--muted-foreground)] flex flex-wrap gap-x-4 gap-y-1">
                    <span>
                      Subject:{' '}
                      <span className="text-[var(--primary)]/80">
                        {resource.subjectName
                          ? `${resource.subjectName} (${resource.subjectCode})`
                          : resource.subjectId}
                      </span>
                    </span>
                    <span>
                      Author: {resource.authorName} {resource.batch && `(${resource.batch})`}
                    </span>
                    <span>Submitted: {new Date(resource.createdAt).toLocaleDateString()}</span>
                  </div>

                  {previewUrl && previewUrl !== '#' && (
                    resource.type === 'video' ? (
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-[var(--primary)] hover:text-[var(--neon-hover)] font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open video
                      </a>
                    ) : (
                      <PdfPreviewModal url={previewUrl} label="Preview PDF" />
                    )
                  )}
                </div>

                <ModerationActions resourceId={resource.id} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
