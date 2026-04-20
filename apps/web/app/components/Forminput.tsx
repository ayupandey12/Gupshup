"use client"
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { Formbutton } from "./Formbutton";


export const Forminput = ({ type }: { type: "signin" | "signup" }) => {
   
    const router=useRouter()

    return (
        <div className="min-h-screen w-full bg-[#f5ede4] flex items-center justify-center p-4 font-sans">
           
            <div className="w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-[0_40px_80px_rgba(15,23,42,0.08)]">
                
                
                <div className="bg-[#fff7ed] px-8 py-9 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[1.75rem] bg-[#f9e5cc] text-slate-900 shadow-sm">
                        <span className="text-xl font-black">C</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                        {type === "signin" ? "Welcome back" : "Create an account"}
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                        {type === "signin"
                            ? "Sign in to continue chatting with your rooms."
                            : "Start your Chatty Charm experience with a simple signup."}
                    </p>
                </div>

                <div className="px-8 py-9">
                    <Formbutton type={type} />

                    <div className="mt-6 text-center text-sm text-slate-600">
                        {type === "signin" ? (
                            <button className="font-semibold text-slate-900 hover:text-slate-700" onClick={() => router.push('/signup')}>
                                Don’t have an account? Sign Up
                            </button>
                        ) : (
                            <button className="font-semibold text-slate-900 hover:text-slate-700" onClick={() => router.push('/signin')}>
                                Already have an account? Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}



export const Inputbox = ({ type, placeholder, onchange, title, value,onclick }: {
    type: string, placeholder: string, onchange: (value: string) => void, title: string, value: string,onclick:(value:string)=>void
}) => {
    const [showPassword, setShowPassword] = useState(false);

    // find type base on eye 
    const inputType = type === "password" && showPassword ? "text" : type;

    return (
        <div className="w-full mb-4 group">
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-[0.35em] mb-2">
                {title}
            </label>
            <div className="relative">
                <input 
                    onClick={()=>{onclick("")}}
                    type={inputType} 
                    placeholder={placeholder} 
                    value={value}
                    onChange={(e) => {
                        const val = e.target.value;
                        onchange(type === "text" ? val.replace(/[^a-zA-Z]/g, "") : val);
                    }} 
                    className="w-full rounded-3xl border border-slate-200 bg-[#fbf5ed] px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200 transition"
                />
                
                {/* Show toggle button only for password fields */}
                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-2.5 py-1 text-slate-500 shadow-sm transition hover:bg-white hover:text-slate-900"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
        </div>
    );
};
