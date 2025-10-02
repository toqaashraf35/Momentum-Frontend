import React, { useState } from "react";
import Select from "./Select";
import availabilityService, {
  type AvailabilityRequestDTO,
} from "../services/availabilityService";

interface AvailabilityFormData {
  type: "SPECIFIC_DATE" | "WEEKLY";
  specificDate: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  selectedDays: string[];
}

const AvailabilityForm: React.FC = () => {
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

  const timeOptions = [
    "00:00",
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ];

  const daysOfWeek = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        startTime: formData.startTime + ":00", // Add seconds for backend
        endTime: formData.endTime + ":00", // Add seconds for backend
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

      // Reset form after successful submission
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
    setFormData((prev) => ({
      ...prev,
      type,
    }));
    setMessage(null);
  };

  return (
    <div className="max-w-3xl w-full mx-auto p-6 bg-white rounded-lg border border-[var(--border)]">
      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => handleFormTypeChange("SPECIFIC_DATE")}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            formType === "SPECIFIC_DATE"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Specific Date
        </button>
        <button
          type="button"
          onClick={() => handleFormTypeChange("WEEKLY")}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            formType === "WEEKLY"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Weekly
        </button>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Specific Date Form */}
      {formType === "SPECIFIC_DATE" && (
        <div className="space-y-6">
          {/* Date Picker */}
          <div>
            <label className="block text-gray-500 font-semibold text-sm mb-2">
              Date
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="date"
              name="specificDate"
              value={formData.specificDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              required
            />
          </div>

          {/* Time Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              id="start-time-specific"
              label="Start Time"
              name="startTime"
              value={formData.startTime}
              options={timeOptions}
              onChange={handleSelectChange}
              placeholder="Select start time"
              required
            />
            <Select
              id="end-time-specific"
              label="End Time"
              name="endTime"
              value={formData.endTime}
              options={timeOptions}
              onChange={handleSelectChange}
              placeholder="Select end time"
              required
            />
          </div>
        </div>
      )}

      {/* Weekly Form */}
      {formType === "WEEKLY" && (
        <div className="space-y-6">
          {/* Days of Week Selection */}
          <div>
            <label className="block text-gray-500 font-semibold text-sm mb-3">
              Select Days
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    formData.selectedDays.includes(day)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {day.charAt(0) + day.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            {formData.selectedDays.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {formData.selectedDays.length} day(s) selected
              </p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-500 font-semibold text-sm mb-2">
                Start Date
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-500 font-semibold text-sm mb-2">
                End Date
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Time Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              id="start-time-weekly"
              label="Start Time"
              name="startTime"
              value={formData.startTime}
              options={timeOptions}
              onChange={handleSelectChange}
              placeholder="Select start time"
              required
            />
            <Select
              id="end-time-weekly"
              label="End Time"
              name="endTime"
              value={formData.endTime}
              options={timeOptions}
              onChange={handleSelectChange}
              placeholder="Select end time"
              required
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            loading
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:bg-gray-50 disabled:text-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AvailabilityForm;
