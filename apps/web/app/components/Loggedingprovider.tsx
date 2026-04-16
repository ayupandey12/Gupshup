"use client"
import { useEffect } from "react";
import { useAuthHydrated } from "../lib/store/useAuthhydration";
import { redirect } from "next/navigation";
export const Loggedingprovider = ({ children }: { children: React.ReactNode }) => {
    const { user, isInitialized, checkAuth } = useAuthHydrated();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isInitialized) return <div>Loading...</div>;
  console.log(user);
  if (!user) {
    redirect("/signin");
  }
  if(user.username!==window.location.pathname.split("/")[2])
  { 
    redirect("/dashboard/"+user.username);
  }
  return <>
  <div className="w-full h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">Welcome to your dashboard, {user.username}!</h1>
    </div>
  {children}</>;   
}