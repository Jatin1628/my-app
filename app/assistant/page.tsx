import ChatTranscript from "@/components/Transcript";
import VideoComponent from "@/components/VideoComponent";
import { Video } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <div className="w-full h-screen overflow-y-scroll">
      <div>
        <h1 className="font-semibold text-xl mt-5 m-3">Hello, User</h1>
      </div>

      <div className="flex h-screen">
        <VideoComponent />

        <ChatTranscript />
      </div>
    </div>
  );
};

export default page;
