// components/BookSessionForm.tsx
import React, { useState } from "react";
import { useBookSession } from "../hooks/useBookSession";
import MentorSidebar from "./BookSessionSidebar";
import Select from "./Select";
import Button from "./Button";
import TimeSelection from "./TimeSelection";
import Alert from "./Alert";

const BookSessionForm: React.FC = () => {
  const {
    formData,
    availableDates,
    availableTimes,
    mentor,
    mentorLoading,
    mentorError,
    availabilitiesLoading,
    isSubmitting,
    bookingError,
    handleSelectChange,
    handleTimeSelect,
    handleSubmit,
  } = useBookSession();

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await handleSubmit(e);
      setSuccessMessage(
        "Booking created successfully! Check your email for the calendar invite."
      );
      setShowSuccessAlert(true);
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false);
  };

  if (mentorLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading mentor information...</div>
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

  // Create options for date select
  const dateOptions = availableDates.map((date) => ({
    value: date,
    label: new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }));

  const isSubmitDisabled =
    !formData.selectedDate ||
    !formData.selectedTime ||
    !formData.sessionTopic ||
    isSubmitting;

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <MentorSidebar mentor={mentor} />

          {/* Right Side - Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Book a Session with {mentor.name}
              </h2>

              {/* Error Message */}
              {bookingError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{bookingError}</p>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-6">
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
                  <label className="block text-gray-700 font-semibold mb-2">
                    Select Date
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    id="selected-date"
                    name="selectedDate"
                    value={formData.selectedDate}
                    onChange={handleSelectChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    required
                    disabled={availabilitiesLoading}
                  >
                    <option value="">Select a date</option>
                    {dateOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

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
                <TimeSelection
                  selectedDate={formData.selectedDate}
                  selectedTime={formData.selectedTime}
                  availableTimes={availableTimes}
                  onTimeSelect={handleTimeSelect}
                />

                {/* Submit Button */}
                <div className="flex flex-col items-center justify-center pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitDisabled}
                    color="primary"
                    size="xl"
                  >
                    {isSubmitting
                      ? "Booking Session..."
                      : `Book Session - $${mentor.hourRate || 0}`}
                  </Button>
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

      {/* Success Alert */}
      {showSuccessAlert && (
        <Alert
          title="Booking Successful!"
          description={successMessage}
          confirmText="OK"
          onConfirm={handleCloseSuccessAlert}
          onCancel={handleCloseSuccessAlert}
        />
      )}
    </div>
  );
};

export default BookSessionForm;
