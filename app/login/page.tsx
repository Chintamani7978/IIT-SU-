'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, LogIn } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function LoginCard() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/';
  const authError = searchParams.get('error');
  const [error, setError] = useState<string | null>(
    authError ? 'Sign-in failed. Please try again.' : null
  );
  const [loading, setLoading] = useState(false);

  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
      <div className="w-full max-w-sm bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 space-y-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Sign in</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-2">
            Sign in to upload resources, vote, and track your submissions.
          </p>
        </div>

        {configured ? (
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--neon-hover)] text-[var(--primary-foreground)] font-bold py-2.5 rounded-md transition-colors disabled:opacity-60"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Redirecting…' : 'Continue with Google'}
          </button>
        ) : (
          <p className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md p-3">
            Sign-in is not available yet — the Supabase backend has not been
            configured. See <code>supabase/README.md</code>.
          </p>
        )}

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md p-3">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginCard />
    </Suspense>
  );
}
