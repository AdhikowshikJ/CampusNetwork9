import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function SearchDialog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      setSearchResults([]);
      return;
    }
    console.log(searchResults);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/searchUsers?query=${
          e.target.value
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setSearchResults(data.users);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleOpen = () => {
    setIsDialogOpen(true);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center lg:justify-start justify-center w-full text-lg rounded-full p-1 pl-2 hover:bg-gray-800"
          onClick={handleOpen}
        >
          <MagnifyingGlassIcon className="w-6 h-6 lg:mr-4" />
          <span className="lg:block hidden">Search</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black border border-gray-700">
        <div className="grid gap-4">
          <div className="relative mb-4 mt-3">
            <input
              type="text"
              placeholder="Search Campus Network"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-12 text-highlight pr-4 py-3 bg-gray-800 rounded-full border border-gray-800 focus:outline-none focus:border-[#ae00ff]"
            />
            <MagnifyingGlassIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {searchResults.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between mb-4"
              >
                <Link to={`${user.username}`} onClick={handleClose}>
                  <div className="flex items-center">
                    <img
                      src={user?.profileImage}
                      alt={user.username}
                      className="w-10 h-10 rounded-full mr-3"
                    />

                    <div>
                      <p className="font-semibold text-highlight">
                        {user.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        @{user.email.split("@")[0]} · {user.section}
                      </p>
                    </div>
                  </div>
                </Link>
                <Button
                  className="bg-accent text-highlight"
                  variant="filled"
                  size="sm"
                >
                  {user.branch}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SearchDialog;
