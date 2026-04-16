"use client"
import "dotenv/config"
import { useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { Inputbox } from "./Forminput"
import { Formsubmitaction } from "../lib/actions/Formsubmit"
import { useAuthHydrated } from "../lib/store/useAuthhydration"
import { redirect } from "next/navigation"

//useformstatus work for parent so make submitbutton as component of formbutton
const SubmitButton = ({ type }: { type: "signin" | "signup" }) => {
    const { pending } = useFormStatus();

    return (
        <button 
            type="submit" 
            disabled={pending}
            className={`w-full mt-6 py-3.5 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all shadow-md active:scale-95 
                ${pending 
                    ? "bg-gray-400 cursor-not-allowed text-white" 
                    : "bg-black hover:bg-gray-800 text-white"}`}
        >
            {pending ? (
                <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                </>
            ) : (
                type === "signin" ? "Login" : "Sign Up"
            )}
        </button>
    );
};

export const Formbutton = ({ type }: { type: "signin" | "signup" }) => {
    const {login}=useAuthHydrated()
    const [name, setname] = useState<string>("")
    const [email, setemail] = useState<string>("")
    const [password, setpassword] = useState<string>("")
    const [error,seterror]=useState<boolean>(false);
    const [mes,setmes]=useState<string>("");

    useEffect(() => { console.log({ name, email, password }) }, [name, email, password])
      
    
    return (
        <form action={async () => {
            // Simulate 3 second API call
         const {user,mess,token}=  await Formsubmitaction({type:type,name:name,email:email,password:password})
         if(!token) {
            seterror(true);
         }
         else
         {  
            seterror(false);
            login(user,token);
            redirect("/dashboard/"+user.username);
         }
           setmes(mess)
            return;
        }}>
            <div className="space-y-1">
                {type !== "signin" && (
                    <Inputbox type="text" placeholder="John" onchange={setname} title="First Name" value={name} onclick={setmes}/>
                )}
                <Inputbox type="email" placeholder="mail@example.com" onchange={setemail} title="Email Address" value={email} onclick={setmes}/>
                <Inputbox type="password" placeholder="••••••••" onchange={setpassword} title="Password" value={password} onclick={setmes}/>
                <div className={` text-center ${error?`text-red-600`:`text-green-600`} `}>{mes}</div>
            </div>

            
            <SubmitButton type={type} />
        </form>
    );
};
