import { useFetch } from "../hooks/useFetch";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Star,
  DollarSign,
  User as UserIcon,
  X,
} from "lucide-react";
import Avatar from "../components/Avatar"; // Import the Avatar component
import profileService from "../services/profileService";

const Sidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const { data: userProfile, loading } = useFetch(profileService.getMyProfile);
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calculateProfileCompletion = (profile: any) => {
    if (!profile) return 0;

    let completed = 0;

    if (profile.bio) completed++;
    if (profile.avatarURL) completed++;
    if (profile.phoneNumber) completed++;
    if (profile.city) completed++;
    if (profile.tags && profile.tags.length > 0) completed++;
    if (profile.jobTitle) completed++;
    if (profile.university) completed++;
    if (profile.githubLink) completed++;
    if (profile.linkedinLink) completed++;

    return Math.round((completed / 9) * 100);
  };

  const completion = calculateProfileCompletion(userProfile);

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
                  {userProfile.country ? `, ${userProfile.country}` : ""}
                </span>
              </div>
            )}
          </div>

          {/* Mentor Info */}
          {userProfile?.role === "MENTOR" && (
            <div className="border-t pt-4 mb-4 items-center">
              {/* <h3 className="font-semibold text-gray-700 mb-3 flex items-center text-sm md:text-base">
                <UserIcon size={16} className="mr-2" />
                Mentor Information
              </h3> */}

              {userProfile?.jobTitle && (
                <div className="flex items-center mb-2">
                  <Briefcase size={14} className="mr-2 text-[var(--dim)]" />
                  <span className="text-xs md:text-sm text-[var(--dim)]">
                    {userProfile.jobTitle}
                  </span>
                </div>
              )}
              <div></div>
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
          <div className="flex items-center justify-evenly mb-2">
            {userProfile?.rating ||
              (userProfile?.rating === 0 && (
                <div className="flex flex-col items-center bg-orange-100 p-4 rounded-lg">
                  <p className="text-sm text-[var(--main)] font-semibold">
                    Rating
                  </p>
                  <div className="flex items-center">
                    <Star
                      size={14}
                      className="mr-2 text-yellow-500 fill-yellow-500"
                    />
                    <span className="text-xs md:text-sm text-[var(--dim)]">
                      {userProfile.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}

            {userProfile?.hourRate && (
              <div className="flex flex-col items-center bg-green-100 p-4 rounded-lg">
                <p className="text-sm text-[var(--main)] font-semibold">
                  Hourly rate
                </p>
                <div className="flex items-center">
                  <DollarSign size={14} className="mr-2 text-green-500" />
                  <span className="text-xs md:text-sm text-[var(--dim)]">
                    {userProfile.hourRate.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Complete profile hint */}
          <div className="w-full mb-4">
            <p className="text-xs text-gray-500 mb-1">
              Profile completed {completion}%
            </p>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-green-500 rounded-full"
                style={{ width: `${completion}%` }}
              ></div>
            </div>
          </div>
          <Button
            children="Complete your Profile"
            type="button"
            onClick={() => navigate("/profile")}
            color="primary"
            size="md"
          />

          <Button
            children="Add Availability"
            type="button"
            onClick={() => navigate("/availability")}
            color="primary"
            size="md"
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
