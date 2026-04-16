"use server"
import {prisma} from "@repo/db"

export const Findallrooms=async ()=>{
  try {
    const rooms= await prisma.room.findMany();
    return {rooms,mess:"rooms are fetched successfully!"};
  } catch (error) {
    return {rooms:null,mess:"failed to fetch rooms!"};
  }
}
