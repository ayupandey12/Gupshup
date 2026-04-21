"use client";
import Navbar from "./components/NavbarLinks";
import { useAuthStore } from "./lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleAuthAction = () => {
        if (user) {
            logout();
            router.push('/signin');
        } else {
            router.push('/signin');
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#f6efe4] font-sans text-slate-900">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-12 lg:py-16">
                <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <section className="space-y-8">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#fff6ec] px-4 py-2 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                            Chat app design inspired by modern messenger layouts.
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                                Chat faster, feel closer.
                            </h1>
                            <p className="max-w-xl text-base leading-8 text-slate-700 sm:text-lg">
                                Build conversations that feel polished and calm. Light neutrals, soft gradients, and rounded chat cards create the warm app experience you want.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm">
                                <h2 className="text-base font-semibold text-slate-900">Realtime chat</h2>
                                <p className="mt-3 text-sm leading-6 text-slate-600">Send messages instantly, with a friendly chat bubble style and smooth interactions.</p>
                            </div>
                            <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm">
                                <h2 className="text-base font-semibold text-slate-900">Clear onboarding</h2>
                                <p className="mt-3 text-sm leading-6 text-slate-600">Login, create rooms, and join chats with clean, minimal screens.</p>
                            </div>
                        </div>

                        <button
                            onClick={handleAuthAction}
                            className="inline-flex items-center gap-3 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.15)] transition hover:bg-slate-800"
                        >
                            {user ? 'Logout' : 'Sign In'}
                        </button>
                    </section>

                    <section className="relative grid place-items-center">
                        <div className="w-full max-w-md rounded-[3rem] border border-slate-200 bg-[#fff8ed] p-6 shadow-[0_40px_80px_rgba(15,23,42,0.08)]">
                            <div className="mb-6 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-500">Active Chat</p>
                                        <h3 className="mt-3 text-xl font-bold text-slate-950">Gupshup</h3>
                                    </div>
                                    <div className="h-10 w-10 rounded-2xl bg-amber-100" />
                                </div>

                                <div className="mt-8 space-y-3">
                                    <div className="rounded-3xl bg-[#f3e6d8] px-4 py-3 text-sm text-slate-800 shadow-sm">
                                        <p className="font-semibold">Hello! Ready to share your first message?</p>
                                    </div>
                                    <div className="rounded-3xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                                        <p>Yes, I’m excited to chat with my team right now.</p>
                                    </div>
                                    <div className="rounded-3xl bg-[#f3e6d8] px-4 py-3 text-sm text-slate-700 shadow-sm text-right">
                                        <p>That’s the energy! Let’s keep the conversation going.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-500">
                                    <span>Chat history</span>
                                    <span>50 msgs</span>
                                </div>
                                <div className="mt-4 grid gap-3">
                                    {[...Array(3)].map((_, index) => (
                                        <div key={index} className="h-3 rounded-full bg-slate-200/80" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

