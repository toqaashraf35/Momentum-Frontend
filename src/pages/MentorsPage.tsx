// pages/MentorsPage.tsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layouts/Header";
import Title from "../components/Title";
import IdentificationCardComponent, {
  type MentorCardProps,
} from "../components/IdentificationCard";
import profileService from "../services/profileService";
import {type UserProfileResponseDto} from "../services/profileService";
import { useFetch } from "../hooks/useFetch";


const MentorsPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  // Fetch mentors page using useFetch
const fetchMentors = useCallback(
  () => profileService.getMentors(currentPage),
  [currentPage]
);

const { data: mentorsPage, loading, error, refetch } = useFetch(fetchMentors);

useEffect(() => {
  refetch();
}, [currentPage, refetch]);


  // Update refetch when currentPage changes
  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  const handleBookSession = (mentorId: string) => {
    navigate(`/booking/${mentorId}`);
    console.log("Book session with mentor:", mentorId);
  };

  const convertToMentorCardProps = (
    mentor: UserProfileResponseDto
  ): MentorCardProps => ({
    type: "mentor",
    id: mentor.id.toString(),
    avatar: mentor.avatarURL,
    name: mentor.name,
    username: mentor.username,
    jobTitle: mentor.jobTitle || "Mentor",
    rating: mentor.rating || 0.0,
    hourRate: mentor.hourRate || 5,
    onBookSession: handleBookSession,
  });

  // Render loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Title
              title="Mentors"
              subtitle="Find experienced mentors to guide you"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-md p-4 animate-pulse"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="flex justify-between mb-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Title
              title="Mentors"
              subtitle="Find experienced mentors to guide you"
            />
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <div className="text-red-600 font-medium mb-2">
                Error Loading Mentors
              </div>
              <p className="text-red-500 text-sm mb-4">{error}</p>
              <button
                onClick={refetch}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render empty state
  if (!mentorsPage?.content || mentorsPage.content.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Title
              title="Mentors"
              subtitle="Find experienced mentors to guide you"
            />
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="text-gray-400 mb-4">{/* empty icon */}</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Mentors Available
              </h3>
              <p className="text-gray-500">
                There are currently no mentors available. Please check back
                later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render mentors grid
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Title
            title="Mentors"
            subtitle={`Connect with ${mentorsPage.content.length} experienced mentors ready to guide you`}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mentorsPage.content.map((mentor) => (
              <IdentificationCardComponent
                key={mentor.id}
                {...convertToMentorCardProps(mentor)}
              />
            ))}
          </div>

          {/* Pagination buttons */}
          <div className="mt-8 text-center">
            <div className="flex justify-center space-x-2">
              {Array.from({ length: mentorsPage.totalPages }).map(
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`px-3 py-1 rounded-lg border ${
                      index === mentorsPage.number
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorsPage;
