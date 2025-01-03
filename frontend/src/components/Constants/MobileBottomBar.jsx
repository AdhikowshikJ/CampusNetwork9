import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  TrophyIcon,
  UserIcon,
  PencilSquareIcon,
  ChatBubbleOvalLeftIcon,
  UsersIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { GlobeAmericasIcon } from "@heroicons/react/24/solid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreatePost from "../actions/CreatePost";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import useAuthStore from "../Store/authStore";

function MobileBottomBar() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout, user } = useAuthStore();

  const handleCloseCreatePost = () => {
    setIsCreatePostOpen(false);
  };

  const handleOpenCreatePost = () => {
    setIsCreatePostOpen(true);
    setIsDropdownOpen(false);
  };

  return (
    <div className="z-[1000]">
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 md:hidden">
        <div className="flex justify-around py-3">
          <Link to="/home" className="text-gray-400 hover:text-white">
            <HomeIcon className="w-6 h-6" />
          </Link>
          <Link to="/explore" className="text-gray-400 hover:text-white">
            <GlobeAmericasIcon className="w-6 h-6" />
          </Link>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button className="bg-accent rounded-full p-3 -mt-6">
                <PlusIcon className="h-6 w-6 text-white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black border border-gray-500 mb-2">
              <div className="flex items-center justify-around p-2">
                <DropdownMenuItem>
                  <button onClick={handleOpenCreatePost}>
                    <PencilSquareIcon className="h-6 w-6 text-gray-400 hover:text-white" />
                  </button>
                </DropdownMenuItem>
                <span className="text-gray-500">|</span>
                <DropdownMenuItem>
                  <Link to="/chat" onClick={() => setIsDropdownOpen(false)}>
                    <ChatBubbleOvalLeftIcon className="h-6 w-6 text-gray-400 hover:text-white" />
                  </Link>
                </DropdownMenuItem>
                <span className="text-gray-500">|</span>
                <DropdownMenuItem>
                  <Link to="/forum" onClick={() => setIsDropdownOpen(false)}>
                    <UsersIcon className="h-6 w-6 text-gray-400 hover:text-white" />
                  </Link>
                </DropdownMenuItem>
                <span className="text-gray-500">|</span>
                <DropdownMenuItem>
                  <Link to="/jobs" onClick={() => setIsDropdownOpen(false)}>
                    <BriefcaseIcon className="h-6 w-6 text-gray-400 hover:text-white" />
                  </Link>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/leaderboard" className="text-gray-400 hover:text-white">
            <TrophyIcon className="w-6 h-6" />
          </Link>
          <Link
            to={`/${user?.username}`}
            className="text-gray-400 hover:text-white"
          >
            <UserIcon className="w-6 h-6" />
          </Link>
        </div>
      </div>
      <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
        <DialogContent className="bg-black border border-gray-500 m-0">
          <CreatePost handleClose={handleCloseCreatePost} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MobileBottomBar;
