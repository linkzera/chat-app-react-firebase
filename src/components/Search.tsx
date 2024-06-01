import { useContext, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

interface User {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
}

export const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<User>({} as User);
  const [err, setErr] = useState(false);
  const { currentUser }: any = useContext(AuthContext);
  const usersRef = collection(db, "users");

  /**
   * It searches for a user in the database and if it finds one, it sets the user state to the user it
   * found. If it doesn't find one, it sets the error state to true.
   */
  async function searchUser() {
    const q = query(usersRef, where("displayName", "==", username));
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data() as User);
      });
      if (!user) {
        setErr(true);
      }
    } catch (err: any) {
      setErr(true);
    }
  }

  /**
   * When the user presses the enter key, call the searchUser function.
   * @param e - React.KeyboardEvent<HTMLInputElement>
   */
  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      searchUser();
    }
  }

  /**
   * If the user doesn't exist, create a new user and add it to the database.
   */
  const handleSelect = async () => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}

    setUser(null as any);
    setUsername("");
  };

  return (
    <div className="border-b border-gray-500">
      <div className="">
        <input
          type="text"
          className="bg-transparent text-white outline-none placeholder:text-gray-300 p-2 w-full"
          placeholder="Find a user"
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKey}
        />
        {err && <p className="text-red-500">User not found</p>}
        {user?.displayName && (
          <div
            className="flex gap-2 items-center text-white p-2 cursor-pointer hover:bg-secondary rounded-lg"
            onClick={handleSelect}
          >
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={user?.photoURL}
            />
            <span className="text-lg">{user.displayName}</span>
          </div>
        )}
      </div>
    </div>
  );
};
