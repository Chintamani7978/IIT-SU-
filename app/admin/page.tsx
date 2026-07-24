import { ArrowUpRight, FileText, FileQuestion, Users, Activity, CheckCircle2, Clock } from 'lucide-react';
import { RESOURCES } from '@/lib/mockDb';

export default function Home() {
  const totalNotes = RESOURCES.filter(r => r.type === 'note').length;
  const totalPyqs = RESOURCES.filter(r => r.type === 'pyq').length;
  const pendingUploads = RESOURCES.filter(r => r.status === 'pending').length;
  const approvedUploads = RESOURCES.filter(r => r.status === 'approved').length;

  const stats = [
    { label: 'Total Notes', value: totalNotes.toString(), icon: FileText, color: 'text-blue-400' },
    { label: 'PYQs Available', value: totalPyqs.toString(), icon: FileQuestion, color: 'text-purple-400' },
    { label: 'Approved Resources', value: approvedUploads.toString(), icon: CheckCircle2, color: 'text-green-400' },
    { label: 'Pending Review', value: pendingUploads.toString(), icon: Clock, color: 'text-amber-400' },
  ];

  const recentUploads = [...RESOURCES].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">System Overview</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Real-time statistics of the e-learning platform</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="dash-card p-6 flex flex-col justify-between hover:border-[var(--primary)]/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-[var(--muted-foreground)]">{stat.label}</h3>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-4xl font-bold text-[var(--foreground)] tracking-tight mb-2">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recently Uploaded List (Customer list style) */}
      <div className="dash-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Recently Uploaded</h3>
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
              {recentUploads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[var(--muted-foreground)]">No resources uploaded yet.</td>
                </tr>
              ) : (
                recentUploads.map((r, i) => (
                  <tr key={r.id} className="hover:bg-[var(--card-hover)] transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          r.type === 'note' ? 'bg-blue-500/20 text-blue-400' :
                          r.type === 'pyq' ? 'bg-purple-500/20 text-purple-400' :
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
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
