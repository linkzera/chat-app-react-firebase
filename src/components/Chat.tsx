import {
  DotsThreeOutlineVertical,
  UserPlus,
  VideoCamera,
} from "phosphor-react";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Input } from "./Input";
import { Messages } from "./Messages";

export const Chat = () => {
  const { data }: any = useContext(ChatContext);
  return (
    <div className="flex-[2] ">
      <div className="chatInfo bg-button  flex items-center justify-between text-white h-12 p-2">
        <span className="font-bold text-2xl">{data?.user?.displayName}</span>
        <div className="chatIcons flex items-center gap-3">
          <VideoCamera size={24} className="cursor-pointer" />
          <UserPlus size={24} className="cursor-pointer" />
          <DotsThreeOutlineVertical size={24} className="cursor-pointer" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};
