import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BorderBeam } from "../ui/border-beam";
import CreatePost from "../actions/CreatePost";

const CreatePostSection = ({
  authUser,
  isCreatePostOpen,
  setIsCreatePostOpen,
}) => {
  const handleCloseCreatePost = () => {
    setIsCreatePostOpen(false);
  };

  return (
    <div className="p-4 mt-6 bg-gray-900/40 backdrop-blur-sm hidden sm:block border border-gray-800 rounded-xl mb-6">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10 ring-2 ring-purple-500/20">
          <AvatarImage src={authUser?.profileImage} />
          <AvatarFallback>{authUser?.name}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-200 mb-0.5">
            Have something in Mind?
          </h3>
          <p className="text-sm text-gray-400">
            Share something related to new skill development or productivity.
            Get Noticed!
          </p>
        </div>

        <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
          <DialogTrigger asChild>
            <button className="relative group bg-purple-600 overflow-hidden hover:bg-purple-500 text-white rounded-full px-6 py-2 font-medium transition-all duration-300 ease-out hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-purple-300/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              <span className="relative z-10">Post</span>
            </button>
          </DialogTrigger>
          <DialogContent>
            <CreatePost handleClose={handleCloseCreatePost} />
          </DialogContent>
        </Dialog>
      </div>
      <BorderBeam size={140} duration={12} delay={9} />
    </div>
  );
};

export default CreatePostSection;
