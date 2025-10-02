interface FormTypeToggleProps {
  formType: "SPECIFIC_DATE" | "WEEKLY";
  onFormTypeChange: (type: "SPECIFIC_DATE" | "WEEKLY") => void;
}

const FormTypeToggle: React.FC<FormTypeToggleProps> = ({
  formType,
  onFormTypeChange,
}) => {
  return (
    <div className="flex gap-4 mb-6">
      <button
        type="button"
        onClick={() => onFormTypeChange("SPECIFIC_DATE")}
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
        onClick={() => onFormTypeChange("WEEKLY")}
        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
          formType === "WEEKLY"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Weekly
      </button>
    </div>
  );
};

export default FormTypeToggle;
