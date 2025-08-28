import { StaticImageData } from "next/image";

export type User = {
    _id?: string;
    id?: string;
    username?: string;
    email?: string | null;
    firstName?: string;
    lastName?: string;
    name?: string | null;
    profilePicture?: string | StaticImageData | null;
    image?: string | StaticImageData | null;
    phone?: string;
    role?: string;
    subrole?: string[];
    status?: string;
    lastLogin?: string | null;
    createdAt?: string;
    updatedAt?: string;
};