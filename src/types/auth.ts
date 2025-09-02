// src/types/auth.ts
import type { StaticImageData } from "next/image";
import type { listing } from "./listing";

export type AuthUser = {
    _id?: string;
    id?: string;
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
};

/** API responses */
export type MeResponse = { user: AuthUser };
export type LoginResponse = { message: string; accessToken: string };
export type RefreshResponse = { accessToken: string };
