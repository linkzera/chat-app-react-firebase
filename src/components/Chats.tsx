import { doc, onSnapshot } from "firebase/firestore";
import { Check } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

export const Chats = () => {
  const [chats, setChats] = useState<any>([]);

  const { currentUser }: any = useContext(AuthContext);
  const { dispatch }: any = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u: any) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="chats">
      {Object.entries(chats as any)
        ?.sort((a, b) => (b[1] as any).date - (a[1] as any).date)
        .map((chat: any) => (
          <div
            className="flex gap-2 items-center text-white p-2 cursor-pointer hover:bg-secondary rounded-lg"
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
          >
            <img
              src={chat[1].userInfo.photoURL}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="userChatInfo">
              <span className="text-lg font-bold">
                {chat[1].userInfo.displayName}
              </span>
              <p className="text-sm text-gray-300 flex items-center gap-1">
                {chat[1].lastMessage?.text} <Check size={12} />
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};
