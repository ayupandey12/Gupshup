"use server"
import { prisma } from "@repo/db";

export async function verifyRoomExists(roomId: number) {
  const room = await prisma.room.findUnique({
    where: { id: roomId }
  });
  return !!room; // Returns true if it exists, false otherwise
}
