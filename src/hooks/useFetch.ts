// import { useState, useEffect, useCallback } from "react";
// import {
//   profileService,
//   type UserProfileResponseDto,
// } from "../services/profileService";

// export const useUser = () => {
//   const [userProfile, setUserProfile] = useState<UserProfileResponseDto | null>(
//     null
//   );
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchUserProfile = useCallback(async () => {
//     try {
//       setLoading(true);
//       const profileData = await profileService.getMyProfile();
//       setUserProfile(profileData);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     let isMounted = true;
//     fetchUserProfile().catch(() => {});
//     return () => {
//       isMounted = false;
//     };
//   }, [fetchUserProfile]);

//   return {
//     userProfile,
//     loading,
//     error,
//     refetch: fetchUserProfile,
//     setUserProfile, // optional: allow manual updates
//   };
// };

import { useState, useEffect, useCallback } from "react";

export const useFetch = <T>(fetcher: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    fetchData().catch(() => {});
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, setData };
};
