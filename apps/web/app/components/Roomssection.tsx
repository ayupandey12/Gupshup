"use client";
import { useEffect, useState } from "react";

type Room = {
    id: number;
    name: string;
};

export const Roomssection = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch('/api/rooms');
                const data = await response.json();
                setRooms(data.rooms ?? []);
            } catch (error) {
                console.error('Failed to load rooms:', error);
                setRooms([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    return (
        <section className="space-y-6 rounded-4xl border border-slate-200 bg-white/90 p-6 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-500">Rooms</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950">Available rooms</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">{loading ? 'Loading...' : `${rooms.length} rooms`}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                {rooms.map((room) => (
                    <div key={room.id} className="rounded-[1.75rem] border border-slate-200 bg-[#f8f1e8] p-5 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-950">{room.name}</h3>
                        <p className="mt-2 text-sm text-slate-600">Room ID: {room.id}</p>
                    </div>
                ))}
                {!loading && rooms.length === 0 && (
                    <div className="rounded-[1.75rem] border border-slate-200 bg-[#f8f1e8] p-5 shadow-sm text-slate-600">
                        No rooms available yet.
                    </div>
                )}
            </div>
        </section>
    );
};