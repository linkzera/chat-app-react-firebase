import { signOut } from "firebase/auth";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";

export const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="flex items-center bg-secondary h-12 px-2 justify-between text-zinc-100">
      <span className="font-bold hidden md:flex">Chat</span>
      <div className="flex items-center gap-2">
        <img
          className="w-6 h-6 rounded-full object-cover"
          src={currentUser?.photoURL}
        />
        <span>{currentUser?.displayName}</span>
        <button
          className="bg-rose-500 p-1 px-2 rounded-lg text-[10px] cursor-pointer hover:bg-rose-700 transition-colors duration-500"
          onClick={() => signOut(auth)}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
