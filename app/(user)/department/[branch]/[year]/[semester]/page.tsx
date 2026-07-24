import Link from 'next/link';
import { Book, FlaskConical, ArrowLeft, Code2, Presentation, Mic } from 'lucide-react';
import { findBranch, getDepartments, getSubjectsByBranchYearSemester } from '@/lib/db';

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

  const [departments, subjects] = await Promise.all([
    getDepartments(),
    getSubjectsByBranchYearSemester(branch, yearNum, semNum),
  ]);
  const found = findBranch(departments, branch);
  const branchName = found?.branch.name ?? branch;
  const deptName = found?.department.name ?? 'Department';
  const yearLabels: Record<number, string> = { 1: 'First', 2: 'Second', 3: 'Third', 4: 'Fourth' };
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);

  return (
    <div className="min-h-[calc(100vh-120px)] max-w-5xl mx-auto px-4 py-8 flex flex-col justify-center">
      <div className="flex flex-col items-center text-center">
        <Link href={`/department/${branch}/${year}`} className="group flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400 hover:text-[var(--primary)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-300 ease-out" /> 
          Back to Semesters
        </Link>

        <div className="mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-4">{deptName}</p>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none max-w-4xl mx-auto mb-4">
            {branchName}
          </h1>
          <p className="text-sm font-mono text-[var(--primary)] tracking-widest uppercase">
            {yearLabels[yearNum]} Year <span className="text-zinc-600 mx-2">/</span> Semester {semNum}
          </p>
        </div>
      </div>

      <div className="w-full h-px bg-white/10 mb-8"></div>
      
      <div className="flex justify-between items-center mb-6 px-4">
        <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-500">Subjects</h2>
        {totalCredits > 0 && (
          <span className="text-[10px] font-mono text-zinc-400 border border-white/10 px-3 py-1 rounded-full">
            Total Credits: {totalCredits}
          </span>
        )}
      </div>

      <div className="w-full h-px bg-white/10 mb-4"></div>

      {subjects.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600">No subjects found</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {subjects.map((subject, index) => {
            const Icon = typeIcons[subject.type] || Book;
            return (
              <Link key={subject.id} href={`/subject/${subject.id}`} className="group relative grid grid-cols-12 items-center px-4 py-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors duration-300">
                
                <div className="col-span-2 md:col-span-1 text-[10px] font-mono text-zinc-500 group-hover:text-[var(--primary)] transition-colors tracking-[0.2em]">
                  0{index + 1}
                </div>

                <div className="col-span-10 md:col-span-7 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                  <h3 className="text-lg md:text-xl font-light text-zinc-300 group-hover:text-white transition-colors tracking-tight">
                    {subject.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-white/5 text-zinc-500 text-[9px] font-mono tracking-widest uppercase rounded border border-white/10">
                      {subject.type}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-600 uppercase">
                      {subject.code}
                    </span>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-4 flex items-center justify-between md:justify-end gap-6 mt-4 md:mt-0">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">{subject.credits} CR</span>
                  </div>
                  <div className="w-6 h-px bg-white/20 hidden md:block group-hover:bg-[var(--primary)] transition-colors"></div>
                </div>

                {/* Hover line indicator */}
                <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[var(--primary)] scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-out"></div>
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
