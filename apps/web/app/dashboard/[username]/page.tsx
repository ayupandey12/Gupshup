"use client"
import "dotenv/config"
import { useRouter } from "next/navigation";
import { useAuthHydrated } from "../../lib/store/useAuthhydration";
import { useEffect } from "react";

const dashboard=()=>{
   const { user, isInitialized, checkAuth } = useAuthHydrated();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isInitialized) return <div>Loading...</div>;

  if (!user) {
    router.push('/signin');
    return null;
  }

  return <h1>Welcome, {user.username}</h1>;
}

export default dashboard;