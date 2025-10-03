import Select from "./Select";
import { timeOptions } from "../utils/constants";

interface SpecificDateFormProps {
  formData: {
    specificDate: string;
    startTime: string;
    endTime: string;
  };
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SpecificDateForm: React.FC<SpecificDateFormProps> = ({
  formData,
  onInputChange,
  onSelectChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-500 font-semibold text-sm mb-2">
          Date
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="date"
          name="specificDate"
          value={formData.specificDate}
          onChange={onInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          id="start-time-specific"
          label="Start Time"
          name="startTime"
          value={formData.startTime}
          options={timeOptions}
          onChange={onSelectChange}
          placeholder="Select start time"
          required
        />
        <Select
          id="end-time-specific"
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

export default SpecificDateForm;
