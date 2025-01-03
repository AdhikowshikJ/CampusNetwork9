import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeftIcon,
  PlusIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import useAuthStore from "../Store/authStore";
import Loader from "../Reusable/Loader";
const skillOptions = [
  "Web Development",
  "Android Development",
  "iOS Development",
  "Data Science",
  "Machine Learning",
  "UI/UX Design",
  "Graphic Design",
  "Content Writing",
  "Digital Marketing",
  "Photography",
  "Videography",
  "Video Editing",
  "Animation",
  "3D Modeling",
  "Game Development",
  "Dancing",
  "Singing",
  "Music Production",
  "Acting",
  "Public Speaking",
  "Content Creation",
  "Social Media Management",
  "Event Management",
  "Project Management",
  "Leadership",
  "Team Management",
  "Problem Solving",
  "Critical Thinking",
  "Product Management",
  "Blockchain Development",
  "Cloud Computing",
  "Cybersecurity",
  "Art & Illustration",
  "Creative Writing",
  "Technical Writing",
  "Data Analytics",
  "Business Analysis",
  "Digital Art",
  "Sports",
  "Fitness Training",
  "Teaching/Mentoring",
  "Research",
  "Entrepreneurship",
].sort();

const iconMapping = {
  "facebook.com": <FaFacebook />, // Replace with actual icon class names or URLs
  "twitter.com": <FaTwitter />,
  "instagram.com": <FaInstagram />,
  "linkedin.com": <FaLinkedin />,
  "github.com": <FaGithub />,
  // Add more mappings as needed
};
const branchOptions = [
  "CSE",
  "IT",
  "CSM",
  "CS",
  "CSD",
  "AI/ML",
  "ECE",
  "EEE",
  "ANE",
];

