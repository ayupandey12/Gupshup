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
type User={
  ws:WebSocket,
  roomId:number[],
  userId:string,
  username:string
}
const user:User[]=[];
const wss=new WebSocketServer({port:8080},()=>{console.log("ws server created")})
wss.on("connection",async(ws,request)=>{
   ws.on("error",console.error);
  const url=request.url
  const query=new URLSearchParams(url?.split("?")[1])
  const token=query.get("token")||""
  const userData=await getuser(token)
  if(!userData)
  {
    ws.close();
    return;
  }
  user.push({
    ws:ws,
    roomId:[],
    userId:userData.userId,
    username:userData.username
  })
    
  ws.on("close", () => {
    const index = user.findIndex(u => u.ws === ws);
    if (index !== -1) {
      user.splice(index, 1);
      console.log("User disconnected and removed from global state");
    }
  });

  ws.on("message", async (data) => {
    const raw = typeof data === "string" ? data : data.toString();
    const parsedata = JSON.parse(raw);
    const roomId = Number(parsedata.roomId);
    if (!Number.isInteger(roomId)) {
      return;
    }

    const currentUser = user.find((x) => x.ws === ws);
    if (!currentUser) {
      return;
    }

    if (parsedata.type === "join_room") {
      if (!currentUser.roomId.includes(roomId)) {
        currentUser.roomId.push(roomId);
      }
      console.log("user joined room", currentUser.userId, roomId);
      return;
    }

    if (parsedata.type === "leave_room") {
      currentUser.roomId = currentUser.roomId.filter((x) => x !== roomId);
      console.log("user left room", currentUser.userId, roomId);
      return;
    }

    if (parsedata.type === "chat") {
      const message = String(parsedata.message ?? "");
      if (!message.trim()) {
        return;
      }

      if (!currentUser.roomId.includes(roomId)) {
        currentUser.roomId.push(roomId);
        console.log("auto-joined user to room on chat", currentUser.userId, roomId);
      }

      await prisma.messages.create({
        data: {
          message,
          roomId,
          userId: currentUser.userId,
        },
      });

      user.forEach((u) => {
        if (u.roomId.includes(roomId) && u.ws.readyState === WebSocket.OPEN) {
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
})