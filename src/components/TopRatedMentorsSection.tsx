import { useNavigate } from "react-router-dom";
import MentorsGrid from "../components/MentorsGrid";
import { useTopRated } from "../hooks/useTopRated";

const TopRatedMentorsSection = () => {
  const navigate = useNavigate();
  const { mentors, convertToMentorCardProps } = useTopRated();

  const mentorCards = mentors?.map(convertToMentorCardProps) || [];

  const handleBookSession = (mentorId: string) => {
    navigate(`/booking/${mentorId}`);
    console.log("Book session with mentor:", mentorId);
  };

  return (
    <>
      <MentorsGrid mentors={mentorCards} onBookSession={handleBookSession} />
    </>
  );
};

export default TopRatedMentorsSection;
