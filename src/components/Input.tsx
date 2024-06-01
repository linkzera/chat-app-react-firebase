import { FilePlus, Paperclip } from "phosphor-react";

import { useContext, useState } from "react";

import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser }: any = useContext(AuthContext);
  const { data }: any = useContext(ChatContext);

  /**
   * It uploads an image to firebase storage and then updates the database with the image url.
   * </code>
   */

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuidv4());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (error: any) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuidv4(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuidv4(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  return (
    <div className="input h-12 bg-white p-2 flex items-center justify-between">
      <input
        className=" outline-none text-lg text-secondary"
        type="text"
        placeholder="Type you message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="send flex gap-2 items-center ">
        <input
          type="file"
          name="file"
          id="file"
          className="hidden"
          onChange={(e: any) => setImg(e.target.files[0])}
        />
        <label htmlFor="file" className="cursor-pointer">
          <FilePlus size={24} />
        </label>
        <input type="file" id="attachment" className="hidden" />
        <label htmlFor="attachment" className="cursor-pointer">
          <Paperclip size={24} />
        </label>
        <button
          className="bg-button text-white p-2 px-3 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};
