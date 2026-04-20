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
            className={`w-full mt-6 rounded-full px-5 py-4 text-sm font-semibold uppercase tracking-[0.08em] transition-all duration-200 ${pending ? 'bg-slate-300 cursor-not-allowed text-slate-600' : 'bg-slate-950 text-white shadow-[0_20px_50px_rgba(15,23,42,0.18)] hover:bg-slate-800'}`}
        >
            {pending ? (
                <div className="inline-flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Processing...
                </div>
            ) : (
                type === "signin" ? "Sign in" : "Create account"
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
