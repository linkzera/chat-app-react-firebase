import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

export const Message = ({ message }: any) => {
  const { currentUser }: any = useContext(AuthContext);
  const { data }: any = useContext(ChatContext);

  const ref: any = useRef();

  useEffect(() => {
    (ref.current as any)?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message flex gap-5 p-4  ${
        message.senderId === currentUser.uid ? "" : "flex-row-reverse"
      }`}
    >
      <div className="messageInfo flex flex-col text-gray-500 ">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
          className="w-10 h-10 object-cover rounded-full"
        />
        <span>Just now</span>
      </div>
      <div className="messageContent max-w-[80%] flex flex-col gap-2">
        <p
          className={`bg-white p-2 rounded-lg ${
            !message.senderId && "bg-tertiary text-white"
          }`}
        >
          {message.text}
        </p>

        {message.img && (
          <img src={message.img} alt="" className="w-1/2 rounded-lg" />
        )}
      </div>
    </div>
  );
};
