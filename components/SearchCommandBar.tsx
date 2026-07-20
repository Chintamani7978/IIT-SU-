'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Book } from 'lucide-react';
import { SUBJECTS } from '@/lib/mockDb';

export default function SearchCommandBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Handle Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredSubjects = query
    ? SUBJECTS.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.code.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSelect = (subjectId: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/subject/${subjectId}`);
  };

  return (
    <>
      {/* Global Search Button (Mobile/Desktop) */}
      <div className="fixed bottom-6 right-6 md:top-4 md:right-4 md:bottom-auto z-40 md:z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-400 px-4 py-2 rounded-full shadow-lg transition-colors"
        >
          <Search className="w-5 h-5" />
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden md:inline font-mono text-xs bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">⌘K</kbd>
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 px-4 pb-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xl rounded-xl overflow-hidden dash-card">
            <div className="flex items-center px-4 py-3 border-b border-[var(--border)] bg-[var(--background)]">
              <Search className="w-5 h-5 text-[var(--primary)] mr-3" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search subjects (e.g. Data Structures)..."
                className="flex-1 bg-transparent border-none outline-none text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] text-lg"
              />
              <button onClick={() => setIsOpen(false)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto p-2 bg-[var(--card)]">
              {query.length > 0 && filteredSubjects.length === 0 ? (
                <p className="text-center text-[var(--muted-foreground)] py-8">No results found.</p>
              ) : (
                <ul className="space-y-1">
                  {filteredSubjects.map((subject) => (
                    <li key={subject.id}>
                      <button
                        onClick={() => handleSelect(subject.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-[var(--card-hover)] group transition-colors"
                      >
                        <div className="bg-[var(--background)] p-2 rounded-md border border-[var(--border)] group-hover:border-[var(--primary)] text-[var(--primary)] transition-colors">
                          <Book className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                            {subject.name}
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)]">{subject.code}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {query.length === 0 && (
                <div className="px-4 py-8 text-center text-[var(--muted-foreground)]">
                  <p>Type to start searching across all subjects...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
