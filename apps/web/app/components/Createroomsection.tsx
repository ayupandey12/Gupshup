"use client"
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Createroom } from "../lib/actions/Createroom";
import { useAuthStore } from "../lib/store/useAuthStore";
import { redirect } from "next/navigation";

export const Createroomsection = () => {
    const [roomname, setroomname] = useState<string>("");
    const [mes, setmes] = useState<string>("");
    const [error, seterror] = useState<boolean>(false);
    const userId = useAuthStore((state) => state.user?.userId);
    if (!userId) {
        redirect("/signin");
    }

    return (
        <section className="rounded-4xl border border-slate-200 bg-white/90 p-6 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-6 space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-500">Create Room</p>
                <h3 className="text-xl font-semibold text-slate-950">Add a new chat room</h3>
                <p className="text-sm leading-6 text-slate-600">Give your room a memorable name and start chatting right away.</p>
            </div>

            <form action={async () => {
                const { room, mess } = await Createroom({ name: roomname, adminId: userId });
                if (room) {
                    setroomname("");
                    seterror(false);
                    setmes(mess);
                } else {
                    seterror(true);
                    setmes(mess);
                }
            }}>
                <input
                    type="text"
                    value={roomname}
                    onChange={(e) => setroomname(e.target.value)}
                    placeholder="Enter room name"
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-[#fbf5ed] px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-amber-200 outline-none"
                />
                <div className="mt-3 min-h-[1.5rem] text-sm">
                    {error ? <p className="text-red-600">{mes}</p> : mes ? <p className="text-emerald-600">{mes}</p> : null}
                </div>
                <Buttoninput />
            </form>
        </section>
    );
}
export const Buttoninput = () => {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full mt-6 rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] transition ${pending ? 'bg-slate-300 cursor-not-allowed text-slate-600' : 'bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.15)] hover:bg-slate-800'}`}
        >
            {pending ? "Creating..." : "Create Room"}
        </button>
    );   }
    