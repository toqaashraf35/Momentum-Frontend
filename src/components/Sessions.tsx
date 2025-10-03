// components/Sessions.tsx
import React, { useState } from "react";
import type { BookingResponseDTO } from "../services/bookingService";
import { formatDate, formatTime, getStatusColor } from "../utils/sessions";
import { useSessions } from "../hooks/useSessions";

interface SessionsProps {
  limit?: number;
  showRateButton?: boolean;
  onRateMentor?: (bookingId: number) => void;
  showTabs?: boolean; 
}

type TabType = "all" | "confirmed" | "pending" | "completed" | "cancelled";

const Sessions: React.FC<SessionsProps> = ({
  limit,
  showRateButton = false,
  onRateMentor,
  showTabs = false, // default false
}) => {
  const { bookings, loading, error } = useSessions();
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const canRateSession = (booking: BookingResponseDTO): boolean => {
    return booking.status.toLowerCase() === "completed" && showRateButton;
  };

  const getUserRole = (): "mentor" | "learner" => {
    if (bookings.length > 0) {
      return bookings[0].mentorName ? "learner" : "mentor";
    }
    return "learner";
  };

  const userRole = getUserRole();

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "all") return true;
    return booking.status.toLowerCase() === activeTab.toLowerCase();
  });

  const displayedBookings = limit
    ? filteredBookings.slice(0, limit)
    : filteredBookings;

  const getTabCount = (tab: TabType) => {
    if (tab === "all") return bookings.length;
    return bookings.filter(
      (booking) => booking.status.toLowerCase() === tab.toLowerCase()
    ).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading sessions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">No sessions found.</p>
        <p className="text-gray-400 mt-2">
          {userRole === "mentor"
            ? "You don't have any sessions yet."
            : "Book your first session to get started!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs - تظهر فقط إذا showTabs = true */}
      {showTabs && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="px-6 flex space-x-8">
              {(
                [
                  "all",
                  "confirmed",
                  "pending",
                  "completed",
                  "cancelled",
                ] as TabType[]
              ).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {getTabCount(tab)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sessions Grid */}
      {displayedBookings.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">
            {showTabs ? `No ${activeTab} sessions found` : "No sessions found"}
          </p>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {userRole === "mentor" ? (
                      <>
                        Session with{" "}
                        <span className="text-blue-600">
                          {booking.learnerName}
                        </span>
                      </>
                    ) : (
                      <>
                        Session by{" "}
                        <span className="text-green-600">
                          {booking.mentorName}
                        </span>
                      </>
                    )}
                  </h3>

                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Mentor:</span>{" "}
                      {booking.mentorName}
                    </div>
                    <div>
                      <span className="font-medium">Mentee:</span>{" "}
                      {booking.learnerName}
                    </div>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Date</p>
                  <p className="text-sm text-gray-900">
                    {formatDate(booking.startTime)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Time</p>
                  <p className="text-sm text-gray-900">
                    {formatTime(booking.startTime)} -{" "}
                    {formatTime(booking.endTime)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Duration</p>
                  <p className="text-sm text-gray-900">
                    {booking.durationMinutes} minutes
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-700">Price</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${booking.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex gap-2">
                  {booking.meetingLink &&
                    booking.status.toLowerCase() === "confirmed" && (
                      <a
                        href={booking.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Join Meeting
                      </a>
                    )}

                  {canRateSession(booking) && onRateMentor && (
                    <button
                      onClick={() => onRateMentor(booking.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Rate Mentor
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sessions;
