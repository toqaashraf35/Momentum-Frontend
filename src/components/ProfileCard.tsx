import { useState } from "react";
import { useProfileCard } from "../hooks/useProfileCard";
import EditProfileModal from "./EditProfile";
import FollowersFollowingModal from "./FollowersFollowingModal";
import Alert from "./Alert";
import ProfileCardSkeleton from "./ProfileCardSkeleton";
import ProfileInfo from "./ProfileCardInfo";
import FollowStats from "./FollowStats";
import ProfileActions from "./ProfileCardActions";

interface ProfileCardProps {
  userId?: number;
}

const ProfileCard = ({ userId }: ProfileCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [isUnfollowAlertOpen, setIsUnfollowAlertOpen] = useState(false);

  const {
    userProfile,
    loading,
    isFollowing,
    followers,
    following,
    isLoadingFollowers,
    isLoadingFollowing,
    isOwnProfile,
    handleFollowToggle,
    handleOpenFollowers,
    handleOpenFollowing,
  } = useProfileCard(userId);

  if (loading || !userProfile) {
    return <ProfileCardSkeleton />;
  }

  const handleConfirmUnfollow = async () => {
    await handleFollowToggle();
    setIsUnfollowAlertOpen(false);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center w-full justify-between bg-white border border-gray-300 rounded-lg p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center w-full">
          <ProfileInfo userProfile={userProfile} />

          <FollowStats
            followersCount={userProfile.followersCount || 0}
            followingCount={userProfile.followingCount || 0}
            onOpenFollowers={() => {
              handleOpenFollowers();
              setIsFollowersModalOpen(true);
            }}
            onOpenFollowing={() => {
              handleOpenFollowing();
              setIsFollowingModalOpen(true);
            }}
            isLoadingFollowers={isLoadingFollowers}
            isLoadingFollowing={isLoadingFollowing}
          />
        </div>

        {/* Actions */}
        <div className="mt-4 md:mt-0 md:ml-4 flex justify-center md:justify-end gap-2">
          <ProfileActions
            isOwnProfile={isOwnProfile}
            isFollowing={isFollowing}
            userRole={userProfile.role}
            loading={loading}
            onEditProfile={() => setIsEditModalOpen(true)}
            onFollowToggle={handleFollowToggle}
            onUnfollowConfirm={() => setIsUnfollowAlertOpen(true)}
          />
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isOwnProfile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Followers Modal */}
      <FollowersFollowingModal
        isOpen={isFollowersModalOpen}
        onClose={() => setIsFollowersModalOpen(false)}
        type="followers"
        users={followers}
        title="Followers"
      />

      {/* Following Modal */}
      <FollowersFollowingModal
        isOpen={isFollowingModalOpen}
        onClose={() => setIsFollowingModalOpen(false)}
        type="following"
        users={following}
        title="Following"
      />

      {/* Unfollow Alert */}
      {isUnfollowAlertOpen && (
        <Alert
          title="Confirm Unfollow"
          description={`Are you sure you want to unfollow ${userProfile?.name}?`}
          confirmText="Yes, Unfollow"
          cancelText="Cancel"
          onCancel={() => setIsUnfollowAlertOpen(false)}
          onConfirm={handleConfirmUnfollow}
        />
      )}
    </>
  );
};

export default ProfileCard;