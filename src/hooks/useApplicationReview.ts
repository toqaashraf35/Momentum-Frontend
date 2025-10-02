import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "./useFetch";
import applicationService from "../services/applicationService";
import authService from "../services/authService";
import { type MentorApplicationResponseDto } from "../services/applicationService";

export const useApplicationReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [showApproveAlert, setShowApproveAlert] = useState(false);
  const [showRejectAlert, setShowRejectAlert] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);

  const fetchApplication = useCallback(
    () => applicationService.getApplicationById(Number(id)),
    [id]
  );

  const { data: application, loading, error } = useFetch(fetchApplication);

  // Format application data to handle Date objects
  const formatApplicationData = (app: MentorApplicationResponseDto | null) => {
    if (!app) return null;

    return {
      ...app,
      submittedDate:
        app.submittedDate instanceof Date
          ? app.submittedDate
          : new Date(app.submittedDate),
    };
  };

  const formattedApplication = formatApplicationData(application);

  const handleLogout = () => {
    setIsLogoutAlertOpen(false);
    authService.logout();
    navigate("/login");
  };

  const handleApprove = async () => {
    if (!formattedApplication) return;

    setIsProcessing(true);
    try {
      await applicationService.approveApplication(formattedApplication.id);
      setShowApproveAlert(false);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Failed to approve application:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!formattedApplication) return;

    setIsProcessing(true);
    try {
      await applicationService.rejectApplication(formattedApplication.id);
      setShowRejectAlert(false);
      navigate("/admin/mentors?tab=pending");
    } catch (err) {
      console.error("Failed to reject application:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    application: formattedApplication,
    loading,
    error,
    showApproveAlert,
    showRejectAlert,
    isProcessing,
    isLogoutAlertOpen,
    setShowApproveAlert,
    setShowRejectAlert,
    setIsLogoutAlertOpen,
    handleApprove,
    handleReject,
    handleLogout,
  };
};
