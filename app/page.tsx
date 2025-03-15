"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero';

const Page = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      {/* <Navbar /> */}
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