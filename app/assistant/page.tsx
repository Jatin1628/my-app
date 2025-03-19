"use client"
import Navbar from "@/components/Navbar";
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
        <h1 className="font-semibold text-xl mt-5 m-3">Hello, {session?.user?.name || "User"}</h1>
      </div>

      <div className="flex h-full">
        <VideoComponent />
        <ChatTranscript />
      </div>
    </div>
  );
};

export default Page;