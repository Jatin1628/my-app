"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero';
import {connectDB} from "../utils/database"

const Page = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const db = connectDB();


  return (
    <div>
      <Navbar />
      <Hero />
      {isClient && (
        <div>
          {/* Client-only code here */}
        </div>
      )}
    </div>
  )
}

export default Page