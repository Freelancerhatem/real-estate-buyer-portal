// authOptions.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import axiosInstance from "@/lib/axiosInstance";

export const auth: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET,

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async signIn({ user, account, profile }) {


            if (account?.provider === "google" || account?.provider === "facebook") {
                try {
                    const res = await axiosInstance.post(
                        "/auth/oauth-login",
                        {
                            email: user?.email,
                            name: profile?.name,
                            picture: user?.image || "",
                            provider: account.provider,

                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    return res.status === 200;
                } catch (error) {
                    console.error("OAuth login error:", error);
                    return false;
                }
            }

            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.username = user.username;
                token.subrole = user.subrole;
                token.backendToken = user.backendToken;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.username = token.username as string;
                session.user.subrole = token.subrole as string[];
                session.user.backendToken = token.backendToken as string;
            }
            return session;
        },
    },

    pages: {
        signIn: "/auth/signin",
    },
};
