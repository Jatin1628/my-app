import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "../../../../lib/dbConnect";
import User from "../../../../models/user.model";
import { verifyOtpToken } from "../../../../lib/otp";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.otp || !credentials.token) {
          throw new Error("Missing credentials");
        }

        const otpResult = verifyOtpToken(credentials.token, credentials.otp);
        if (!otpResult.valid) {
          throw new Error(otpResult.message);
        }

        await connectDB();
        let user = await User.findOne({ email: credentials.email });
        if (!user) {
          user = await User.create({ email: credentials.email });
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || "",
          image: user.image || "",
        };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, token, user }) {
      await connectDB();
      if (session.user?.email) {
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          (session.user as { id: string }).id = sessionUser._id.toString();
        }
      }
      return session;
    },
    async signIn({ profile }) {
      await connectDB();
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
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };