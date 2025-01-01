import React, { useState } from "react";
import {
  ExternalLink,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  LockIcon,
} from "lucide-react";

const companyLogos = [
  {
    name: "Amazon",
    logo: "https://cdn.iconscout.com/icon/free/png-512/free-amazon-logo-icon-download-in-svg-png-gif-file-formats--70-flat-social-icons-color-pack-logos-432492.png?f=webp&w=256",
  },
  {
    name: "Google",
    logo: "https://cdn.iconscout.com/icon/free/png-512/free-google-icon-download-in-svg-png-gif-file-formats--logo-social-media-1507807.png?f=webp&w=256",
  },
  {
    name: "Meta",
    logo: "https://cdn.iconscout.com/icon/free/png-512/free-meta-logo-icon-download-in-svg-png-gif-file-formats--web-mobile-social-media-pack-logos-icons-3853259.png?f=webp&w=256",
  },
  {
    name: "Microsoft",
    logo: "https://cdn.iconscout.com/icon/free/png-512/free-microsoft-logo-icon-download-in-svg-png-gif-file-formats--windows-word-brand-logos-pack-icons-1583107.png?f=webp&w=256",
  },
  {
    name: "Apple",
    logo: "https://cdn.iconscout.com/icon/free/png-512/free-apple-logo-icon-download-in-svg-png-gif-file-formats--programming-language-logos-pack-icons-1174963.png?f=webp&w=256",
  },
  {
    name: "Netflix",
    logo: "https://cdn.iconscout.com/icon/free/png-512/free-netflix-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-vol-5-pack-logos-icons-2945044.png?f=webp&w=256",
  },
  {
    name: "Tesla",
    logo: "https://cdn.iconscout.com/icon/free/png-512/free-tesla-logo-icon-download-in-svg-png-gif-file-formats--car-logos-icons-892143.png?f=webp&w=256",
  },
  {
    name: "Adobe",
    logo: "https://cdn.iconscout.com/icon/free/png-512/free-adobe-logo-icon-download-in-svg-png-gif-file-formats--logos-pack-icons-761738.png?f=webp&w=256",
  },
  {
    name: "X",
    logo: "https://cdn.iconscout.com/icon/free/png-512/free-twitter-x-logo-icon-download-in-svg-png-gif-file-formats--social-media-logos-pack-icons-8589161.png?f=webp&w=256",
  },
  {
    name: "Spotify",
    logo: "https://cdn.iconscout.com/icon/free/png-512/free-spotify-logo-icon-download-in-svg-png-gif-file-formats--70-flat-social-icons-color-pack-logos-432546.png?f=webp&w=256",
  },
];

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const dummyJob = {
    title: "Software Engineering Intern",
    company: "Google",
    location: "Mountain View, CA",
    type: "Internship",
    salary: "$8,000/month",
    posted: "2 days ago",
    appliedCount: "126 applicants",
    skills: ["React", "TypeScript", "Node.js"],
    logo: "https://cdn.iconscout.com/icon/free/png-512/free-google-icon-download-in-svg-png-gif-file-formats--logo-social-media-1507807.png?f=webp&w=256",
    isComingSoon: true,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Internships and Jobs
        </h1>
        <p className="text-gray-400">
          Discover opportunities that match your skills and aspirations
        </p>

        {/* ... search inputs section ... */}

        <div className="mt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Location (or 'remote')"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-[#ae00ff45] flex items-center gap-2 justify-center text-white rounded-lg font-semibold hover:bg-opacity-80 transition-all duration-200"
            >
              Search
              <LockIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ... logos section ... */}
      <div className="relative overflow-hidden flex items-center mb-12 py-8">
        <div className="absolute left-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10" />
        <div className="flex animate-marquee">
          {[...companyLogos, ...companyLogos].map((company, index) => (
            <div
              key={index}
              className="mx-4 flex-shrink-0 bg-white flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-lg p-4"
            >
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="w-full h-full object-contain filter brightness-75 hover:brightness-100 transition-all duration-300"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-black rounded-xl p-6 mb-4 hover:bg-gray-800/50 transition-all duration-300 border border-gray-700 group">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-white p-2 flex-shrink-0">
              <img
                src={dummyJob.logo}
                alt={dummyJob.company}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-semibold text-xl text-white">
                  {dummyJob.title}
                </h3>
                <span className="text-purple-500 text-sm bg-purple-500/10 px-3 py-1 rounded-full">
                  {dummyJob.type}
                </span>
              </div>
              <div className="text-gray-400 flex flex-wrap gap-x-4 text-sm">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {dummyJob.salary}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {dummyJob.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {dummyJob.posted}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {dummyJob.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-gray-400 bg-gray-800 px-2 py-1 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:items-center">
            <button
              disabled
              className="bg-gray-700 text-gray-400 px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 cursor-not-allowed"
            >
              Coming Soon
              <LockIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-black rounded-xl p-6  hover:bg-gray-800/50 transition-all duration-300 border border-gray-700 group">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-white p-2 flex-shrink-0">
              <img
                src={dummyJob.logo}
                alt={dummyJob.company}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-semibold text-xl text-white">
                  {dummyJob.title}
                </h3>
                <span className="text-purple-500 text-sm bg-purple-500/10 px-3 py-1 rounded-full">
                  {dummyJob.type}
                </span>
              </div>
              <div className="text-gray-400 flex flex-wrap gap-x-4 text-sm">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {dummyJob.salary}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {dummyJob.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {dummyJob.posted}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {dummyJob.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-gray-400 bg-gray-800 px-2 py-1 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:items-center">
            <button
              disabled
              className="bg-gray-700 text-gray-400 px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 cursor-not-allowed"
            >
              Coming Soon
              <LockIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
