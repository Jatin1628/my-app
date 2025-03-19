import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "../../../../lib/dbConnect";
import User from "../../../../models/user.model";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session }) {
      try {
        await connectDB();
        // Ensure session.user is defined before proceeding
        if (session.user?.email) {
          const sessionUser = await User.findOne({ email: session.user.email }) as { _id: string };
          if (sessionUser) {
            session.user.id = sessionUser._id.toString();
          }
        }
        return session;
      } catch (error: any) {
        console.error(`Error in session callback: ${error.message}`);
        return session;
      }
    },
    async signIn({ profile }) {
      try {
        await connectDB();
        // Ensure profile is defined
        if (profile?.email) {
          const userExist = await User.findOne({ email: profile.email });
          if (!userExist) {
            await User.create({
              email: profile.email,
              name: profile.name,
              image: profile.image,
            });
          }
        }
        return true;
      } catch (error: any) {
        console.error(`Error in signIn callback: ${error.message}`);
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };