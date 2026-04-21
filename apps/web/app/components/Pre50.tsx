"use client";
import { use } from "react";
import { useAuthStore } from "../lib/store/useAuthStore"; 

export const Pre50 = ({ messagePromise }: { messagePromise: Promise<any[]> }) => {
    // RESOLVE the promise here using use()
    const messages = use(messagePromise);
    const currentUser = useAuthStore((state) => state.user?.userId);

    return (
        <div className="space-y-3">
            {messages.length > 0 && (
                <div className="flex items-center gap-2 py-4">
                    <div className="flex-1 h-[1px] bg-gray-200"></div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">History</span>
                    <div className="flex-1 h-[1px] bg-gray-200"></div>
                </div>
            )}

            {messages.map((msg: any) => {
                const isMe = msg.userId === currentUser;
                return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3 rounded-2xl shadow-sm border max-w-[85%] 
                            ${isMe ? 'bg-blue-600 text-white border-blue-700 rounded-tr-none' : 'bg-white text-gray-800 border-gray-200 rounded-tl-none'}`}>
                            <span className={`text-[10px] uppercase font-black mb-1 block ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                                {isMe ? 'You' : msg.user.name || `User ${msg.userId?.slice(-4)}`}
                            </span>
                            <p className="text-sm leading-tight">{msg.message}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
