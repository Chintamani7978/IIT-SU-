'use client';

import { useState } from 'react';
import { ChevronDown, GraduationCap, Laptop, Cpu, Zap, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingAccordion() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openDept, setOpenDept] = useState<string | null>(null);

  const departments = [
    {
      id: 'cse',
      name: 'Department of Computer Science & Engineering',
      icon: Laptop,
      branches: [
        { id: 'common', name: '1st Year (Common)', isCommon: true },
        { id: 'cse-core', name: 'Computer Science & Engineering (Core)' },
        { id: 'cse-aiml', name: 'Artificial Intelligence & Machine Learning (AI/ML)' },
        { id: 'cse-ics', name: 'Information & Cyber Security (ICS)' },
      ]
    },
    {
      id: 'ece',
      name: 'Department of Electronics & Communication Engineering',
      icon: Cpu,
      branches: [
        { id: 'common', name: '1st Year (Common)', isCommon: true },
        { id: 'ece', name: 'Electronics & Communication Engineering (ECE)' },
      ]
    },
    {
      id: 'eee',
      name: 'Department of Electrical & Electronics Engineering',
      icon: Zap,
      branches: [
        { id: 'common', name: '1st Year (Common)', isCommon: true },
        { id: 'eee', name: 'Electrical & Electronics Engineering (EEE)' },
      ]
    }
  ];

  if (!isExpanded) {
    return (
      <div className="flex justify-center mt-0 mb-8">
        <button
          onClick={() => setIsExpanded(true)}
          className="group relative px-6 py-3.5 bg-[var(--primary)] text-black rounded-xl font-bold text-sm tracking-widest uppercase shadow-[0_0_30px_rgba(204,255,0,0.15)] hover:shadow-[0_0_50px_rgba(204,255,0,0.3)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <span className="relative flex items-center gap-2">
            SELECT YOUR BRANCH
            <ChevronDown className="w-5 h-5 group-hover:animate-bounce" />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 space-y-3 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-xl md:text-2xl font-extrabold text-[var(--foreground)] tracking-tight">Choose Department</h2>
        <button 
          onClick={() => { setIsExpanded(false); setOpenDept(null); }}
          className="text-xs font-semibold tracking-wider uppercase text-zinc-500 hover:text-[var(--primary)] transition-colors"
        >
          Collapse
        </button>
      </div>

      {departments.map((dept) => {
        const Icon = dept.icon;
        const isOpen = openDept === dept.id;

        return (
          <div 
            key={dept.id} 
            className={`rounded-xl transition-all duration-500 overflow-hidden border backdrop-blur-md ${
              isOpen 
                ? 'bg-zinc-900/80 border-[var(--primary)]/40 shadow-[0_0_30px_rgba(204,255,0,0.05)]' 
                : 'bg-zinc-900/30 border-white/5 hover:bg-zinc-900/50 hover:border-white/10'
            }`}
          >
            <button
              onClick={() => setOpenDept(isOpen ? null : dept.id)}
              className="w-full flex items-center justify-between p-4 md:p-5 text-left focus:outline-none group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-lg transition-all duration-500 ${isOpen ? 'bg-[var(--primary)] text-black shadow-[0_0_15px_rgba(204,255,0,0.2)]' : 'bg-black/40 text-zinc-400 group-hover:text-white'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`font-medium text-base md:text-lg tracking-tight transition-colors ${isOpen ? 'text-[var(--foreground)]' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                  {dept.name}
                </span>
              </div>
              <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'rotate-180 text-[var(--primary)]' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
            </button>

            <div 
              className={`transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-2 pt-0 pb-4 md:px-5 md:pb-5 grid gap-2">
                {dept.branches.map((branch) => (
                  <Link
                    key={branch.id}
                    href={`/department/${branch.id}`}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 group ${
                      branch.isCommon
                        ? 'bg-[var(--primary)]/5 border-[var(--primary)]/20 hover:bg-[var(--primary)]/15 hover:border-[var(--primary)]/40 text-[var(--foreground)]'
                        : 'bg-black/30 border-white/5 hover:bg-black/50 hover:border-white/15 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {branch.isCommon ? (
                        <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse shadow-[0_0_8px_rgba(204,255,0,0.8)]"></div>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-zinc-300 transition-colors"></div>
                      )}
                      <span className="font-medium text-sm tracking-wide">{branch.name}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out text-[var(--primary)]" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
