import { ArrowUpRight, FileText, FileQuestion, Users, Activity } from 'lucide-react';
import { RESOURCES } from '@/lib/mockDb';

export default function Home() {
  const stats = [
    { label: 'Total Notes', value: '4,201', change: '+12% vs last month', isPositive: true },
    { label: 'PYQs Available', value: '1,842', change: '+5% vs last month', isPositive: true },
    { label: 'Active Students', value: '8,421', change: '+2% vs last month', isPositive: true },
    { label: 'New Uploads', value: '142', change: '-3% vs last month', isPositive: false },
  ];

  const recentUploads = [...RESOURCES].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Overview</h1>
        <select className="bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-[var(--primary)]">
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="dash-card p-6 flex flex-col justify-between">
            <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-4">{stat.label}</h3>
            <div>
              <p className="text-3xl font-bold text-[var(--foreground)] tracking-tight mb-2">{stat.value}</p>
              <p className={`text-xs flex items-center gap-1 ${stat.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                <ArrowUpRight className={`w-3 h-3 ${!stat.isPositive && 'rotate-90'}`} />
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resource Activity Chart Area */}
        <div className="lg:col-span-2 dash-card p-6 flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Resource Activity</h3>
            <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
              •••
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center border border-dashed border-[var(--border)] rounded-xl relative overflow-hidden bg-[var(--background)]">
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(204,255,0,0.05)] to-transparent pointer-events-none"></div>
            {/* Mock Chart Visual */}
            <div className="w-48 h-48 rounded-full border-[16px] border-[var(--primary)] border-r-[var(--card)] flex items-center justify-center shadow-[0_0_30px_rgba(204,255,0,0.15)]">
              <div className="text-center">
                <p className="text-2xl font-bold text-[var(--foreground)]">102k</p>
                <p className="text-xs text-[var(--muted-foreground)]">Weekly Visits</p>
              </div>
            </div>
          </div>
        </div>

        {/* Small Data Cards */}
        <div className="space-y-6 flex flex-col">
          <div className="dash-card p-6 flex-1 flex flex-col">
             <div className="flex items-center justify-between mb-4">
               <div className="w-8 h-8 rounded-lg bg-[var(--card-hover)] flex items-center justify-center text-[var(--primary)]">
                 <Users className="w-4 h-4" />
               </div>
             </div>
             <p className="text-sm text-[var(--muted-foreground)]">New Signups</p>
             <p className="text-2xl font-bold text-[var(--foreground)] mt-1">862 <span className="text-xs text-red-400 font-normal ml-1">-8%</span></p>
          </div>
          
          <div className="dash-card p-6 flex-1 flex flex-col bg-gradient-to-br from-[var(--card)] to-[rgba(204,255,0,0.05)] border-[var(--primary)]/20 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--primary)]/10 rounded-full blur-2xl group-hover:bg-[var(--primary)]/20 transition-all duration-500"></div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse"></span>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Premium Features</h3>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mb-4">Access ad-free resources and unlimited downloads.</p>
            <p className="text-3xl font-bold text-[var(--foreground)] mb-6">$30 <span className="text-sm text-[var(--muted-foreground)] font-normal">/ Year</span></p>
            <button className="w-full py-2 bg-[var(--primary)] hover:bg-[var(--neon-hover)] text-[var(--primary-foreground)] font-bold rounded-lg transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>

      {/* Recently Uploaded List (Customer list style) */}
      <div className="dash-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Recently Uploaded</h3>
          <button className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">•••</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider border-b border-[var(--border)]">
              <tr>
                <th className="px-4 py-3 font-medium">Resource Title</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {recentUploads.map((r, i) => (
                <tr key={r.id} className="hover:bg-[var(--card-hover)] transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        i % 3 === 0 ? 'bg-purple-500/20 text-purple-400' :
                        i % 3 === 1 ? 'bg-cyan-500/20 text-cyan-400' :
                        'bg-pink-500/20 text-pink-400'
                      }`}>
                        {r.type === 'note' ? <FileText className="w-4 h-4" /> : <FileQuestion className="w-4 h-4" />}
                      </div>
                      <div className="font-medium text-[var(--foreground)]">{r.title}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[var(--muted-foreground)] uppercase text-xs">{r.type}</td>
                  <td className="px-4 py-4 text-[var(--muted-foreground)]">{r.authorName}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs rounded border ${
                      r.status === 'approved' 
                        ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                        : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
