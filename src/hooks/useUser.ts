import { useState, useEffect, useCallback } from "react";
import {
  profileService,
  type UserProfileResponseDto,
} from "../services/profileService";

export const useUser = () => {
  const [userProfile, setUserProfile] = useState<UserProfileResponseDto | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const profileData = await profileService.getMyProfile();
      setUserProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile().catch(() => {});
  }, [fetchUserProfile]);

  return {
    userProfile,
    loading,
    error,
    refetch: fetchUserProfile,
    setUserProfile, // optional: allow manual updates
  };
};
