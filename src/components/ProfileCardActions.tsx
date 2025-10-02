import { Edit3, UserPlus, UserRoundCheck, Calendar } from "lucide-react";
import Button from "./Button";

interface ProfileActionsProps {
  isOwnProfile: boolean | null;
  isFollowing: boolean;
  userRole?: string;
  loading: boolean;
  onEditProfile: () => void;
  onFollowToggle: () => void;
  onUnfollowConfirm: () => void;
}

const ProfileActions = ({
  isOwnProfile,
  isFollowing,
  userRole,
  loading,
  onEditProfile,
  onFollowToggle,
  onUnfollowConfirm,
}: ProfileActionsProps) => {
  if (isOwnProfile) {
    return (
      <Button
        children="Edit Profile"
        type="button"
        onClick={onEditProfile}
        color="primary"
        size="sm"
        isLoading={loading}
        icon={<Edit3 size={16} />}
      />
    );
  }

  return (
    <>
      <Button
        children={isFollowing ? "Unfollow" : "Follow"}
        type="button"
        color={isFollowing ? "secondary" : "primary"}
        size="xsm"
        isLoading={loading}
        icon={
          isFollowing ? <UserRoundCheck size={16} /> : <UserPlus size={16} />
        }
        onClick={isFollowing ? onUnfollowConfirm : onFollowToggle}
      />

      {userRole === "MENTOR" && (
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
  );
};

export default ProfileActions;
