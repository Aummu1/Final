import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from 'axios';
import CredentialsProvider from "next-auth/providers/credentials";
import { useYScale } from "@mui/x-charts";

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
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        if (!credentials.username || !credentials.password) {
          return null;
        }
        const data = {
          username: credentials.username,
          password: credentials.password
        };

        const res = await axios.post(
          "http://localhost:2546/api/user/CheckAdminUser",
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const user = res.data[0]
        if (res.status == 200) {
          if(res.data.length > 0)
            return user;
          else{
            return null
          }
        }else{
          console.error("Failed to fetch user data.");
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        console.log("callback => ", profile);
        const data = {
          email: profile.email,
        };
        //CheckUserRegistration
        const response = await axios.post(
          "http://localhost:2546/api/user/check-email",
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("response => ", response.data);
        if(response.status == 200) {
          user.response = response.data[0];
            if(!response.data[0].found){
              return `/`
            }
            else if(response.data[0].Username == "none" || response.data[0].Password == null){
              return `/NewAdminLogin?email=${encodeURIComponent(profile.email)}&name=${encodeURIComponent(profile.name)}&imgurl=${encodeURIComponent(profile.picture)}`;
            }
            else {
              return true;
          }
        }
      } else if (account.provider === "credentials") {
        console.log("callback => ", user);
        return true;
      }
      return true;
    },
    async session({ session, token, user }) {
      if (token.provider === "google") {
        session.user.provider = "google";
      } else if (token.provider === "credentials") {
        session.user.provider = "credentials";
      }
      session.user.image = token.image || token.user.Image;
      session.user.name = token.name || token.user.Name_Admin;
      session.user.email = token.gmail || token.user.Gmail;

      return session;
    },

    async jwt({ token, user, account }) {
      if (account) {
        token.provider = account.provider; // Store the provider in the token
      }

      if (user) {
        token.user = user.response;
        token.image = user.Image;
        token.name = user.Name_Admin
        token.gmail = user.Gmail
      }

      return token;
    },

  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };