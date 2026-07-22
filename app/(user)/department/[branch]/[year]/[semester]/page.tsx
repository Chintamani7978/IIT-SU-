import Link from 'next/link';
import { Book, FlaskConical, ArrowLeft, Code2, Presentation, Mic } from 'lucide-react';
import { DEPARTMENTS, SUBJECTS } from '@/lib/mockDb';

const typeIcons: Record<string, typeof Book> = {
  theory: Book,
  lab: FlaskConical,
  project: Code2,
  seminar: Presentation,
  viva: Mic,
};

export default async function SemesterPage({
  params
}: {
  params: Promise<{ branch: string; year: string; semester: string }>
}) {
  const { branch, year, semester } = await params;
  const yearNum = parseInt(year, 10);
  const semNum = parseInt(semester, 10);

  let branchName = branch;
  let deptName = 'Department';
  for (const d of DEPARTMENTS) {
    const b = d.branches.find(b => b.id === branch);
    if (b) { branchName = b.name; deptName = d.name; break; }
  }

  const subjects = SUBJECTS.filter(s => s.branchId === branch && s.year === yearNum && s.semester === semNum);
  const yearLabels: Record<number, string> = { 1: 'First', 2: 'Second', 3: 'Third', 4: 'Fourth' };
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);

  return (
    <div className="min-h-[calc(100vh-120px)] max-w-5xl mx-auto px-4 py-8">
      <Link href={`/department/${branch}/${year}`} className="group flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400 hover:text-[var(--primary)] transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-300 ease-out" /> 
        Back to Semesters
      </Link>

      <div className="mb-12">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-3">{deptName}</p>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none mb-2">{branchName}</h1>
        <p className="text-sm text-zinc-500">{yearLabels[yearNum]} Year &middot; Semester {semNum}</p>
        {totalCredits > 0 && (
          <p className="text-xs text-zinc-600 mt-1">Total Credits: {totalCredits}</p>
        )}
      </div>

      <div className="w-full h-px bg-white/10 mb-8"></div>

      {subjects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-500 text-lg">No subjects added for this semester yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => {
            const Icon = typeIcons[subject.type] || Book;
            return (
              <Link key={subject.id} href={`/subject/${subject.id}`} className="group">
                <div className="p-5 h-full border border-white/10 hover:border-[var(--primary)]/50 bg-white/[0.01] hover:bg-white/[0.03] transition-all rounded-xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] group-hover:bg-[var(--primary)]/20 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-white/5 text-zinc-500 text-[10px] font-mono rounded border border-white/10 uppercase">
                        {subject.type}
                      </span>
                      <span className="px-2 py-0.5 bg-white/5 text-zinc-400 text-xs font-mono rounded border border-white/10">
                        {subject.code}
                      </span>
                    </div>
                  </div>
                  <h2 className="text-sm font-semibold text-zinc-200 group-hover:text-[var(--primary)] transition-colors mb-2 leading-snug">
                    {subject.name}
                  </h2>
                  <p className="text-[11px] text-zinc-600">
                    {subject.credits} Credit{subject.credits !== 1 ? 's' : ''}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const params: Array<{ branch: string; year: string; semester: string }> = [];
  const branches = ['cse-core', 'cse-aiml', 'cse-ics', 'ece', 'eee'];
  const years = ['1', '2', '3', '4'];
  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  for (const b of branches) {
    for (const y of years) {
      for (const s of semesters) {
        params.push({ branch: b, year: y, semester: s });
      }
    }
  }
  return params;
}
