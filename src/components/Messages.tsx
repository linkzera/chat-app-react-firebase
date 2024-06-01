import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import { Message } from "./Message";

export const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data }: any = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div className="messages bg-slate-100 overflow-scroll">
      {messages.map((m: any) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};
