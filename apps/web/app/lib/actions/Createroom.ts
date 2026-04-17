'use server'
import {prisma} from "@repo/db"
export const Createroom=async({name,adminId}:{name:string,adminId:string})=>{
    try {
        const room=await prisma.room.create({
            data:{
                name,
                adminId
            }
        })
        return {room,mess:"room is created successfully!"
        };
    } catch (error) {
        return {room:null,mess:"Failed to create room!"};
    }
}