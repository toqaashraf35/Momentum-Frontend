import { useFetch } from "../hooks/useFetch";
import {
  MapPin,
  Star,
  DollarSign,
  GraduationCap,
  Mail,
  Phone,
  Linkedin,
  Github,
  Briefcase,
  User,
} from "lucide-react";
import profileService from "../services/profileService";
import { useCallback } from "react";

interface PersonalInfoCardProps {
  userId?: number;
}

const PersonalInfoCard = ({ userId }: PersonalInfoCardProps) => {
  const isMyProfile = !userId;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchUser = useCallback(
    isMyProfile
      ? () => profileService.getMyProfile()
      : () => profileService.getAnotherProfile(userId!),
    [isMyProfile, userId]
  );

  const { data: userProfile, loading } = useFetch(fetchUser);
  

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="w-6 h-6 bg-gray-200 rounded-full mr-3"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="flex flex-wrap gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded w-16"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-gray-500">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Card Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <User size={18} className="mr-2 text-[var(--primary)]" />
          Personal Information
        </h3>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location */}
          {(userProfile?.city || userProfile?.country) && (
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Location</p>
                <p className="text-gray-600">
                  {userProfile?.city && userProfile?.country
                    ? `${userProfile.city}, ${userProfile.country}`
                    : userProfile?.city || userProfile?.country}
                </p>
              </div>
            </div>
          )}

          {/* Job Title */}
          {userProfile?.jobTitle && (
            <div className="flex items-start">
              <Briefcase className="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Job Title</p>
                <p className="text-gray-600">{userProfile.jobTitle}</p>
              </div>
            </div>
          )}

          {/* Rating - Fixed condition */}
          {(userProfile?.rating || userProfile?.rating === 0) && (
            <div className="flex items-start">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Rating</p>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">
                    {userProfile.rating?.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Price */}
          {userProfile?.hourRate && userProfile.hourRate > 0 && (
            <div className="flex items-start">
              <DollarSign className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Price</p>
                <p className="text-gray-600">
                  ${userProfile.hourRate.toFixed(2)}/hour
                </p>
              </div>
            </div>
          )}

          {/* University */}
          {userProfile?.university && (
            <div className="flex items-start">
              <GraduationCap className="w-5 h-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Education</p>
                <p className="text-gray-600">{userProfile.university}</p>
              </div>
            </div>
          )}

          {/* Email - Only show for own profile or if publicly visible */}
          {userProfile?.email && (isMyProfile || userProfile.email) && (
            <div className="flex items-start">
              <Mail className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <a
                  href={`mailto:${userProfile.email}`}
                  className="text-blue-600 hover:underline break-all"
                >
                  {userProfile.email}
                </a>
              </div>
            </div>
          )}

          {/* Phone Number - Only show for own profile or if publicly visible */}
          {userProfile?.phoneNumber &&
            (isMyProfile || userProfile.phoneNumber) && (
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <a
                    href={`tel:${userProfile.phoneCode}${userProfile.phoneNumber}`}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    {userProfile.phoneCode && `${userProfile.phoneCode} `}
                    {userProfile.phoneNumber}
                  </a>
                </div>
              </div>
            )}

          {/* LinkedIn */}
          {userProfile?.linkedinLink && (
            <div className="flex items-start">
              <Linkedin className="w-5 h-5 text-blue-700 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">LinkedIn</p>
                <a
                  href={userProfile.linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {userProfile.linkedinLink.length > 30
                    ? `${userProfile.linkedinLink.substring(0, 30)}...`
                    : userProfile.linkedinLink}
                </a>
              </div>
            </div>
          )}

          {/* GitHub */}
          {userProfile?.githubLink && (
            <div className="flex items-start">
              <Github className="w-5 h-5 text-gray-700 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">GitHub</p>
                <a
                  href={userProfile.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {userProfile.githubLink.length > 30
                    ? `${userProfile.githubLink.substring(0, 30)}...`
                    : userProfile.githubLink}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {userProfile?.tags && userProfile.tags.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Skills & Interests
            </p>
            <div className="flex flex-wrap gap-2">
              {userProfile.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoCard;