const sectionOptions = [
  "I-A",
  "I-B",
  "I-C",
  "I-D",
  "I-E",
  "I-F",
  "I-G",
  "II-A",
  "II-B",
  "II-C",
  "II-D",
  "II-E",
  "II-F",
  "II-G",
  "III-A",
  "III-B",
  "III-C",
  "III-D",
  "IV-A",
  "IV-B",
  "IV-C",
  "IV-D",
];
export default function EditProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [bioLinks, setBioLinks] = useState([]);
  const [branch, setBranch] = useState("");
  const [section, setSection] = useState("");
  const authUser = useAuthStore((state) => state.user);
  const handleBranchChange = (value) => {
    setBranch(value);
    setUser((prevUser) => ({
      ...prevUser,
      branch: value,
    }));
  };

  const handleSectionChange = (value) => {
    setSection(value);
    setUser((prevUser) => ({
      ...prevUser,
      section: value,
    }));
  };
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/getUserByName/${username}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        setUser(response.data.user);
        console.log("user", response.data.user);
        setSocialLinks(response.data.user.socialLinks || []);
        setBioLinks(response.data.user.bioLinks || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    }
    fetchUser();
  }, [username]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "profile") {
      setProfileImage(file);
    } else if (type === "banner") {
      setBannerImage(file);
    }
  };

  const handleSkillChange = (e) => {
    const value = e.target.value;
    if (!user.skills.includes(value) && value !== "") {
      setUser((prevUser) => ({
        ...prevUser,
        skills: [...(prevUser.skills || []), value],
      }));
    }
  };

  const addSkill = () => {
    setUser((prevUser) => ({
      ...prevUser,
      skills: [...prevUser.skills, ""],
    }));
  };

  const removeSkill = (index) => {
    const newSkills = user.skills.filter((_, i) => i !== index);
    setUser((prevUser) => ({
      ...prevUser,
      skills: newSkills,
    }));
  };
  const handleBioLinkChange = (index, field, value) => {
    const newLinks = [...bioLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setBioLinks(newLinks);
  };

  const addBioLink = () => {
    setBioLinks([...bioLinks, { label: "", url: "" }]);
  };

  const removeBioLink = (index) => {
    setBioLinks(bioLinks.filter((_, i) => i !== index));
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "campusnetwork");
    data.append("cloud_name", "campusn");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/campusn/image/upload",
        data
      );
      return res.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const profileImageUrl = await uploadImage(profileImage);
      const bannerImageUrl = await uploadImage(bannerImage);

      const updatedUser = {
        ...user,
        profileImage: profileImageUrl || user.profileImage,
        bannerImage: bannerImageUrl || user.bannerImage,
        bioLinks,
        branch,
        section,
      };

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/updateProfile`,
        updatedUser,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      navigate(`/${username}`);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <Loader bool={true} />;
  }

  return (
    <div className="container mx-auto  w-full max-w-3xl py-12 px-4 md:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <Link to={`/${username}`} className="block sm:hidden">
          <ArrowLeftIcon className="h-6 w-6 cursor-pointer mb-8" />
        </Link>
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={user.username || ""}
              onChange={handleInputChange}
              className="mt-1 border border-gray-700"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={user.bio || ""}
            onChange={handleInputChange}
            className="mt-1 border border-gray-700"
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="profileImage">Profile Image</Label>
          <Input
            id="profileImage"
            name="profileImage"
            type="file"
            onChange={(e) => handleFileChange(e, "profile")}
            className="mt-1 
            border border-gray-700
            "
          />
        </div>
        <div>
          <Label htmlFor="bannerImage">Banner Image</Label>
          <Input
            id="bannerImage"
            name="bannerImage"
            type="file"
            onChange={(e) => handleFileChange(e, "banner")}
            className="mt-1 border border-gray-700"
          />
        </div>
        <div>
          <Label>Skills</Label>
          {user.skills &&
            user.skills.map((skill, index) => (
              <div key={index} className="flex items-center mt-2">
                <div
                  className="flex-grow px-3  py-2 border border-gray-700
                rounded-md bg-black"
                >
                  {skill}
                </div>
                <Button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="ml-2 p-2"
                  variant="destructive"
                >
                  <XCircleIcon className="h-5 w-5" />
                </Button>
              </div>
            ))}
          <div className="mt-2">
            <select
              onChange={handleSkillChange}
              className="w-full py-2 px-3 border border-gray-700 bg-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm "
            >
              <option value="">Select a skill</option>
              {skillOptions.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label>Branch</Label>
          {authUser && authUser.branch ? (
            <div className="block w-full py-2 px-3 border border-gray-700 mt-2 bg-black rounded-md shadow-sm text-white">
              {authUser.branch}
            </div>
          ) : (
            <select
              name="branch"
              value={branch}
              onChange={(e) => handleBranchChange(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-700 bg-black text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a branch</option>
              {branchOptions.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <Label>Section</Label>
          {authUser && authUser.section ? (
            <div className="block w-full py-2 px-3 border border-gray-700 mt-2 bg-black rounded-md shadow-sm text-white">
              {authUser.section}
            </div>
          ) : (
            <select
              name="section"
              value={section}
              onChange={(e) => handleSectionChange(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
            >
              <option value="">Select a section</option>
              {sectionOptions.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <Label>Bio Links</Label>
          {bioLinks.map((link, index) => (
            <div key={index} className="flex items-center mt-2 space-x-2">
              <Input
                value={link.label}
                onChange={(e) =>
                  handleBioLinkChange(index, "label", e.target.value)
                }
                placeholder="Label"
                className="flex-grow"
              />
              <Input
                value={link.url}
                onChange={(e) =>
                  handleBioLinkChange(index, "url", e.target.value)
                }
                placeholder="URL"
                className="flex-grow"
              />
              <Button
                type="button"
                onClick={() => removeBioLink(index)}
                className="p-2"
                variant="destructive"
              >
                <XCircleIcon className="h-5 w-5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={addBioLink}
            className="mt-2 flex items-center"
            variant="outline"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Bio Link
          </Button>
        </div>
        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
