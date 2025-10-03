import { Edit3, UserPlus, UserRoundCheck, Calendar } from "lucide-react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

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

  const handleBookSession = (mentorId: string) => {
    navigate(`/booking/${mentorId}`);
    console.log("Book session with mentor:", mentorId);
  };

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
          onClick={() => handleBookSession}
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
