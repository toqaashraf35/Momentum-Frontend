// components/IdentificationCardComponent.tsx
import React, { useState } from "react";
import Button from "./Button";
import Avatar from "./Avatar";

export type CardType = "community" | "mentor";

export interface CommunityCardProps {
  type: "community";
  id: string;
  image: string;
  name: string;
  description: string;
  membersCount: number;
  isJoined?: boolean;
  onJoin?: (id: string) => void;
}

export interface MentorCardProps {
  type: "mentor";
  id: string;
  avatar?: string | null;
  name: string;
  username: string;
  jobTitle: string;
  rating: number;
  hourRate: number;
  onBookSession?: (id: string) => void;
}

type IdentificationCardProps = CommunityCardProps | MentorCardProps;

const IdentificationCard: React.FC<IdentificationCardProps> = (
  props
) => {
  const [isHovered, setIsHovered] = useState(false);

  // Render Community Card
  if (props.type === "community") {
    const { image, name, description, membersCount, isJoined, onJoin } = props;

    return (
      <div
        className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Community Image */}
        <div className="w-full h-48 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Community Info */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {description}
          </p>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">
              {membersCount.toLocaleString()} عضو
            </span>

            <Button
              onClick={() => onJoin?.(props.id)}
              disabled={isJoined}
              className={`w-32 ${
                isJoined ? "bg-gray-400 hover:bg-gray-400" : ""
              }`}
            >
              {isJoined ? "Joined" : "Join"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render Mentor Card
  if (props.type === "mentor") {
    const {
      avatar,
      name,
      username,
      jobTitle,
      rating,
      hourRate,
      onBookSession,
    } = props;

    return (
      <div
        className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-4">
          {/* Mentor Header */}
          <div className="flex items-start gap-3 mb-2">
            <Avatar src={avatar} name={name} size="lg" />

            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">{name}</h3>
              <p className="text-gray-500 text-sm">@{username}</p>
            </div>
          </div>
          <p className="text-[var(--primary)] text-center rounded-lg p-2 bg-[var(--light)] text-sm mt-1 mb-4">
            {jobTitle}
          </p>

          {/* Mentor Details */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-1">
              <svg
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-gray-700 font-medium">
                {rating.toFixed(1)}
              </span>
            </div>

            <div className="text-right">
              <span className="text-gray-700 ">${hourRate}/hour</span>
            </div>
          </div>

          {/* Book Session Button - Shows on Hover */}
          <div
            className={`transition-all duration-300 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            <Button
              onClick={() => onBookSession?.(props.id)}
              className="w-full"
            >
              Book session
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default IdentificationCard;
