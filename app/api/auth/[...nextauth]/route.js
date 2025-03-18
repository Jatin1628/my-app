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
  
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };