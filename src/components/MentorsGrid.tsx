import IdentificationCardComponent, {
  type MentorCardProps,
} from "./IdentificationCard";

interface MentorsGridProps {
  mentors: MentorCardProps[];
  onBookSession: (mentorId: string) => void;
}

const MentorsGrid = ({ mentors, onBookSession }: MentorsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {mentors.map((mentor) => (
        <IdentificationCardComponent
          key={mentor.id}
          {...mentor}
          onBookSession={onBookSession}
        />
      ))}
    </div>
  );
};

export default MentorsGrid;
