"use client";
import ChatHistory from "@/components/ChatHistory";
import Navbar from "@/components/Navbar";
// import SearchBar from "@/components/SearchBar";
import ChatTranscript from "@/components/Transcript";
import VideoComponent from "@/components/VideoComponent";
import { useSession } from "next-auth/react";
import { DefaultSession } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import React from "react";
import User from "../../models/user.model";


declare module "next-auth" {
  interface Session {
    user?: {
      id?: string | null;
    } & DefaultSession["user"];
  }
}

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

  const userId = session?.user?.id;  // Extract userId from session

  return (
    <div className="w-[90%] h-screen mx-auto">
      <Navbar />
      <div>
        {/* <h1 className="font-semibold text-xl mt-5 m-3">Hello, {session?.user?.name || "User"}</h1> */}
      </div>
      
      <div className="lg:flex h-full lg:ml-30 lg:w-[90%] mx-auto">
        <VideoComponent />
        <ChatTranscript />
        {/* <ChatHistory userId={userId || ''} /> */}
      </div>

      <div className="fixed lg:left-[12%] bottom-5 w-full">
        {/* <SearchBar /> */}
      </div>
    </div>
  );
};

export default Page;