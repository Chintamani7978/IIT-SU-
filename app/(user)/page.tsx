import { Search, Trophy, UploadCloud } from 'lucide-react';
import LandingAccordion from '@/components/LandingAccordion';

export default function UserLandingPage() {
  return (
    <div className="flex flex-col py-0 md:py-2">
      
      {/* Hero Section */}
      <div className="text-center max-w-5xl mx-auto mb-4 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/5 text-[var(--primary)] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 mx-auto border border-[var(--primary)]/20 shadow-[0_0_20px_rgba(204,255,0,0.1)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-ping"></span>
          IIT SU E-Learning
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] tracking-tighter mb-3 leading-tight">
          Master Your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--primary)] via-emerald-300 to-teal-600 drop-shadow-[0_0_40px_rgba(204,255,0,0.2)]">
            Engineering Studies
          </span>
        </h1>
        
        <p className="text-sm md:text-base text-zinc-400 font-light mb-6 max-w-xl mx-auto leading-relaxed tracking-wide">
          The ultimate resource hub for IIT SU students. Access verified notes, PYQs, and curated video lectures.
        </p>

        {/* Centralized Search Bar */}
        <div className="max-w-2xl mx-auto relative group mb-0">
          <div className="absolute inset-0 bg-[var(--primary)]/10 rounded-3xl blur-2xl group-hover:bg-[var(--primary)]/20 transition-all duration-700 -z-10"></div>
          <div className="relative flex items-center bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl overflow-hidden focus-within:border-[var(--primary)]/40 focus-within:bg-zinc-900/80 transition-all duration-500">
            <div className="pl-4 pr-3 text-zinc-500 group-focus-within:text-[var(--primary)] transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              placeholder="Search Subject or Topic..." 
              className="flex-1 bg-transparent border-none outline-none text-[var(--foreground)] placeholder:text-zinc-600 py-1.5 text-sm font-light tracking-wide"
            />
            <button className="hidden md:flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-zinc-400 px-3 py-1.5 rounded-xl text-[9px] font-semibold tracking-wider uppercase transition-colors border border-white/5 mr-1">
              <kbd className="font-mono text-[8px] bg-black/40 px-1 py-0.5 rounded">Ctrl</kbd>
              <kbd className="font-mono text-[8px] bg-black/40 px-1 py-0.5 rounded">K</kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Action Workflow (Accordion) */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4">
        <LandingAccordion />
      </div>

      {/* Lower Section: Secondary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-32 w-full px-4">
        {/* Quick Actions */}
        <div className="dash-card p-8 rounded-[2rem] border border-white/5 bg-zinc-900/30 hover:bg-zinc-900/60 backdrop-blur-sm transition-all duration-500 group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/10 blur-[80px] rounded-full group-hover:bg-[var(--primary)]/20 transition-colors translate-x-1/2 -translate-y-1/2"></div>
          <div className="w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center text-[var(--primary)] mb-6 border border-white/5 shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-2xl text-[var(--foreground)] mb-3 tracking-tight">Contribute Notes</h3>
          <p className="text-base text-zinc-400 font-light leading-relaxed">Upload your handwritten notes or PYQ solutions to help your juniors and build your reputation.</p>
        </div>

        {/* Top Contributors */}
        <div className="dash-card p-8 rounded-[2rem] border border-white/5 bg-zinc-900/30 hover:bg-zinc-900/60 backdrop-blur-sm transition-all duration-500 group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full group-hover:bg-amber-500/20 transition-colors translate-x-1/2 -translate-y-1/2"></div>
          <div className="w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center text-amber-400 mb-6 border border-white/5 shadow-inner">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-2xl text-[var(--foreground)] mb-3 tracking-tight">Top Contributors</h3>
          <p className="text-base text-zinc-400 font-light leading-relaxed">View the leaderboard of brilliant students who have contributed the most this semester.</p>
        </div>
      </div>
      
    </div>
  );
}
