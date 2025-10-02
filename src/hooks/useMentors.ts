import { useState, useCallback } from "react";
import { useFetch } from "./useFetch";
import profileService, {
  type UserProfileResponseDto,
} from "../services/profileService";

export const useMentors = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const fetchMentors = useCallback(
    () => profileService.getMentors(currentPage),
    [currentPage]
  );

  const { data: mentorsPage, loading, error, refetch } = useFetch(fetchMentors);

  const convertToMentorCardProps = (mentor: UserProfileResponseDto) => ({
    type: "mentor" as const,
    id: mentor.id.toString(),
    avatar: mentor.avatarUrl,
    name: mentor.name,
    username: mentor.username,
    jobTitle: mentor.jobTitle || "Mentor",
    rating: mentor.rating || 0.0,
    hourRate: mentor.hourRate || 5,
  });

  return {
    currentPage,
    setCurrentPage,
    mentorsPage,
    loading,
    error,
    refetch,
    convertToMentorCardProps,
  };
};
