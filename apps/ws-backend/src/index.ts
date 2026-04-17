import "dotenv/config"
import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common-jwtsecret/index"
import { prisma } from "@repo/db";
console.log(process.env.DATABASE_URL);
function getuser(token:string):string|null{
 try {
  const decode =jwt.verify(token,JWT_SECRET)
   if(typeof(decode)==="string")
   { 
    return null ;
   }
  
  if(!decode||!decode.userId)
  { 
    return null;
  }
  return decode.userId
 } catch (error) {
  return null
 }
}
type User={
  ws:WebSocket,
  roomId:number[],
  userId:string
}
const user:User[]=[];
const wss=new WebSocketServer({port:8080},()=>{console.log("ws server created")})
wss.on("connection",async(ws,request)=>{
   ws.on("error",console.error);
  const url=request.url
  const query=new URLSearchParams(url?.split("?")[1])
  const token=query.get("token")||""
  const userId=getuser(token)
  if(!userId)
  {
    ws.close();
    return;
  }
  user.push({
    ws:ws,
    roomId:[],
    userId:userId
  })
    
  ws.on("close", () => {
    const index = user.findIndex(u => u.ws === ws);
    if (index !== -1) {
      user.splice(index, 1);
      console.log("User disconnected and removed from global state");
    }
  });

  ws.on("message",async(data)=>{ //comming data is in string form 
    const parsedata=JSON.parse(data as unknown as string)
    if(parsedata.type==="join_room")
      {
         const user2=user.find(x=>x.ws===ws)
         if(!user2) return ;
         user2.roomId.push(parsedata.roomId)
          console.log("user join room",user2.roomId)
      }  
    if(parsedata.type==="leave_room")
      { const user2=user.find(x=>x.ws===ws)
        if(!user2) return ;
        user2.roomId=user2.roomId.filter(x=>x!==parsedata.roomId)
        console.log("user leave room",user2.roomId)
      } 
    if(parsedata.type==="chat")
      {
         const roomId =parsedata.roomId;
         const message=parsedata.message;
         await prisma.messages.create({ //idealy use queue
          data:{
            message:message,
            roomId:roomId,
            userId:userId
          }
         })
         user.forEach(u=>{
          if(u.roomId.includes(roomId))
          {
            u.ws.send(JSON.stringify({ //you can send  data in string form
              type:"chat",
              message:message,
              roomId:roomId
            }));
            console.log("message sent to user",u.userId)
          }
         })
      }   
  })
})