import Link from 'next/link';
import { getSubjectsByBranchAndYear, DEPARTMENTS } from '@/lib/mockDb';
import { Book, ChevronLeft } from 'lucide-react';

export default async function BranchYearPage({
  params
}: {
  params: Promise<{ branch: string; year: string }>
}) {
  const { branch, year } = await params;
  const yearNum = parseInt(year, 10);
  const subjects = getSubjectsByBranchAndYear(branch, yearNum);
  
  // Find branch name
  let branchName = branch;
  DEPARTMENTS.forEach(d => {
    const b = d.branches.find(b => b.id === branch);
    if (b) branchName = b.name;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            {branchName}
          </h1>
          <p className="text-slate-400">Year {yearNum} Subjects</p>
        </div>
      </div>

      {subjects.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <p className="text-slate-400 text-lg">No subjects found for this year.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Link key={subject.id} href={`/subject/${subject.id}`} className="group">
              <div className="glass-panel p-6 h-full border-slate-800 hover:border-cyan-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-slate-800 rounded-lg text-cyan-500 group-hover:bg-cyan-500/10 transition-colors">
                    <Book className="w-6 h-6" />
                  </div>
                  <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs font-mono rounded border border-slate-700">
                    {subject.code}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors mb-2">
                  {subject.name}
                </h2>
                <p className="text-slate-400 text-sm">
                  Semester {subject.semester}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const params: Array<{ branch: string; year: string }> = [];
  
  // common branch has only Year 1
  params.push({ branch: 'common', year: '1' });
  
  // other branches have years 1, 2, 3, 4
  const branches = ['cse-core', 'cse-aiml', 'cse-ics', 'ece', 'eee'];
  const years = ['1', '2', '3', '4'];
  
  for (const b of branches) {
    for (const y of years) {
      params.push({ branch: b, year: y });
    }
  }
  
  return params;
}
