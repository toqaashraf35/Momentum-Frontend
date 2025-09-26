// utils/validateMentorApplication.ts
export function validateMentorApplication(values: {
  hourlyRate: string;
  cv: File | null;
}) {
  const errors: { hourlyRate?: string; cv?: string } = {};

  // Validate hourly rate
  if (!values.hourlyRate) {
    errors.hourlyRate = "Hourly rate is required";
  } else if (
    isNaN(parseFloat(values.hourlyRate)) ||
    parseFloat(values.hourlyRate) <= 0
  ) {
    errors.hourlyRate = "Please enter a valid hourly rate";
  }

  // Validate CV
  if (!values.cv) {
    errors.cv = "CV is required";
  } else {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (!allowedTypes.includes(values.cv.type)) {
      errors.cv = "File must be a PDF or image (JPEG/PNG)";
    } else if (values.cv.size > 5 * 1024 * 1024) {
      // 5MB limit
      errors.cv = "File size must be less than 5MB";
    }
  }

  return errors;
}
