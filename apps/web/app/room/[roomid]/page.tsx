"use client"
import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { useParams } from "next/navigation";

const RoomWithId = () => {
    const token = useAuthStore((state) => state.token);
    const params = useParams(); 
    const roomId = Number(params.roomid); 
    
    const socketRef = useRef<WebSocket | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null); // For auto-scroll

    const [messages, setMessages] = useState<any[]>([]);
    const [sendmessage, setsendmessage] = useState<string>("");

    // 1. Auto-scroll to bottom whenever messages update
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (!token || isNaN(roomId)) return;

        const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("ws connected");
            ws.send(JSON.stringify({
                type: "join_room",
                roomId: roomId 
            }));
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
                ws.send(JSON.stringify({
                    type: "leave_room",
                    roomId: roomId
                }));
            }
            ws.close();
            socketRef.current = null;
        };
    }, [token, roomId]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const socket = socketRef.current;
        
        if (socket && socket.readyState === WebSocket.OPEN && sendmessage.trim() !== "") {
            socket.send(JSON.stringify({
                type: "chat",
                roomId: roomId, 
                message: sendmessage   
            }));
            setsendmessage("");
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto flex flex-col h-screen">
            <h1 className="text-xl font-bold border-b pb-2">Room: {roomId}</h1>
            
            {/* Scroll Container */}
            <div 
                ref={scrollRef}
                className="flex-1 mt-4 border p-4 overflow-y-auto bg-gray-50 rounded"
            >
                {messages.length === 0 && <p className="text-gray-400 text-center">No messages yet...</p>}
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2 p-2 bg-white rounded shadow-sm">
                        <span className="font-bold text-blue-600">User: </span>
                        {msg.message}
                    </div>
                ))}
            </div>

            <form className="mt-4 flex gap-2" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={sendmessage}
                    onChange={(e) => setsendmessage(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 border p-2 rounded focus:outline-blue-500"
                />
                <button type="submit" className="bg-black text-white px-6 py-2 rounded font-bold hover:bg-gray-800 transition">
                    Send
                </button>
            </form>
        </div>
    );
};

export default RoomWithId;
