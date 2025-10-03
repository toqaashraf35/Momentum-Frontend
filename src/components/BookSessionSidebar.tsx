import React from "react";
import IdentificationCard, {
  type MentorCardProps,
} from "./IdentificationCard";

interface MentorSidebarProps {
  mentor: {
    id: number;
    avatarURL?: string;
    name: string;
    username: string;
    jobTitle?: string;
    rating?: number;
    hourRate?: number;
    tags?: string[];
  };
}

const MentorSidebar: React.FC<MentorSidebarProps> = ({ mentor }) => {
  const mentorCardProps: MentorCardProps = {
    type: "mentor",
    id: mentor.id.toString(),
    avatar: mentor.avatarURL,
    name: mentor.name,
    username: mentor.username,
    jobTitle: mentor.jobTitle || "Mentor",
    rating: mentor.rating || 0,
    hourRate: mentor.hourRate || 0,
  };

  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="sticky top-6 space-y-6">
        <IdentificationCard {...mentorCardProps} />

        {/* Skills/Tags Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Skills & Specializations
          </h3>
          <div className="flex flex-wrap gap-2">
            {mentor.tags && mentor.tags.length > 0 ? (
              mentor.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No skills listed</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorSidebar;
