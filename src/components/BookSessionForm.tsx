import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Select from "./Select";
import IdentificationCard, { type MentorCardProps } from "./IdentificationCard";
import { useFetch } from "../hooks/useFetch";
import profileService from "../services/profileService";
import availabilityService from "../services/availabilityService";

interface BookSessionFormData {
  sessionTopic: string;
  selectedDate: string;
  selectedTime: string;
}

const BookSessionForm: React.FC = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [formData, setFormData] = useState<BookSessionFormData>({
    sessionTopic: "",
    selectedDate: "",
    selectedTime: "",
  });
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // Fetch mentor profile
  const fetchProfile = useCallback(
    () => profileService.getAnotherProfile(Number(profileId)),
    [profileId]
  );
  const {
    data: mentor,
    loading: mentorLoading,
    error: mentorError,
  } = useFetch(fetchProfile);

  // Fetch mentor availabilities
  const fetchAvailabilities = useCallback(
    () => availabilityService.getAvailabilities(Number(profileId)),
    [profileId]
  );
  const { data: availabilities, loading: availabilitiesLoading } =
    useFetch(fetchAvailabilities);

  // Calculate available dates based on mentor's availability
  useEffect(() => {
    if (availabilities && availabilities.length > 0) {
      const dates = new Set<string>();

      availabilities.forEach((availability) => {
        if (
          availability.type === "SPECIFIC_DATE" &&
          availability.specificDate
        ) {
          dates.add(availability.specificDate);
        } else if (
          availability.type === "WEEKLY" &&
          availability.startDate &&
          availability.endDate
        ) {
          // Generate all dates between start and end date for weekly availability
          const start = new Date(availability.startDate);
          const end = new Date(availability.endDate);
          const dayOfWeek = availability.daysOfWeek;

          const current = new Date(start);
          while (current <= end) {
            const dayName = current
              .toLocaleDateString("en-US", { weekday: "long" })
              .toUpperCase();
            if (dayOfWeek === dayName) {
              dates.add(current.toISOString().split("T")[0]);
            }
            current.setDate(current.getDate() + 1);
          }
        }
      });

      setAvailableDates(Array.from(dates).sort());
    }
  }, [availabilities]);

  // Calculate available times for selected date
  useEffect(() => {
    if (formData.selectedDate && availabilities) {
      const times = new Set<string>();
      const selectedDate = new Date(formData.selectedDate);
      const dayName = selectedDate
        .toLocaleDateString("en-US", { weekday: "long" })
        .toUpperCase();

      availabilities.forEach((availability) => {
        let isAvailable = false;

        if (
          availability.type === "SPECIFIC_DATE" &&
          availability.specificDate === formData.selectedDate
        ) {
          isAvailable = true;
        } else if (
          availability.type === "WEEKLY" &&
          availability.daysOfWeek === dayName &&
          availability.startDate &&
          availability.endDate
        ) {
          const start = new Date(availability.startDate);
          const end = new Date(availability.endDate);
          const selected = new Date(formData.selectedDate);

          if (selected >= start && selected <= end) {
            isAvailable = true;
          }
        }

        if (isAvailable && availability.startTime && availability.endTime) {
          // Generate time slots between start and end time (30-minute intervals)
          const startTime = availability.startTime.slice(0, 5); // Get HH:mm
          const endTime = availability.endTime.slice(0, 5); // Get HH:mm

          const [startHour, startMinute] = startTime.split(":").map(Number);
          const [endHour, endMinute] = endTime.split(":").map(Number);

          let currentHour = startHour;
          let currentMinute = startMinute;

          while (
            currentHour < endHour ||
            (currentHour === endHour && currentMinute < endMinute)
          ) {
            const timeString = `${currentHour
              .toString()
              .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;
            times.add(timeString);

            // Add 30 minutes
            currentMinute += 30;
            if (currentMinute >= 60) {
              currentMinute = 0;
              currentHour += 1;
            }
          }
        }
      });

      setAvailableTimes(Array.from(times).sort());
      setFormData((prev) => ({ ...prev, selectedTime: "" }));
    } else {
      setAvailableTimes([]);
    }
  }, [formData.selectedDate, availabilities]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTimeSelect = (time: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTime: time,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking session:", {
      ...formData,
      mentorId: profileId,
      mentorName: mentor?.name,
    });
    // Handle booking logic here
  };

  if (mentorLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (mentorError || !mentor) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-500">
          {mentorError || "Mentor not found"}
        </div>
      </div>
    );
  }

  const mentorCardProps: MentorCardProps = {
    type: "mentor",
    id: mentor.id.toString(),
    avatar: mentor.avatarURL,
    name: mentor.name,
    username: mentor.username,
    jobTitle: mentor.jobTitle || "Mentor",
    rating: mentor.rating || 0,
    hourRate: mentor.hourRate || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      {" "}
      {/* Added pt-6 for spacing from header */}
      <div className="max-w-6xl mx-auto px-4">
        {" "}
        {/* Added px-4 for responsive padding */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Mentor Card and Skills */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-6 space-y-6">
              {" "}
              {/* Added sticky container */}
              <IdentificationCard {...mentorCardProps} />
              {/* Skills/Tags Section */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Skills & Specializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.tags && mentor.tags.length > 0 ? (
                    mentor.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No skills listed</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Book a Session with {mentor.name}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Session Topic */}
                <div>
                  <Select
                    id="session-topic"
                    label="Session Topic"
                    name="sessionTopic"
                    value={formData.sessionTopic}
                    options={mentor.tags || []}
                    onChange={handleSelectChange}
                    placeholder="Select session topic"
                    required
                  />
                </div>

                {/* Date Selection */}
                <div>
                  <Select
                    id="selected-date"
                    label="Select Date"
                    name="selectedDate"
                    value={formData.selectedDate}
                    options={availableDates.map((date) =>
                      new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    )}
                    onChange={handleSelectChange}
                    placeholder="Select a date"
                    required
                  />

                  {availabilitiesLoading ? (
                    <p className="text-sm text-gray-500 mt-1">
                      Loading available dates...
                    </p>
                  ) : availableDates.length === 0 ? (
                    <p className="text-sm text-red-500 mt-1">
                      No available dates found for this mentor
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">
                      {availableDates.length} available date(s) found
                    </p>
                  )}
                </div>

                {/* Time Selection */}
                {formData.selectedDate && availableTimes.length > 0 && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Available Times for{" "}
                      {new Date(formData.selectedDate).toLocaleDateString()}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleTimeSelect(time)}
                          className={`p-3 rounded-lg border-2 text-center transition-colors ${
                            formData.selectedTime === time
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    {formData.selectedTime && (
                      <p className="text-sm text-green-600 mt-2">
                        Selected time: {formData.selectedTime}
                      </p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={
                      !formData.selectedDate ||
                      !formData.selectedTime ||
                      !formData.sessionTopic
                    }
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Book Session - ${mentor.hourRate || 0}
                  </button>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    You will be charged ${mentor.hourRate || 0} for this 1-hour
                    session
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSessionForm;
