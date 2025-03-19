import { NextResponse } from 'next/server';
import { generateOtp } from '../../../lib/otp';
import { sendOtpEmail } from '../../../lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Generate OTP and JWT token
    const { otp, token } = generateOtp(email);

    // Send the OTP email
    await sendOtpEmail(email, otp);

    // Return response with token
    return NextResponse.json({ message: 'OTP sent to email', token });
  } catch (error) {
    console.error('Error in request-otp API route:', error);
    return NextResponse.json({ message: 'Failed to send OTP email' }, { status: 500 });
  }
}