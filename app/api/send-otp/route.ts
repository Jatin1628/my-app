import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateOtp } from '../../../lib/otpStore';

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // Generate OTP and store it
  const otp = generateOtp(email);

  console.log(`Generated OTP for ${email}: ${otp}`);

  // Set up Nodemailer transporter (using your SMTP settings)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Accept self-signed certificates
    },
  });

  try {
    await transporter.sendMail({
      from: '"My OTP App" <no-reply@myotpapp.com>',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
      html: `<p>Your OTP code is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });
    return NextResponse.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Error sending OTP' }, { status: 500 });
  }
}