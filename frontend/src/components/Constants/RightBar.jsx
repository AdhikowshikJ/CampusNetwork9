import React from "react";
import { RocketIcon, CalendarIcon, UsersIcon } from "lucide-react";
import { Link } from "react-router-dom";
import StudentOfWeek from "../Reusable/SOW";
import Meteors from "../ui/meteors";

const ComingSoonCard = ({ icon: Icon, title, description, iconColor }) => (
  <div className="bg-black rounded-xl relative overflow-hidden p-4 mb-4  border border-gray-700 transform transition-all duration-300 hover:scale-102 hover:shadow-lg">
    <Meteors number={40} className="-z-10" />
    <div className="flex items-center mb-3">
      <Icon className={`w-6 h-6 ${iconColor} mr-2`} />
      <h2 className="text-lg font-bold text-white">{title}</h2>
    </div>
    <div className="relative overflow-hidden rounded-lg  p-4">
      <div className="absolute -right-6 -top-6 h-24 w-24">
        <div className="absolute transform rotate-45 bg-blue-500/10 h-12 w-32"></div>
      </div>
      <p className="text-gray-400 text-sm mb-3">{description}</p>
      <div className="flex items-center">
        <span className="inline-flex items-center rounded-full border border-purple-600 bg-gray-900 px-3 py-1 text-sm font-medium text-purple-600">
          Coming Soon
        </span>
      </div>
    </div>
  </div>
);

function RightBar() {
  const comingSoonFeatures = [
    {
      icon: RocketIcon,
      title: "Tech Updates",
      description:
        "Stay ahead with the latest technology trends, news, and innovations in the tech world.",
      iconColor: "text-yellow-400",
    },
    {
      icon: CalendarIcon,
      title: "Events",
      description:
        "Discover upcoming workshops, hackathons, and tech conferences tailored for you.",
      iconColor: "text-green-400",
    },
    {
      icon: UsersIcon,
      title: "Clubs",
      description:
        "Join and collaborate with like-minded peers in various tech-focused clubs and communities.",
      iconColor: "text-orange-400",
    },
  ];

  return (
    <div className="w-full max-w-[350px] p-4 hidden overflow-auto min-h-screen no-scrollbar lg:block">
      <StudentOfWeek />
      <div className=" my-2 border border-gray-900 rounded-lg " />
      <h2 className="text-xl font-bold text-white mb-4">Upcoming Features</h2>

      <div className="space-y-4">
        {comingSoonFeatures.map((feature, index) => (
          <ComingSoonCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            iconColor={feature.iconColor}
          />
        ))}
      </div>
    </div>
  );
}

export default RightBar;
