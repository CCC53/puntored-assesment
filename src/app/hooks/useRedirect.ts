import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { JWTPayload } from "@/app/types/auth.types";

const isTokenExpired = (token: string) => {
    try {
        const decoded: JWTPayload = jwtDecode(token);
        if (!decoded.exp) {
            return true;
        }
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    } catch (error) {
        console.log(error);
        return true;
    }
}

export const useRedirect = () => {
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (!token || isTokenExpired(token)) {
            router.replace('/login')
        }
    }, [router])
}