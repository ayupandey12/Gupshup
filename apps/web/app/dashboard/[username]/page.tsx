"use client"
import "dotenv/config"
import { redirect, useRouter } from "next/navigation";
import { useAuthHydrated } from "../../lib/store/useAuthhydration";
import { useEffect } from "react";

const dashboard=()=>{
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
  return <h1>Welcome, {user.username}</h1>;
}

export default dashboard;