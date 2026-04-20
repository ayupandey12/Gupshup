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
      socket.send(JSON.stringify({
        type: "chat",
        roomId: roomId,
        message: sendmessage,
      }));
      setsendmessage("");
    }
  };

  if (isValidating) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg animate-pulse font-semibold text-gray-500">Entering Room...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-screen border-x bg-white">
      <header className="p-4 border-b flex justify-between items-center bg-white shadow-sm">
        <h1 className="text-xl font-bold">Room #{roomId}</h1>
        <button 
          onClick={() => router.push(`/dashboard/${username}`)}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Back
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
        {/* 🔥 FIX: Only render Pre50 once the promise exists */}
        <Suspense fallback={<p className="text-center text-gray-400 text-xs py-4">Loading history...</p>}>
           {historyPromise && <Pre50 messagePromise={historyPromise} />}
        </Suspense>

        {messages.map((msg, index) => {
          const isMe = msg.userId === username;
          return (
            <div key={`live-${index}`} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className={`p-3 rounded-lg shadow-sm border max-w-[85%] ${isMe ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                <span className={`text-[10px] uppercase font-black mb-1 block ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                  {isMe ? "You" : `User ${msg.userId?.slice(-4) || '??'}`}
                </span>
                <p>{msg.message}</p>
              </div>
            </div>
          );
        })}
      </div>

      <form className="p-4 border-t flex gap-2 bg-white" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={sendmessage}
          onChange={(e) => setsendmessage(e.target.value)}
          placeholder="Message room..."
          className="flex-1 border p-2 px-4 rounded-full bg-gray-100 outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default RoomWithId;
