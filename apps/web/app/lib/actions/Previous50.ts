"use server"
import axios from "axios"
import "dotenv/config"
export const Previous50 = async (roomId: number) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_HTTP_URL}/chat/${roomId}`);
        const data = response.data;
        return Array.isArray(data) ? data : data.messages || [];
    } catch (error) {
        console.error("Error fetching history:", error);
        return [];
    }
}
