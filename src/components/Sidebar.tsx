import { Chats } from "./Chats";
import { Navbar } from "./Navbar";
import { Search } from "./Search";

export const Sidebar = () => {
  return (
    <div className="flex-1 bg-primary ">
      <Navbar />
      <Search />
      <Chats />
    </div>
  );
};
