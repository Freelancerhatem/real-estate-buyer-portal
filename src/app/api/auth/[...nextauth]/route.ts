import NextAuth from "next-auth";
import { auth } from "../../../../../auth";


export const GET = NextAuth(auth);
export const POST = NextAuth(auth);
