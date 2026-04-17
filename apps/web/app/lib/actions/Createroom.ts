'use server'
import {prisma} from "@repo/db"
export const Createroom=async({name,adminId}:{name:string,adminId:string})=>{
    const user=await prisma.user.findFirst({
        where:{
            id:adminId  
        }
    })
    if(!user)    {
        return {room:null,mess:"Admin user not found!"}
    }
    const room1=await prisma.room.findFirst({
        where:{
            name:name
        }
    })
    if(room1){
        return {room:null,mess:"Room with this name already exists!"}
    }

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