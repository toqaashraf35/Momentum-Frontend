import { useUser } from "../hooks/useUser";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Star,
  DollarSign,
  GraduationCap,
  Link,
  Github,
  Linkedin,
  User as UserIcon,
  X,
} from "lucide-react";
import Avatar from "../components/Avatar"; // Import the Avatar component

const Sidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const { userProfile, loading } = useUser();
  const navigate = useNavigate();

  if (loading) {
    return (
      <aside className="w-72 bg-white shadow-lg p-4 md:p-6 h-screen fixed top-0 left-0 overflow-y-auto z-40 md:z-auto">
        <div className="animate-pulse">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[var(--border)] mx-auto mb-4"></div>
          <div className="h-6 bg-[var(--border)] rounded mb-2"></div>
          <div className="h-4 bg-[var(--border)] rounded mb-4 w-2/3 mx-auto"></div>
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 z-40
          md:relative md:translate-x-0 md:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4 md:pt-10 h-full overflow-y-auto">
          <button
            className="md:hidden p-2 absolute top-4 right-4 rounded-full hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6">
            <Avatar
              src={userProfile?.avatarURL}
              name={userProfile?.name}
              size="lg"
            />

            <h2 className="text-lg md:text-xl font-bold mt-4 text-center text-[var(--main)]">
              {userProfile?.name}
            </h2>

            <p className="text-[var(--dim)] text-sm mt-1">
              @{userProfile?.username}
            </p>

            {userProfile?.city && (
              <div className="flex items-center justify-center mt-2 text-sm text-[var(--dim)]">
                <MapPin size={14} className="mr-1" />
                <span>
                  {userProfile.city}
                  {userProfile.country
                    ? `, ${userProfile.country}`
                    : ""}
                </span>
              </div>
            )}
          </div>

          {/* Mentor Info */}
          {userProfile?.role === "MENTOR" && (
            <div className="border-t pt-4 mb-4">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center text-sm md:text-base">
                <UserIcon size={16} className="mr-2" />
                Mentor Information
              </h3>

              {userProfile?.jobTitle && (
                <div className="flex items-center mb-2">
                  <Briefcase size={14} className="mr-2 text-[var(--dim)]" />
                  <span className="text-xs md:text-sm text-[var(--dim)]">
                    {userProfile.jobTitle}
                  </span>
                </div>
              )}

              {userProfile?.rating && (
                <div className="flex items-center mb-2">
                  <Star
                    size={14}
                    className="mr-2 text-yellow-500 fill-yellow-500"
                  />
                  <span className="text-xs md:text-sm text-[var(--dim)]">
                    {userProfile.rating.toFixed(1)} Rating
                  </span>
                </div>
              )}

              {userProfile?.hourRate && (
                <div className="flex items-center mb-2">
                  <DollarSign size={14} className="mr-2 text-green-500" />
                  <span className="text-xs md:text-sm text-[var(--dim)]">
                    ${userProfile.hourRate.toFixed(2)}/session
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Education */}
          {userProfile?.university && (
            <div className="border-t pt-4 mb-4">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center text-sm md:text-base">
                <GraduationCap size={16} className="mr-2" />
                Education
              </h3>
              <span className="text-xs md:text-sm text-[var(--dim)]">
                {userProfile.university}
              </span>
            </div>
          )}

          {/* About */}
          {userProfile?.bio && (
            <div className="border-t pt-4 mb-4">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center text-sm md:text-base">
                <UserIcon size={16} className="mr-2" />
                About
              </h3>
              <p className="text-xs md:text-sm text-[var(--dim)] leading-relaxed">
                {userProfile.bio}
              </p>
            </div>
          )}

          {/* Social Links */}
          {(userProfile?.linkedinLink || userProfile?.githubLink) && (
            <div className="border-t pt-4 mb-4">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center text-sm md:text-base">
                <Link size={16} className="mr-2" />
                Connect
              </h3>
              <div className="flex space-x-3">
                {userProfile?.linkedinLink && (
                  <a
                    href={userProfile.linkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--primary)] hover:text-[var(--secondary)]"
                  >
                    <Linkedin size={18} />
                  </a>
                )}
                {userProfile?.githubLink && (
                  <a
                    href={userProfile.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    <Github size={18} />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {userProfile?.tags && userProfile.tags.length > 0 && (
            <div className="border-t pt-4 mb-4">
              <h3 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">
                Skills & Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {userProfile?.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-[var(--secondary)] text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Complete profile hint */}
          {!userProfile?.bio &&
            !userProfile?.university &&
            !userProfile?.linkedinLink &&
            !userProfile?.githubLink &&
            (!userProfile?.tags || userProfile.tags.length === 0) && (
              <div className="border-t pt-4 text-center">
                <p className="text-xs md:text-sm text-[var(--dim)] mb-3">
                  Complete your profile to showcase more information
                </p>
                <Button
                  children="Edit Profile"
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="text-xs md:text-sm px-3 py-1.5"
                />
              </div>
            )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
