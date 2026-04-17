"use server"
import { prisma } from "@repo/db";
import { redirect } from "next/navigation";
export const Joinroom=async({roomname}:{roomname:string})=>{
   const room=await prisma.room.findFirst({
    where:{
        name:roomname   
    }   })
   if(!room){
    return {room:null,mess:"no room with this name exists!"}
   }
   redirect("/room/"+room.id);
}