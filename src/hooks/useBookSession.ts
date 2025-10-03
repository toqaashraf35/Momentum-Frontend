import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "./useFetch";
import profileService from "../services/profileService";
import availabilityService, {
  type MentorAvailabilityDTO,
} from "../services/availabilityService";
import { bookingService, type BookingRequestDTO } from "../services/bookingService";

interface BookSessionFormData {
  sessionTopic: string;
  selectedDate: string;
  selectedTime: string;
}

export const useBookSession = () => {
  const { profileId } = useParams<{ profileId: string }>();
  // const navigate = useNavigate();
  const [formData, setFormData] = useState<BookSessionFormData>({
    sessionTopic: "",
    selectedDate: "",
    selectedTime: "",
  });
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [mentorAvailabilities, setMentorAvailabilities] = useState<
    MentorAvailabilityDTO[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

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
    () => availabilityService.getMentorAvailability(Number(profileId)),
    [profileId]
  );
  const { data: availabilities, loading: availabilitiesLoading } =
    useFetch(fetchAvailabilities);

  // Set mentor availabilities and available dates
  useEffect(() => {
    if (!availabilities) return;

    console.log("Availabilities from API:", availabilities);
    setMentorAvailabilities(availabilities);

    // Extract and format dates
    const dates = availabilities.map((a) => a.date);
    setAvailableDates([...new Set(dates)].sort());
  }, [availabilities]);

  // Set available times based on selected date
  useEffect(() => {
    if (!formData.selectedDate) {
      setAvailableTimes([]);
      return;
    }

    const selectedAvailability = mentorAvailabilities.find(
      (a) => a.date === formData.selectedDate
    );

    if (selectedAvailability && selectedAvailability.availableSlots) {
      const times = selectedAvailability.availableSlots.map((slot) =>
        slot.startTime.slice(0, 5)
      );
      setAvailableTimes(times);
      setFormData((prev) => ({ ...prev, selectedTime: "" }));
    } else {
      setAvailableTimes([]);
    }
  }, [formData.selectedDate, mentorAvailabilities]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "selectedDate") {
      const originalDate = availableDates.find((date) => {
        const formatted = new Date(date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return formatted === value;
      });

      setFormData((prev) => ({
        ...prev,
        [name]: originalDate || value,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setBookingError(null); // Clear error when user makes changes
  };

  const handleTimeSelect = (time: string) => {
    setFormData((prev) => ({ ...prev, selectedTime: time }));
    setBookingError(null); // Clear error when user makes changes
  };

 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileId || !mentor) {
      setBookingError("Mentor information is missing");
      return;
    }

    if (
      !formData.selectedDate ||
      !formData.selectedTime ||
      !formData.sessionTopic
    ) {
      setBookingError("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    try {
      // Combine date and time to create startTime
      const startDateTime = new Date(
        `${formData.selectedDate}T${formData.selectedTime}:00`
      );

      const bookingRequest: BookingRequestDTO = {
        subject: formData.sessionTopic,
        startTime: startDateTime.toISOString(),
        durationMinutes: 60,
      };

      console.log("Creating booking with:", {
        mentorId: profileId,
        request: bookingRequest,
      });

      const bookingResponse = await bookingService.createBooking(
        Number(profileId),
        bookingRequest
      );

      console.log("Booking created successfully:", bookingResponse);

      // Reset form after successful booking
      setFormData({
        sessionTopic: "",
        selectedDate: "",
        selectedTime: "",
      });

      return bookingResponse; 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Booking creation failed:", error);
      setBookingError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create booking. Please try again."
      );
      throw error; 
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... باقي الكود ...

  return {
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
  };
};