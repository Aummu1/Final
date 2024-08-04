import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from 'axios';

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
        console.log(response.status);
        // const responseData = await response.json();
        if(response.status == 200) {
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
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };