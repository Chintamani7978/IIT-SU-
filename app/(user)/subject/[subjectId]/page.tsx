import { SUBJECTS } from '@/lib/mockDb';
import { getSubjectById, getResourcesBySubjectId } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase/server';
import SubjectTabs from '@/components/SubjectTabs';
import Link from 'next/link';
import { ChevronLeft, UploadCloud } from 'lucide-react';
import UploadModal from '@/components/UploadModal';

// Re-render periodically so newly approved resources appear and the signed
// PDF URLs (1h TTL) never go stale on a cached page.
export const revalidate = 300;

export default async function SubjectPage({
  params
}: {
  params: Promise<{ subjectId: string }>
}) {
  const { subjectId } = await params;
  const subject = await getSubjectById(subjectId);

  if (!subject) {
    return (
      <div className="text-center py-24">
        <h1 className="text-2xl text-[var(--foreground)] mb-4">Subject not found</h1>
        <Link href="/departments" className="text-[var(--primary)] hover:underline">Return to Departments</Link>
      </div>
    );
  }

  const resources = await getResourcesBySubjectId(subject.id);
  const live = isSupabaseConfigured();

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link href={`/department/${subject.branchId}/${subject.year}`} className="p-2 mt-1 bg-[var(--card)] rounded-full hover:bg-[var(--card-hover)] text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors border border-[var(--border)]">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
                {subject.name}
              </h1>
              <span className="px-2 py-1 bg-[var(--background)] text-[var(--muted-foreground)] text-xs font-mono rounded border border-[var(--border)]">
                {subject.code}
              </span>
            </div>
            <p className="text-[var(--muted-foreground)]">
              Semester {subject.semester} • Year {subject.year}
            </p>
          </div>
        </div>

        <UploadModal subjectId={subject.id} live={live} />
      </div>

      <main>
        <SubjectTabs resources={resources} subjectId={subject.id} live={live} />
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  return SUBJECTS.map((subject) => ({
    subjectId: subject.id,
  }));
}
