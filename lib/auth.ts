import 'server-only';
import { createClient, isSupabaseConfigured } from './supabase/server';

export type Role = 'student' | 'moderator' | 'admin';

export interface CurrentUser {
  id: string;
  email: string | undefined;
  name: string | null;
  batch: string | null;
  role: Role;
}

// Returns the signed-in user with their profile row, or null.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, batch, role')
    .eq('id', user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email,
    name: profile?.name ?? null,
    batch: profile?.batch ?? null,
    role: (profile?.role as Role) ?? 'student',
  };
}

export function isModerator(user: CurrentUser | null): boolean {
  return user?.role === 'moderator' || user?.role === 'admin';
}
