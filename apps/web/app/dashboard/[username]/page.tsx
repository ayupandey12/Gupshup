"use client";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Roomssection } from "../../components/Roomssection";
import { Loggedingprovider } from "../../components/Loggedingprovider";
import { Createroomsection } from "../../components/Createroomsection";
import { Joinroomsection } from "../../components/Joinroomsection";

const dashboard = () => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();

    return (
        <>
            <Loggedingprovider>
                <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_35px_80px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-amber-500">Dashboard</p>
                        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Welcome back{user ? `, ${user.username}` : ''}.</h1>
                        <p className="mt-2 text-sm leading-6 text-slate-600">Manage rooms, join chats, and keep your conversations flowing.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => router.push('/')}
                            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
                        >
                            Home
                        </button>
                        <button
                            onClick={() => {
                                logout();
                                router.push('/signin');
                            }}
                            className="rounded-full border border-amber-400 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
                        >
                            Logout
                        </button>
                    </div>
                </div>
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-8">
                        <Roomssection />
                    </div>
                    <div className="space-y-8">
                        <Createroomsection />
                        <Joinroomsection />
                    </div>
                </div>
            </Loggedingprovider>
        </>
    );
};

export default dashboard;