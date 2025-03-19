"use client";
import { useState } from 'react';

export default function ExampleComponent() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  async function requestOtp() {
    const res = await fetch('/api/request-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      setMessage(data.message);
    } else {
      setMessage(data.message);
    }
  }

  async function verifyOtp() {
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, otp }),
    });
    const data = await res.json();
    setMessage(data.message);
  }

  return (
    <div>
      <h1>OTP Example</h1>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button onClick={requestOtp}>Request OTP</button>

      <br />

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={e => setOtp(e.target.value)}
      />
      <button onClick={verifyOtp}>Verify OTP</button>

      <p>{message}</p>
    </div>
  );
}