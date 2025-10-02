import Select from "./Select";
import { timeOptions, daysOfWeek } from "../utils/constants";

interface WeeklyFormProps {
  formData: {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    selectedDays: string[];
  };
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDayToggle: (day: string) => void;
}

const WeeklyForm: React.FC<WeeklyFormProps> = ({
  formData,
  onInputChange,
  onSelectChange,
  onDayToggle,
}) => {
  return (
    <div className="space-y-6">
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
              onClick={() => onDayToggle(day)}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          id="start-time-weekly"
          label="Start Time"
          name="startTime"
          value={formData.startTime}
          options={timeOptions}
          onChange={onSelectChange}
          placeholder="Select start time"
          required
        />
        <Select
          id="end-time-weekly"
          label="End Time"
          name="endTime"
          value={formData.endTime}
          options={timeOptions}
          onChange={onSelectChange}
          placeholder="Select end time"
          required
        />
      </div>
    </div>
  );
};

export default WeeklyForm;
