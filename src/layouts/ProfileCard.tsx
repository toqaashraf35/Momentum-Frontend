import { useState } from "react";
import { useUser } from "../hooks/useUser";
import { Edit3, Briefcase, User, Users, UserPlus } from "lucide-react";
import Avatar from "../components/Avatar";
import EditProfileModal from "../components/EditProfile"; // Import the modal component

const ProfileCard = () => {
  const { userProfile, loading } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for modal visibility

  if (loading) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-6 animate-pulse">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-full"></div>
          <div className="flex-1 text-center sm:text-left">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2 mx-auto sm:mx-0"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 mx-auto sm:mx-0"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto sm:mx-0"></div>
          </div>
          <div className="h-9 bg-gray-200 rounded w-24 md:w-28"></div>
        </div>
        <div className="flex justify-center sm:justify-start space-x-6 mt-4 pt-4 border-t border-gray-200">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center w-full justify-between bg-white border border-gray-300 rounded-lg p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center w-full">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 md:mb-0 md:mr-6">
            <Avatar
              src={userProfile?.avatarURL}
              name={userProfile?.name}
              size="xl"
            />

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
                  <p className="text-sm text-gray-600 italic">
                    "{userProfile.bio}"
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center sm:justify-start space-x-6 md:space-x-8 mt-4 md:mt-0 md:ml-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-200">
            <div className="text-center flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                <Users size={16} className="text-[var(--primary)]" />
                <span className="block text-lg font-semibold text-[var(--main)]">
                  {userProfile?.followersCount || 0}
                </span>
              </div>
              <span className="text-xs md:text-sm text-[var(--dim)]">
                Followers
              </span>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1">
                <UserPlus size={16} className="text-[var(--primary)]" />
                <span className="block text-lg font-semibold text-[var(--main)]">
                  {userProfile?.followingCount || 0}
                </span>
              </div>
              <span className="text-xs md:text-sm text-[var(--dim)]">
                Following
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0 md:ml-4 flex justify-center md:justify-end">
          <button
            className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] transition-colors text-sm font-medium w-full md:w-auto justify-center shadow-md hover:shadow-lg"
            onClick={() => setIsEditModalOpen(true)} // Open modal on click
          >
            <Edit3 size={16} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
};

export default ProfileCard;
