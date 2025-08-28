import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { listing } from "@/types/listing";

interface AuthUserType {
    _id?: string;
    username?: string;
    email?: string | null;
    firstName?: string;
    lastName?: string;
    name?: string | null;
    profilePicture?: string | StaticImageData | null;
    image?: string | StaticImageData | null;
    role?: string;
    subrole?: string[];
    properties?: listing[];
    status?: string;
    lastLogin?: string | null;
    deleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<AuthUserType | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {

                const res = await axiosInstance.get<{ user: AuthUserType }>("/auth/v2/me");
                setUser(res.data.user);
            } catch (err) {
                console.warn("Failed to fetch user:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const logout = async () => {
        try {
            await axiosInstance.post("/auth/v2/logout");
        } catch (err) {
            console.warn("Logout failed:", err);
        } finally {
            setUser(null);
            router.push("/");
        }
    };

    return { user, loading, logout, setUser };
};
