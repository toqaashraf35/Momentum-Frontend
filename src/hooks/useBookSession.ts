import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "./useFetch";
import profileService from "../services/profileService";
import availabilityService, {
  type MentorAvailabilityDTO,
} from "../services/availabilityService";

interface BookSessionFormData {
  sessionTopic: string;
  selectedDate: string;
  selectedTime: string;
}

export const useBookSession = () => {
  const { profileId } = useParams<{ profileId: string }>();
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
    const dates = availabilities.map((a) => {
      // الـ date بيكون string بالفعل من الـ API
      return a.date; // هذا بيكون بصيغة YYYY-MM-DD
    });

    setAvailableDates([...new Set(dates)].sort());
  }, [availabilities]);

  // Set available times based on selected date
  useEffect(() => {
    if (!formData.selectedDate) {
      setAvailableTimes([]);
      return;
    }

    console.log("Looking for date:", formData.selectedDate);
    console.log("Available dates:", availableDates);

    // Find availability for selected date
    const selectedAvailability = mentorAvailabilities.find((a) => {
      console.log("Comparing:", a.date, "with", formData.selectedDate);
      return a.date === formData.selectedDate;
    });

    console.log("Found availability:", selectedAvailability);

    if (selectedAvailability && selectedAvailability.availableSlots) {
      const times = selectedAvailability.availableSlots.map((slot) => {        
        return slot.startTime.slice(0, 5);
      });

      console.log("Extracted times:", times);
      setAvailableTimes(times);
      setFormData((prev) => ({ ...prev, selectedTime: "" }));
    } else {
      console.log("No availability found for selected date");
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
  };

  const handleTimeSelect = (time: string) => {
    setFormData((prev) => ({ ...prev, selectedTime: time }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking session:", {
      ...formData,
      mentorId: profileId,
      mentorName: mentor?.name,
    });
  };

  return {
    formData,
    availableDates,
    availableTimes,
    mentor,
    mentorLoading,
    mentorError,
    availabilitiesLoading,
    handleSelectChange,
    handleTimeSelect,
    handleSubmit,
  };
};
