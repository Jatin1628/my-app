import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "../../../../utils/database";
import User from "../../../../models/user.model";
import mongoose from "mongoose";



const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session }) {
      try {
        await connectDB();
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id;
        }
        return session;
      } catch (error) {
        console.error(`Error in session callback: ${error.message}`);
        return session;
      }
    },
    
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };