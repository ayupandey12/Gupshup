"use client";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
        <div className="text-sm uppercase tracking-[0.28em] text-slate-400">404</div>
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">Page not found</h1>
        <p className="mt-3 text-sm text-slate-600">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}