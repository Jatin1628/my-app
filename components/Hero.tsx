import React, { useState } from 'react';
import Link from 'next/link';
import {useSession, signIn, signOut} from 'next-auth/react'
import { Button } from "@/components/ui/button";

const Hero = () => {
  const [expanded, setExpanded] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => {
    setExpanded(!expanded);
  };

  return (
    <div className='mt-3'>
      

      <section className="py-12 bg-black sm:pb-16 lg:pb-20 xl:pb-24 mt-3">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-[90%]">
          <div className="relative">
            <div className="lg:w-2/3">
              <p className="text-sm font-normal tracking-widest text-gray-300 uppercase">Your Personal Virtual AI Assistant</p>
              <h1 className="mt-6 text-4xl font-normal text-white sm:mt-10 sm:text-5xl lg:text-6xl xl:text-8xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500">Jarvis AI</span>
                Virtual Assistant
              </h1>
              <p className="max-w-lg mt-4 text-xl font-normal text-gray-400 sm:mt-8">
              Meet your personal AI-powered assistant designed to simplify your daily tasks. Whether you need quick answers, schedule reminders, manage tasks, or even have a casual chat, this virtual assistant is here to make life easier.
              </p>
              <div className="relative inline-flex items-center justify-center mt-8 sm:mt-12 group">
                <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50"></div>
                {session ? (
                  <Link href="/assistant" className="relative inline-flex items-center justify-center px-8 py-3 text-base font-normal text-white bg-black border border-transparent rounded-full" role="button">
                    Talk to Jarvis
                  </Link>
                ) : (
                  <Link href="/login" className="relative inline-flex items-center justify-center px-8 py-3 text-base font-normal text-white bg-black border border-transparent rounded-full" role="button">
                    Login to use Jarvis
                  </Link>
                )}
              </div>
              <div>
                
              </div>
            </div>
            <div className="hidden lg:flex mt-8 md:absolute md:mt-0 md:top-32 lg:top-0 md:right-0">
              <img className="w-full max-w-xs mx-auto lg:max-w-lg xl:max-w-xl" src="https://landingfoliocom.imgix.net/store/collection/dusk/images/hero/1/3d-illustration.png" alt="" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;