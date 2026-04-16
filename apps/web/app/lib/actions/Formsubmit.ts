"use server"
import axios from "axios"
import "dotenv/config"
export async function Formsubmitaction({ type,name,email,password }: { type: "signin" | "signup",name:string,email:string,password:string }) {
    console.log(`${process.env.NEXT_PUBLIC_HTTP_URL}/${type}`)
   try {
     const user1=await axios.post(`${process.env.NEXT_PUBLIC_HTTP_URL}/${type}`,{name,email,password})
      const message=user1.data.mess;
      const token=user1.data.token;
      const user=user1.data.user;
      return {
        mess:message,
        token:token,
        user:user
      }
   } catch (error:any) {
    console.log(error.response.data.mess)
    return{
      mess:error.response.data.mess||"backend server is down!",
      token:null,
      user:null
    }
   }
      
     }