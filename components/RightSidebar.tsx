'use client';

import { UserPlus, ShoppingCart, DollarSign, MessageSquare, PlusCircle, Bell, Globe } from 'lucide-react';
import { getPendingResources } from '@/lib/mockDb';

export default function RightSidebar() {
  const pendingCount = getPendingResources().length;

  const notifications = [
    { id: 1, text: '56 New users registered.', time: 'Just now', icon: UserPlus, color: 'text-green-400' },
    { id: 2, text: '132 Resources downloaded.', time: '59 Minutes ago', icon: ShoppingCart, color: 'text-emerald-400' },
    { id: 3, text: 'System maintenance scheduled.', time: '12 Hours ago', icon: Globe, color: 'text-teal-400' },
    { id: 4, text: `${pendingCount} Pending uploads for moderation.`, time: 'Today, 11:59 PM', icon: MessageSquare, color: 'text-[var(--primary)]' },
  ];

  const activities = [
    { id: 1, text: 'Changed the style.', time: 'Just now', color: 'bg-purple-500' },
    { id: 2, text: '17 New PYQs added.', time: '47 Minutes ago', color: 'bg-red-500' },
    { id: 3, text: '11 Notes have been archived.', time: '1 Days ago', color: 'bg-yellow-500' },
  ];

  const contacts = [
    { name: 'Daniel Craig', img: 'bg-orange-500', isOnline: true },
    { name: 'Kate Morrison', img: 'bg-pink-500', isOnline: false },
    { name: 'Nataniel Donovan', img: 'bg-purple-500', isOnline: true, active: true },
    { name: 'Elisabeth Wayne', img: 'bg-blue-500', isOnline: true },
    { name: 'Felicia Respet', img: 'bg-emerald-500', isOnline: false },
  ];

  return (
    <aside className="w-72 border-l border-[var(--border)] bg-[var(--background)] hidden xl:flex flex-col h-full overflow-y-auto p-6">
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Notifications</h3>
        <div className="space-y-4">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div key={n.id} className="flex gap-3">
                <div className="mt-0.5 p-1 rounded-full bg-[var(--card)] border border-[var(--border)] h-fit">
                  <Icon className={`w-3.5 h-3.5 ${n.color}`} />
                </div>
                <div>
                  <p className="text-sm text-[var(--foreground)] leading-tight">{n.text}</p>
                  <p className="text-[10px] text-[var(--muted-foreground)] mt-1">{n.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-8 border-t border-[var(--border)] pt-6">
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Activities</h3>
        <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-[var(--border)]">
          {activities.map((act) => (
            <div key={act.id} className="flex gap-4 relative">
              <div className={`w-[22px] h-[22px] shrink-0 rounded-full ${act.color} ring-4 ring-[var(--background)] flex items-center justify-center text-white text-[8px] font-bold`}>
                K
              </div>
              <div>
                <p className="text-sm text-[var(--foreground)] leading-tight">{act.text}</p>
                <p className="text-[10px] text-[var(--muted-foreground)] mt-1">{act.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--border)] pt-6">
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Contacts of your managers</h3>
        <div className="space-y-2">
          {contacts.map((contact, idx) => (
            <div 
              key={idx} 
              className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${
                contact.active ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'hover:bg-[var(--card)] text-[var(--foreground)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full ${contact.img} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                    {contact.name.charAt(0)}
                  </div>
                  {contact.isOnline && (
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[var(--background)] ${contact.active ? 'bg-[var(--primary-foreground)]' : 'bg-green-500'}`}></span>
                  )}
                </div>
                <span className="text-sm font-medium text-inherit truncate w-24">{contact.name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {contact.active && (
                  <>
                    <MessageSquare className="w-4 h-4 opacity-80 hover:opacity-100" />
                    <DollarSign className="w-4 h-4 opacity-80 hover:opacity-100" />
                  </>
                )}
                {!contact.active && <span className="text-[var(--muted-foreground)] text-xs tracking-widest">•••</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
