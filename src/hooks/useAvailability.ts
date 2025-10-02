import { useState } from "react";
import availabilityService, {
  type AvailabilityRequestDTO,
} from "../services/availabilityService";

export interface AvailabilityFormData {
  type: "SPECIFIC_DATE" | "WEEKLY";
  specificDate: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  selectedDays: string[];
}

export const useAvailabilityForm = () => {
  const [formType, setFormType] = useState<"SPECIFIC_DATE" | "WEEKLY">(
    "SPECIFIC_DATE"
  );
  const [formData, setFormData] = useState<AvailabilityFormData>({
    type: "SPECIFIC_DATE",
    specificDate: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    selectedDays: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day],
    }));
  };

  const handleSave = async () => {
    if (!formData.startTime || !formData.endTime) {
      setMessage({ type: "error", text: "Please select start and end time" });
      return;
    }

    if (formType === "SPECIFIC_DATE" && !formData.specificDate) {
      setMessage({ type: "error", text: "Please select a specific date" });
      return;
    }

    if (formType === "WEEKLY") {
      if (!formData.startDate || !formData.endDate) {
        setMessage({ type: "error", text: "Please select start and end date" });
        return;
      }
      if (formData.selectedDays.length === 0) {
        setMessage({ type: "error", text: "Please select at least one day" });
        return;
      }
    }

    setLoading(true);
    setMessage(null);

    try {
      const requestDTO: AvailabilityRequestDTO = {
        type: formType,
        startTime: formData.startTime + ":00",
        endTime: formData.endTime + ":00",
      };

      if (formType === "SPECIFIC_DATE") {
        requestDTO.specificDate = formData.specificDate;
      } else if (formType === "WEEKLY") {
        requestDTO.daysOfWeek = formData.selectedDays;
        requestDTO.startDate = formData.startDate;
        requestDTO.endDate = formData.endDate;
      }

      const response = await availabilityService.addAvailability(requestDTO);
      setMessage({
        type: "success",
        text: `Availability added successfully! Created ${response.length} record(s)`,
      });

      handleCancel();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to add availability",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      type: "SPECIFIC_DATE",
      specificDate: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      selectedDays: [],
    });
    setFormType("SPECIFIC_DATE");
    setMessage(null);
  };

  const handleFormTypeChange = (type: "SPECIFIC_DATE" | "WEEKLY") => {
    setFormType(type);
    setFormData((prev) => ({ ...prev, type }));
    setMessage(null);
  };

  return {
    formType,
    formData,
    loading,
    message,
    handleInputChange,
    handleSelectChange,
    handleDayToggle,
    handleSave,
    handleCancel,
    handleFormTypeChange,
  };
};
