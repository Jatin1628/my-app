"use client";
import Navbar from "@/components/Navbar";
// import SearchBar from "@/components/SearchBar";
import ChatTranscript from "@/components/Transcript";
import VideoComponent from "@/components/VideoComponent";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import React from "react";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[90%] h-screen mx-auto">
      <Navbar />
      <div>
        {/* <h1 className="font-semibold text-xl mt-5 m-3">Hello, {session?.user?.name || "User"}</h1> */}
      </div>
      
      <div className="lg:flex h-full lg:ml-30 lg:w-[90%] mx-auto">
      
      <VideoComponent />

      <ChatTranscript />
      </div>


      <div className="fixed lg:left-[12%] bottom-5 w-full">
        {/* <SearchBar /> */}
      </div>
    </div>
  );
};

export default Page;
