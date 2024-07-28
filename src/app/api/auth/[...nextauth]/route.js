import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
        params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
            },
        },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        console.log("callback => ", profile);
        const data = {
            email: profile.email,
        };
        
        }
    return true;
    },
},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };