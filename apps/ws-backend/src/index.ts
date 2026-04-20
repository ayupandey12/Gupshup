import "dotenv/config"
import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common-jwtsecret/index"
import { prisma } from "@repo/db";
console.log(process.env.DATABASE_URL);
async function getuser(token:string):Promise<{userId:string, username:string}|null>{
 try {
  const decode =jwt.verify(token,JWT_SECRET) as JwtPayload
   if(typeof(decode)==="string")
   { 
    return null ;
   }
  
  if(!decode||!decode.userId)
  { 
    return null;
  }
  const user = await prisma.user.findUnique({
    where: { id: decode.userId },
    select: { name: true }
  });
  if (!user) return null;
  return {userId: decode.userId, username: user.name};
 } catch (error) {
  return null
 }
}
type User = {
  ws: WebSocket;
  roomIds: number[];
  userId: string;
  username: string;
};

const users: User[] = [];
const wss = new WebSocketServer({ port: 8080 }, () => {
  console.log("ws server created");
});

wss.on("connection", async (ws, request) => {
  ws.on("error", console.error);
  const url = request.url;
  const query = new URLSearchParams(url?.split("?")[1]);
  const token = query.get("token") || "";
  const initialRoomId = Number(query.get("roomId"));
  const userData = await getuser(token);
  if (!userData) {
    console.warn("Connection rejected: invalid token");
    ws.close();
    return;
  }

  const currentUser: User = {
    ws,
    roomIds: Number.isInteger(initialRoomId) ? [initialRoomId] : [],
    userId: userData.userId,
    username: userData.username,
  };
  users.push(currentUser);
  if (Number.isInteger(initialRoomId)) {
    console.log("user auto-joined room from URL", currentUser.userId, initialRoomId);
  }
  
  console.log(`\n✅ NEW CONNECTION: User ${currentUser.username} (${currentUser.userId})`);
  console.log(`📊 Total connected users: ${users.length}`);

  ws.on("close", () => {
    const index = users.findIndex((u) => u.ws === ws);
    if (index !== -1) {
      users.splice(index, 1);
      console.log(`\n❌ DISCONNECTION: User ${currentUser.username} (${currentUser.userId})`);
      console.log(`📊 Remaining connected users: ${users.length}`);
    }
  });

  ws.on("message", async (data) => {
    let raw = "";
    try {
      raw = typeof data === "string" ? data : data.toString();
    } catch (err) {
      console.error("Error converting data to string:", err);
      return;
    }

    let parsedata: any;
    try {
      parsedata = JSON.parse(raw);
    } catch (err) {
      console.error("Error parsing JSON:", err, "raw:", raw);
      return;
    }

    console.log("Message received from", currentUser.userId, "type:", parsedata.type, "data:", parsedata);

    const roomId = Number(parsedata.roomId);
    if (!Number.isInteger(roomId)) {
      console.error("Invalid roomId:", parsedata.roomId, "parsed:", roomId);
      return;
    }

    if (parsedata.type === "join_room") {
      if (!currentUser.roomIds.includes(roomId)) {
        currentUser.roomIds.push(roomId);
      }
      console.log("✅ user joined room", currentUser.userId, "roomIds:", currentUser.roomIds);
      return;
    }

    if (parsedata.type === "leave_room") {
      currentUser.roomIds = currentUser.roomIds.filter((id) => id !== roomId);
      console.log("✅ user left room", currentUser.userId, "roomIds:", currentUser.roomIds);
      return;
    }

    if (parsedata.type === "chat") {
      const message = String(parsedata.message ?? "").trim();
      if (!message) {
        console.warn("Empty message received");
        return;
      }

      if (!currentUser.roomIds.includes(roomId)) {
        currentUser.roomIds.push(roomId);
        console.log("⚠️ auto-joined user to room on chat", currentUser.userId, roomId);
      }

      await prisma.messages.create({
        data: {
          message,
          roomId,
          userId: currentUser.userId,
        },
      });

      console.log(`📢 Broadcasting to room ${roomId}. Total users: ${users.length}`);
      console.log(`Total users in system:`, users.map(u => ({ userId: u.userId, roomIds: u.roomIds })));

      let broadcastCount = 0;
      users.forEach((u) => {
        const isInRoom = u.roomIds.includes(roomId);
        const wsOpen = u.ws.readyState === WebSocket.OPEN;
        console.log(`  User ${u.userId} - inRoom: ${isInRoom}, wsOpen: ${wsOpen}, roomIds: ${u.roomIds.join(",")}`);
        
        if (isInRoom && wsOpen) {
          u.ws.send(
            JSON.stringify({
              type: "chat",
              message,
              roomId,
              userId: currentUser.userId,
              username: currentUser.username,
            })
          );
          broadcastCount++;
          console.log(`  ✉️ message sent to user ${u.userId}`);
        }
      });
      console.log(`📊 Broadcasted to ${broadcastCount} users in room ${roomId}`);
    }
  });
});