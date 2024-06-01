import { Chat } from "../components/Chat";
import { Sidebar } from "../components/Sidebar";

export const Home = () => {
  return (
    <div className="flex items-center justify-center bg-blue-300 h-screen">
      <div className="border border-white w-[90%] md:w-[65%] h-[80%] rounded-lg flex overflow-hidden">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};
