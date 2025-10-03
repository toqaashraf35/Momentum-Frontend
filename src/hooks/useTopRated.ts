import { useFetch } from "./useFetch";
import profileService, {
  type UserProfileResponseDto,
} from "../services/profileService";

export const useTopRated = () => {
  const {
    data: mentors,
    loading,
    error,
    refetch,
  } = useFetch(profileService.getTopRatedMentors);

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
    mentors,
    loading,
    error,
    refetch,
    convertToMentorCardProps,
  };
};
