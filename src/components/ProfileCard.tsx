import { useState, useEffect, useCallback } from "react";
import { useFetch } from "../hooks/useFetch";
import {
  Edit3,
  Briefcase,
  User,
  Users,
  UserPlus,
  Calendar,
  UserRoundCheck,
} from "lucide-react";
import Avatar from "./Avatar";
import EditProfileModal from "./EditProfile";
import profileService from "../services/profileService";
import Button from "./Button";
import Alert from "./Alert";

const ProfileCard = ({ userId }: { userId?: number }) => {
  const isMyProfile = !userId;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchUser = useCallback(
    isMyProfile
      ? () => profileService.getMyProfile()
      : () => profileService.getAnotherProfile(userId!),
    [isMyProfile, userId]
  );

  const { data: userProfile, loading, refetch } = useFetch(fetchUser);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [myProfile, setMyProfile] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // ✅ Alert state
  const [isUnfollowAlertOpen, setIsUnfollowAlertOpen] = useState(false);

  useEffect(() => {
    profileService
      .getMyProfile()
      .then(setMyProfile)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (userProfile && myProfile) {
      setIsFollowing((userProfile.followersCount ?? 0) > 0);
    }
  }, [userProfile, myProfile]);

  const handleFollowToggle = async () => {
    if (!userProfile) return;

    try {
      if (isFollowing) {
        await profileService.unfollowProfile(userProfile.id);
        setIsFollowing(false);
      } else {
        await profileService.followProfile(userProfile.id);
        setIsFollowing(true);
      }
      await refetch();
    } catch (err) {
      console.error("Error while toggling follow:", err);
    }
  };

  if (loading || !userProfile) {
    return (
      <div className="flex flex-col md:flex-row md:items-center w-full justify-between bg-white border border-gray-300 rounded-lg p-4 md:p-6 lg:p-8 animate-pulse">
        {/* Avatar + Info */}
        <div className="flex flex-col md:flex-row md:items-center w-full">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 md:mb-0 md:mr-6">
            {/* Avatar skeleton */}
            <div className="w-20 h-20 rounded-full bg-gray-200"></div>

            <div className="text-center sm:text-left space-y-2">
              {/* Name skeleton */}
              <div className="h-5 w-32 bg-gray-200 rounded"></div>

              {/* Username skeleton */}
              <div className="h-4 w-24 bg-gray-200 rounded"></div>

              {/* Job title skeleton */}
              <div className="h-4 w-28 bg-gray-200 rounded"></div>

              {/* Bio skeleton */}
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="h-4 w-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          {/* Followers / Following skeleton */}
          <div className="flex justify-center sm:justify-start space-x-6 md:space-x-8 mt-4 md:mt-0 md:ml-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-200">
            <div className="text-center flex flex-col items-center">
              <div className="w-10 h-5 bg-gray-200 rounded mb-1"></div>
              <div className="w-12 h-3 bg-gray-200 rounded"></div>
            </div>

            <div className="text-center flex flex-col items-center">
              <div className="w-10 h-5 bg-gray-200 rounded mb-1"></div>
              <div className="w-12 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Actions skeleton */}
        <div className="mt-4 md:mt-0 md:ml-4 flex justify-center md:justify-end gap-2">
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const isOwnProfile = myProfile && myProfile.id === userProfile.id;

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
        {/* Actions */}
        <div className="mt-4 md:mt-0 md:ml-4 flex justify-center md:justify-end gap-2">
          {isOwnProfile ? (
            <Button
              children="Edit Profile"
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              color="primary"
              size="sm"
              isLoading={loading}
              icon={<Edit3 size={16} />}
            />
          ) : (
            <>
              <Button
                children={isFollowing ? "Unfollow" : "Follow"}
                type="button"
                color={isFollowing ? "secondary" : "primary"}
                size="xsm"
                isLoading={loading}
                icon={
                  isFollowing ? (
                    <UserRoundCheck size={16} />
                  ) : (
                    <UserPlus size={16} />
                  )
                }
                onClick={() => {
                  if (isFollowing) {
                    setIsUnfollowAlertOpen(true);
                  } else {
                    handleFollowToggle();
                  }
                }}
              />

              {userProfile.role === "MENTOR" && (
                <Button
                  children="Book session"
                  type="button"
                  color="primary"
                  size="sm"
                  isLoading={loading}
                  icon={<Calendar size={16} />}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isOwnProfile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* ✅ Unfollow Alert */}
      {isUnfollowAlertOpen && (
        <Alert
          title="Confirm Unfollow"
          description={`Are you sure you want to unfollow ${userProfile?.name}?`}
          confirmText="Yes, Unfollow"
          cancelText="Cancel"
          onCancel={() => setIsUnfollowAlertOpen(false)}
          onConfirm={async () => {
            await handleFollowToggle();
            setIsUnfollowAlertOpen(false);
          }}
        />
      )}
    </>
  );
};

export default ProfileCard;
