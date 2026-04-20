import { NextResponse } from "next/server";
import { prisma } from "@repo/db";

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ rooms });
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    return NextResponse.json({ rooms: [] });
  }
}
