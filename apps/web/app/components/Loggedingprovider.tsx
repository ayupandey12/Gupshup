"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthHydrated } from "../lib/store/useAuthhydration";
export const Loggedingprovider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { user, isInitialized, checkAuth } = useAuthHydrated();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (isInitialized && !user) {
            router.push("/signin");
        }
    }, [isInitialized, user, router]);

    useEffect(() => {
        if (user && user.username !== window.location.pathname.split("/")[2]) {
            router.push("/dashboard/" + user.username);
        }
    }, [user, router]);

    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Loading</p>
                    <h1 className="mt-4 text-2xl font-semibold text-slate-950">Checking authentication…</h1>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect via useEffect
    }

    if (user.username !== window.location.pathname.split("/")[2]) {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8">
            <div className="mx-auto w-full max-w-6xl rounded-4xl border border-slate-200 bg-white/95 p-8 shadow-[0_35px_80px_rgba(15,23,42,0.08)]">
                <div className="mb-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-500">Welcome back</p>
                    <h1 className="mt-3 text-3xl font-semibold text-slate-950">Welcome to your dashboard, {user.username}!</h1>
                </div>
                {children}
            </div>
        </div>
    );
}