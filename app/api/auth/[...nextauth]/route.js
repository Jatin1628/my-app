import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "../../../../utils/database";
import User from "../../../../models/user.model";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {

      const sessionUser = await User.findOne({email: session.user.email})
      return session;
    },
    async signIn({ profile }) {
      console.log(profile);
      try {
        await connectDB();
        const userExist = await User.findOne({ email: profile.email });

        if (!userExist) {
          const user = await User.create({
            email: profile.email,
            name: profile.name,
            image: profile.picture,
          });
        }
        return true;
      } catch (error) {
        console.error(`Error: ${error.message}`);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
