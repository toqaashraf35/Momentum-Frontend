import { useState, useEffect, useCallback } from "react";
import { useFetch } from "./useFetch";
import profileService, {
  type UserProfileResponseDto,
} from "../services/profileService";

export const useProfileCard = (userId?: number) => {
  const isMyProfile = !userId;
  const [myProfile, setMyProfile] = useState<UserProfileResponseDto | null>(
    null
  );
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState<UserProfileResponseDto[]>([]);
  const [following, setFollowing] = useState<UserProfileResponseDto[]>([]);
  const [isLoadingFollowers, setIsLoadingFollowers] = useState(false);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);

  const fetchUser = useCallback(
    isMyProfile
      ? () => profileService.getMyProfile()
      : () => profileService.getAnotherProfile(userId!),
    [isMyProfile, userId]
  );

  const { data: userProfile, loading, refetch } = useFetch(fetchUser);

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

  const handleOpenFollowers = async () => {
    if (!userProfile) return;

    setIsLoadingFollowers(true);
    try {
      const followersData = await profileService.getAllFollowers();
      setFollowers(followersData);
    } catch (err) {
      console.error("Error fetching followers:", err);
    } finally {
      setIsLoadingFollowers(false);
    }
  };

  const handleOpenFollowing = async () => {
    if (!userProfile) return;

    setIsLoadingFollowing(true);
    try {
      const followingData = await profileService.getAllFollowing();
      setFollowing(followingData);
    } catch (err) {
      console.error("Error fetching following:", err);
    } finally {
      setIsLoadingFollowing(false);
    }
  };

  const isOwnProfile = myProfile && myProfile.id === userProfile?.id;

  return {
    userProfile,
    loading,
    myProfile,
    isFollowing,
    followers,
    following,
    isLoadingFollowers,
    isLoadingFollowing,
    isOwnProfile,
    handleFollowToggle,
    handleOpenFollowers,
    handleOpenFollowing,
    refetch,
  };
};
