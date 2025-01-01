import React, { useState } from "react";
import { MagnifyingGlassIcon, BellIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function SearchDialog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      setSearchResults([]);
      return;
    }

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MagnifyingGlassIcon className="w-6 h-6" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black border border-gray-700">
        <div className="grid gap-4">
          <div className="relative mb-4 mt-3">
            <input
              type="text"
              placeholder="Search Campus Network"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-12 text-highlight pr-4 py-3 bg-gray-800 rounded-full border border-gray-800 focus:outline-none focus:border-[#ae00ff"
            />
            <MagnifyingGlassIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between mb-4"
              >
                <Link to={`/${user.username}`}>
                  <div className="flex items-center">
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold text-highlight">
                        {user.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        @{user.email.split("@")[0]} · {user?.section}
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

function MobileTopBar() {
  return (
    <div className="sticky z-20 top-0 bg-black bg-opacity-80 backdrop-blur-sm p-4 border-b border-gray-800 flex justify-between items-center md:hidden">
      <img
        src="https://www.creativefabrica.com/wp-content/uploads/2021/09/25/NC-CN-logo-design-vector-Graphics-17819044-1.jpg"
        alt="Logo"
        className="w-8 h-8 rounded-full object-fill"
      />
      <div className="flex items-center space-x-4">
        <SearchDialog />
        <Link to="/notifications">
          <BellIcon className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}

export default MobileTopBar;
