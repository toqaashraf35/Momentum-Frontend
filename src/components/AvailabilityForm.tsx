import React from "react";
import { useAvailabilityForm } from "../hooks/useAvailability";
import FormTypeToggle from "./FormTypeToggle";
import Alert from "./Alert";
import SpecificDateForm from "./SpecificDateForm";
import WeeklyForm from "./WeeklyForm";
import Button from "./Button";

const AvailabilityForm: React.FC = () => {
  const {
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
  } = useAvailabilityForm();

  const handleCloseAlert = () => {
  };

  return (
    <div className="max-w-3xl w-full mx-auto p-6 bg-white rounded-lg border border-[var(--border)]">
      <FormTypeToggle
        formType={formType}
        onFormTypeChange={handleFormTypeChange}
      />

      {message && (
        <Alert
          title={message.type === "success" ? "Success" : "Error"}
          description={message.text}
          onConfirm={message.type === "success" ? undefined : handleSave}
          onCancel={handleCloseAlert}
          confirmText={message.type === "error" ? "Try Again" : undefined}
          cancelText="Close"
        />
      )}

      {formType === "SPECIFIC_DATE" && (
        <SpecificDateForm
          formData={formData}
          onInputChange={handleInputChange}
          onSelectChange={handleSelectChange}
        />
      )}

      {formType === "WEEKLY" && (
        <WeeklyForm
          formData={formData}
          onInputChange={handleInputChange}
          onSelectChange={handleSelectChange}
          onDayToggle={handleDayToggle}
        />
      )}

      <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-gray-200">
        <Button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          color="secondary"
          size="md"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          isLoading={loading}
          disabled={loading}
          color="primary"
          size="md"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default AvailabilityForm;
