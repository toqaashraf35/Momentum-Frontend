import React from "react";

interface TimeSelectionProps {
  selectedDate: string;
  selectedTime: string;
  availableTimes: string[];
  onTimeSelect: (time: string) => void;
}

const TimeSelection: React.FC<TimeSelectionProps> = ({
  selectedDate,
  selectedTime,
  availableTimes,
  onTimeSelect,
}) => {
  if (!selectedDate || availableTimes.length === 0) return null;

  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">
        Available Times for {new Date(selectedDate).toLocaleDateString()}
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {availableTimes.map((time) => (
          <button
            key={time}
            type="button"
            onClick={() => onTimeSelect(time)}
            className={`p-3 rounded-lg border-2 text-center transition-colors ${
              selectedTime === time
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
            }`}
          >
            {time}
          </button>
        ))}
      </div>
      {selectedTime && (
        <p className="text-sm text-green-600 mt-2">
          Selected time: {selectedTime}
        </p>
      )}
    </div>
  );
};

export default TimeSelection;
