import { Findallrooms } from "../lib/actions/Findallrooms";
export const Roomssection = async () => {
    const { rooms } = await Findallrooms();
    return (
        <section className="space-y-6 rounded-4xl border border-slate-200 bg-white/90 p-6 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-500">Rooms</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950">Available rooms</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">{rooms?.length ?? 0} rooms</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                {rooms?.map((room) => (
                    <div key={room.id} className="rounded-[1.75rem] border border-slate-200 bg-[#f8f1e8] p-5 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-950">{room.name}</h3>
                        <p className="mt-2 text-sm text-slate-600">Room ID: {room.id}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};