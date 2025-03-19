import nodemailer from 'nodemailer';

export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  // Create a transporter using your email provider
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or use another provider like 'Yahoo', 'Outlook', etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false, // Accept self-signed certificates
    },
  });

  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
}