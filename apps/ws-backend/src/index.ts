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
  const userData = await getuser(token);
  if (!userData) {
    ws.close();
    return;
  }

  const currentUser: User = {
    ws,
    roomIds: [],
    userId: userData.userId,
    username: userData.username,
  };
  users.push(currentUser);

  ws.on("close", () => {
    const index = users.findIndex((u) => u.ws === ws);
    if (index !== -1) {
      users.splice(index, 1);
      console.log("User disconnected and removed from global state", currentUser.userId);
    }
  });

  ws.on("message", async (data) => {
    let raw = "";
    try {
      raw = typeof data === "string" ? data : data.toString();
    } catch (err) {
      return;
    }

    let parsedata: any;
    try {
      parsedata = JSON.parse(raw);
    } catch (err) {
      return;
    }

    const roomId = Number(parsedata.roomId);
    if (!Number.isInteger(roomId)) {
      return;
    }

    if (parsedata.type === "join_room") {
      if (!currentUser.roomIds.includes(roomId)) {
        currentUser.roomIds.push(roomId);
      }
      console.log("user joined room", currentUser.userId, roomId);
      return;
    }

    if (parsedata.type === "leave_room") {
      currentUser.roomIds = currentUser.roomIds.filter((id) => id !== roomId);
      console.log("user left room", currentUser.userId, roomId);
      return;
    }

    if (parsedata.type === "chat") {
      const message = String(parsedata.message ?? "").trim();
      if (!message) {
        return;
      }

      if (!currentUser.roomIds.includes(roomId)) {
        currentUser.roomIds.push(roomId);
        console.log("auto-joined user to room on chat", currentUser.userId, roomId);
      }

      await prisma.messages.create({
        data: {
          message,
          roomId,
          userId: currentUser.userId,
        },
      });

      users.forEach((u) => {
        if (u.roomIds.includes(roomId) && u.ws.readyState === WebSocket.OPEN) {
          u.ws.send(
            JSON.stringify({
              type: "chat",
              message,
              roomId,
              userId: currentUser.userId,
              username: currentUser.username,
            })
          );
          console.log("message sent to user", u.userId, "room", roomId);
        }
      });
    }
  });
});