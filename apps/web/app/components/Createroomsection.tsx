"use client"
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Createroom } from "../lib/actions/Createroom";
import { useAuthStore } from "../lib/store/useAuthStore";
import { redirect } from "next/navigation";

export const Createroomsection=()=>{
    const [roomname,setroomname]=useState<string>("");
    const [mes,setmes]=useState<string>("");
    const [error,seterror]=useState<boolean>(false);
    const userId=useAuthStore((state)=>state.user?.userId);
    if(!userId){
        redirect("/signin");
    }
    return (
        <>
        <form action={async()=>{
             const {room,mess}= await Createroom({name:roomname,adminId:userId});
                if(room){   
                    setroomname("");
                    seterror(false);
                    setmes(mess);
                }
                else{
                    seterror(true);
                    setmes(mess);
                }
        }}>
            <input type="text" value={roomname} onChange={(e)=>setroomname(e.target.value)} placeholder="Enter room name" required/>
            {error && <p className="text-red-500">{mes}</p>}
            {!error && mes && <p className="text-green-500">{mes}</p>}
            <Buttoninput/>
        </form>
        </>
    )
}
export const Buttoninput=()=>{
   const {pending} =useFormStatus();
   return (
    <button type="submit" disabled={pending} className={`w-full mt-6 py-3.5 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all shadow-md active:scale-95 
    ${pending 
        ? "bg-gray-400 cursor-not-allowed text-white" 
        : "bg-black hover:bg-gray-800 text-white"}`}>
        {pending?"Creating...":"Create Room"}
    </button>
   )
}