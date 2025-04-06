"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from 'next/link'


const Navbar = () => {
  const [expanded, setExpanded] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => {
    setExpanded(!expanded);
  };
  return (
    <header className="py-4 bg-black sm:py-6">
      <div className="px-4 mx-auto max-w-[90%] sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="shrink-0">
            <a href="#" title="" className="flex">
              <h1 className="text-2xl font-semibold text-white">Wanda</h1>
            </a>
          </div>

          <div className="flex md:hidden">
            <button
              type="button"
              className="text-white"
              onClick={toggleMenu}
              aria-expanded={expanded}
            >
              {!expanded ? (
                <svg
                  className="w-7 h-7"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="w-7 h-7"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>

          <nav className="hidden md:flex md:items-center md:justify-end md:space-x-12">
            {/* <a
              href="#"
              className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
            >
              Products
            </a>
            <a
              href="#"
              className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
            >
              Features
            </a>
            <a
              href="#"
              className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
            >
              Pricing
            </a> */}
            {session ? (
              <Button
                onClick={() => {
                  signOut();
                }}
                type="button"
              >
                Sign Out
              </Button>
            ) : (
              <Link href="/login">
                Login
              </Link>
            )}
          </nav>
        </div>

        {expanded && (
          <nav>
            <div className="flex flex-col pt-8 pb-4 space-y-6">
              {/* <a
                href="#"
                className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
              >
                Products
              </a>
              <a
                href="#"
                className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
              >
                Features
              </a>
              <a
                href="#"
                className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
              >
                Pricing
              </a> */}
              {session ? (
              <Button
                onClick={() => {
                  signOut();
                }}
                type="button"
              >
                Sign Out
              </Button>
            ) : (
              <Link href = "/login">
                Login
              </Link>
            )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
