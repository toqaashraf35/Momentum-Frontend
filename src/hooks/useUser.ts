import { useState, useEffect } from "react";
import profileService, {
  type UserProfileResponseDto,
} from "../services/profileService";

export const useUser = () => {
  const [userProfile, setUserProfile] = useState<UserProfileResponseDto | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const profileData = await profileService.getMyProfile();
        setUserProfile(profileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      const profileData = await profileService.getMyProfile();
      setUserProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    userProfile,
    loading,
    error,
    refetch,
  };
};
