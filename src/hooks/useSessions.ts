import { useEffect, useState } from "react";
import { bookingService, type BookingResponseDTO } from "../services/bookingService";
import profileService from "../services/profileService";
import { useFetch } from "./useFetch";

export const useSessions = () => {
  const [bookings, setBookings] = useState<BookingResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: userProfile } = useFetch(profileService.getMyProfile);

  const fetchBookings = async () => {
    if (!userProfile?.role) return; 

    setLoading(true);
    setError(null);
    try {
      const data =
        userProfile.role === "MENTOR"
          ? await bookingService.getMentorBookings()
          : await bookingService.getLearnerBookings();
      setBookings(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          `Failed to fetch ${userProfile.role} bookings`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userProfile?.role]); 

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
  };
};
