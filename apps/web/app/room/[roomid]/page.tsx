"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { useParams, useRouter } from "next/navigation";
import { verifyRoomExists } from "../../lib/actions/Room";
import { Previous50 } from "../../lib/actions/Previous50";
import { Pre50 } from "../../components/Pre50";

const RoomWithId = () => {
  const token = useAuthStore((state) => state.token);
  const username = useAuthStore((state) => state.user?.username);
  const logout = useAuthStore((state) => state.logout);
  const params = useParams();
  const router = useRouter();
  const roomId = Number(params.roomid);

  const socketRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [sendmessage, setsendmessage] = useState<string>("");
  const [isValidating, setIsValidating] = useState(true);
  
  // 🔥 FIX: Use State instead of useMemo to hold the Promise
  const [historyPromise, setHistoryPromise] = useState<Promise<any[]> | null>(null);

  // 1. Validation Logic
  useEffect(() => {
    async function checkRoom() {
      if (!token) { router.push("/signin"); return; }
      if (isNaN(roomId)) { if (username) router.push(`/dashboard/${username}`); return; }
      try {
        const exists = await verifyRoomExists(roomId);
        if (!exists) {
          if (username) router.push(`/dashboard/${username}`);
        } else {
          setIsValidating(false);
          // 🔥 FIX: Trigger the Server Action here, safely after render
          setHistoryPromise(Previous50(roomId));
        }
      } catch (error) {
        if (username) router.push(`/dashboard/${username}`);
      }
    }
    if (username !== undefined) checkRoom();
  }, [roomId, router, token, username]);

  // 2. WebSocket Logic
  useEffect(() => {
    if (isValidating || !token || isNaN(roomId)) return;

    const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
    socketRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join_room", roomId }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "chat") {
          setMessages((prev) => [...prev, data]);
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "leave_room", roomId }));
      }
      ws.close();
      socketRef.current = null;
    };
  }, [token, roomId, isValidating]);

  // 3. Scroll Logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isValidating]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const socket = socketRef.current;
    if (socket?.readyState === WebSocket.OPEN && sendmessage.trim() !== "") {
      const outboundMessage = {
        type: "chat",
        roomId: roomId,
        message: sendmessage,
      };
      socket.send(JSON.stringify(outboundMessage));
      setMessages((prev) => [
        ...prev,
        {
          type: "chat",
          roomId,
          message: sendmessage,
          userId: username,
          username: username,
          pending: true,
        },
      ]);
      setsendmessage("");
    }
  };

  if (isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
          <div className="text-sm uppercase tracking-[0.28em] text-slate-400">Loading room</div>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950">Entering Room #{roomId}</h1>
          <p className="mt-3 text-sm text-slate-600">Hang tight while we fetch your chat history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto flex h-[calc(100vh-3rem)] max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_35px_90px_rgba(15,23,42,0.08)]">
        <header className="flex flex-col gap-4 border-b border-slate-200 bg-[#f8f3eb] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Classic chat room</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">Room #{roomId}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
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
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto w-full max-w-3xl space-y-3">
            <Suspense fallback={<div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-6 text-center text-sm text-slate-500">Loading history…</div>}>
              {historyPromise && <Pre50 messagePromise={historyPromise} />}
            </Suspense>

            {messages.map((msg, index) => {
              const isMe = msg.userId === username;
              return (
                <div key={`live-${index}`} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-[1.75rem] border px-5 py-4 shadow-sm ${isMe ? 'bg-slate-950 text-white border-slate-900' : 'bg-slate-100 text-slate-900 border-slate-200'}`}>
                    <span className={`block text-[10px] uppercase tracking-[0.24em] ${isMe ? 'text-slate-400' : 'text-slate-500'}`}>
                      {isMe ? 'You' : msg.username || `User ${msg.userId?.slice(-4) || '??'}`}
                    </span>
                    <p className="mt-2 text-sm leading-6">{msg.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <form className="border-t border-slate-200 bg-slate-50 px-6 py-5" onSubmit={handleSendMessage}>
          <div className="mx-auto flex max-w-5xl gap-3 rounded-full bg-white p-3 shadow-inner shadow-slate-200/70">
            <input
              type="text"
              value={sendmessage}
              onChange={(e) => setsendmessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-amber-200"
            />
            <button
              type="submit"
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomWithId;
