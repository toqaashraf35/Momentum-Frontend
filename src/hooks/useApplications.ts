import { useState, useCallback } from "react";
import { useFetch } from "./useFetch";
import applicationService, {
  type MentorApplicationResponseDto,
} from "../services/applicationService";

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export const useApplications = () => {
  const [status, setStatus] = useState<ApplicationStatus>("PENDING");
  const [processing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    action: "approve" | "reject" | null;
    application?: MentorApplicationResponseDto | null;
  }>({ open: false, action: null, application: null });

  const fetchApps = useCallback(
    () => applicationService.getApplicationsByStatus(status),
    [status]
  );

  const { data: applications, loading, error, refetch } = useFetch(fetchApps);

  const openConfirm = (
    action: "approve" | "reject",
    application: MentorApplicationResponseDto
  ) => {
    setActionError(null);
    setConfirmModal({ open: true, action, application });
  };

  const closeConfirm = () =>
    setConfirmModal({ open: false, action: null, application: null });

  const handleApprove = async () => {
    if (!confirmModal.application) return;
    setProcessing(true);
    try {
      await applicationService.approveApplication(confirmModal.application.id);
      setSuccessMessage("Application approved successfully.");
      await refetch();
      closeConfirm();
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again.";
      setActionError(msg);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!confirmModal.application) return;
    setProcessing(true);
    try {
      await applicationService.rejectApplication(confirmModal.application.id);
      setSuccessMessage("Application rejected successfully.");
      await refetch();
      closeConfirm();
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again.";
      setActionError(msg);
    } finally {
      setProcessing(false);
    }
  };

  return {
    status,
    setStatus,
    applications,
    loading,
    error,
    processing,
    actionError,
    successMessage,
    confirmModal,
    openConfirm,
    closeConfirm,
    handleApprove,
    handleReject,
    setActionError,
    setSuccessMessage,
  };
};
