import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface OtpPayload {
  email: string;
  otp: string;
}

export function generateOtp(email: string): { otp: string; token: string } {
  // Generate a random 6-digit OTP
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  
  // Create the payload including email and otp
  const payload: OtpPayload = { email, otp };

  // Sign the payload with an expiration of 5 minutes
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '5m' });

  return { otp, token };
}

export function verifyOtpToken(token: string, userOtp: string): { valid: boolean; message: string } {
  try {
    // Verify token and extract the payload
    const decoded = jwt.verify(token, JWT_SECRET) as OtpPayload;
    if (decoded.otp === userOtp) {
      return { valid: true, message: 'OTP is valid.' };
    } else {
      return { valid: false, message: 'Invalid OTP.' };
    }
  } catch (err) {
    return { valid: false, message: 'OTP has expired or token is invalid.' };
  }
}