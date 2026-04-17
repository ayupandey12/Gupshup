"use client";
import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { useParams, useRouter } from "next/navigation";
import { verifyRoomExists } from "../../lib/actions/Room";

const RoomWithId = () => {
  const token = useAuthStore((state) => state.token);
  // Get username from store to build the dashboard path
  const username = useAuthStore((state) => state.user?.username);
  
  const params = useParams();
  const router = useRouter();
  const roomId = Number(params.roomid);

  const socketRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [sendmessage, setsendmessage] = useState<string>("");
  const [isValidating, setIsValidating] = useState(true);

  // 1. Validate Room Existence & User Session
  useEffect(() => {
    async function checkRoom() {
      // If no token, they aren't logged in
      if (!token) {
        router.push("/signin");
        return;
      }

      // If room ID is not a number, go back to user dashboard
      if (isNaN(roomId)) {
        if (username) router.push(`/dashboard/${username}`);
        return;
      }

      try {
        const exists = await verifyRoomExists(roomId);
        if (!exists) {
          // If room doesn't exist, redirect to their specific dashboard
          if (username) router.push(`/dashboard/${username}`);
        } else {
          setIsValidating(false);
        }
      } catch (error) {
        console.error("Validation error:", error);
        if (username) router.push(`/dashboard/${username}`);
      }
    }
    
    // Only run check if we have the username (ensures store is hydrated)
    if (username !== undefined) {
        checkRoom();
    }
  }, [roomId, router, token, username]);

  // 2. WebSocket Connection
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

  // 3. Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
        <div className="text-lg animate-pulse font-semibold text-gray-500">
          Entering Room {roomId}...
        </div>
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
          Back to Dashboard
        </button>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3"
      >
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-10">No messages here yet.</p>
        )}
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 max-w-[85%] self-start">
               <span className="text-[10px] uppercase font-black text-gray-400 mb-1 block">
                User {msg.userId?.slice(-4) || '??'}
              </span>
              <p className="text-gray-800">{msg.message}</p>
            </div>
          </div>
        ))}
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
          className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default RoomWithId;
