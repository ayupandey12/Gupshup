"use client"
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Joinroom } from "../lib/actions/Joinroom";
export const Joinroomsection = () => {
    const [roomname, setroomname] = useState<string>("");
    return (
        <section className="rounded-4xl border border-slate-200 bg-white/90 p-6 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-6 space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-500">Join Room</p>
                <h3 className="text-xl font-semibold text-slate-950">Enter room name</h3>
                <p className="text-sm leading-6 text-slate-600">Join an existing chat room and continue the conversation.</p>
            </div>

            <form action={async () => {
                const { room, mess } = await Joinroom({ roomname: roomname });
                if (!room) {
                    setroomname("");
                    alert(mess);
                }
            }}>
                <input
                    type="text"
                    value={roomname}
                    onChange={(e) => setroomname(e.target.value)}
                    placeholder="Enter room name"
                    className="w-full rounded-3xl border border-slate-200 bg-[#fbf5ed] px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-amber-200 outline-none"
                />
                <Buttoninput />
            </form>
        </section>
    );
}
const Buttoninput = () => {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full mt-6 rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] transition ${pending ? 'bg-slate-300 cursor-not-allowed text-slate-600' : 'bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.15)] hover:bg-slate-800'}`}
        >
            {pending ? "Joining..." : "Join Room"}
        </button>
    );
}