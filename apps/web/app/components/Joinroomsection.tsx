"use client"
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Joinroom } from "../lib/actions/Joinroom";
export const Joinroomsection=()=>{
    const [roomname,setroomname]=useState<string>("");
    return (
        <>
        <form action={async()=>{
            const {room,mess}=await Joinroom({roomname:roomname});
            if(!room){
                setroomname("");
                alert(mess);
            }
        }}>
            <input type="text" value={roomname} onChange={(e)=>setroomname(e.target.value)} placeholder="Enter Room Name" />
            <Buttoninput/>
        </form>
        </>
    )
}
const Buttoninput=()=>{
    const {pending} =useFormStatus();
    return (
        <button type="submit" disabled={pending} className={`w-full mt-6 py-3.5 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all shadow-md active:scale-95`}>
        {pending?"Joining...":"Join Room"}
        </button>
    )
}