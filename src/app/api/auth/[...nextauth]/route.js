import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from 'axios';
import CredentialsProvider from "next-auth/providers/credentials";
import { useYScale } from "@mui/x-charts";
import { red } from "@mui/material/colors";

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
        try {
          const data = {
            username: credentials.username,
            password: credentials.password,
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
      
          if (res.data[0].status === 200) {
            const user = {
              name: res.data[0].Name_Admin,
              email: res.data[0].Gmail,
              image: res.data[0].Image,
            };
            return user;
          } else {
            console.error("Admin user not found.");
            return null; // Return null when user is not found or status is not 200
          }
        } catch (error) {
          console.error("Authorization error:", error);
          return null; // Return null on error
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
        // console.log("callback => ", profile);
        console.log("callback => ", user); // ดูข้อมูล user ที่มาจาก Google
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

    async session({ session, token }) {
      console.log("Session Token:", token); // ตรวจสอบค่าของ token
      
      if (token.provider === "google") {
        session.user.provider = "google";
      } else if (token.provider === "credentials") {
        session.user.provider = "credentials";
      }
        session.user.image = token.picture || (token.user && token.user.image) || null;
        session.user.name = token.name || (token.user && token.user.Name_Admin) || null;
        session.user.email = token.email || (token.user && token.user.Gmail) || null;

      return session;
    },

    async jwt({ token, user, account }) {
      if (account) {
        token.provider = account.provider; // Store the provider in the token

        if (account.provider === "google" && user) {
          token.email = user.email;  // ดึงข้อมูล email จาก user ที่ส่งมาจาก Google
          token.image = user.image;  // ดึงรูปจาก user ที่ส่งมาจาก Google
        }
      }

      if (user) {
        token.user = {
          // id: user.id || null,
          Name_Admin: user.Name_Admin || null,
          Gmail: user.Gmail || null,
          Image: user.Image || null, // เพิ่มการตรวจสอบที่นี่
        };
      }

      // console.log("Token content:", token); // ตรวจสอบค่าของ token
      return token;
    },

  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };