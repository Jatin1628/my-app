import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/user.model';
import { verifyOtpToken } from '../../../lib/otp';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { token, otp } = await request.json();
    if (!token || !otp) {
      return NextResponse.json({ message: 'Token and OTP are required' }, { status: 400 });
    }

    const result = verifyOtpToken(token, otp);
    if (!result.valid) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }

    // Connect to MongoDB
    await dbConnect();

    // Extract email from the token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as unknown as { email: string };

    // Check if user already exists
    let user = await User.findOne({ email: decoded.email });
    if (!user) {
      // Create a new user
      user = await User.create({ email: decoded.email });
    }

    return NextResponse.json({ message: 'OTP verified successfully. User signed in!', user });
  } catch (error) {
    console.error('Error in verify-otp API route:', error);
    return NextResponse.json({ message: 'Error verifying OTP' }, { status: 500 });
  }
}