import { Briefcase, User } from "lucide-react";
import Avatar from "./Avatar";

interface ProfileInfoProps {
  userProfile: {
    avatarUrl?: string;
    name: string;
    username: string;
    jobTitle?: string;
    bio?: string;
  };
}

const ProfileInfo = ({ userProfile }: ProfileInfoProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 md:mb-0 md:mr-6">
      <Avatar src={userProfile?.avatarUrl} name={userProfile?.name} size="xl" />

      <div className="text-center sm:text-left">
        <h2 className="text-lg md:text-xl font-semibold text-[var(--main)] flex items-center gap-2">
          <User size={18} className="text-[var(--primary)]" />
          {userProfile?.name || "User"}
        </h2>

        <p className="text-[var(--dim)] text-sm mt-1 flex items-center gap-1">
          @{userProfile?.username || "username"}
        </p>

        {userProfile?.jobTitle && (
          <div className="flex items-center gap-2 mt-2 text-[var(--dim)]">
            <Briefcase size={16} className="text-[var(--primary)]" />
            <span className="text-sm md:text-medium font-medium">
              {userProfile.jobTitle}
            </span>
          </div>
        )}

        {userProfile?.bio && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 italic">"{userProfile.bio}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
