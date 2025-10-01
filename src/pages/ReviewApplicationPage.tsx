import Title from "../components/Title";
import { useFetch } from "../hooks/useFetch";
import SideMenu from "../layouts/SideMenu";
import {
  Calendar,
  User,
  Mail,
  Briefcase,
  DollarSign,
  FileText,
  Check,
  X,
  Star,
  Target,
  Zap,
  ExternalLink,
  File,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import applicationService from "../services/applicationService";
import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import Button from "../components/Button";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import authService from "../services/authService";

export default function ReviewApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showApproveAlert, setShowApproveAlert] = useState(false);
  const [showRejectAlert, setShowRejectAlert] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchApplication = useCallback(
    () => applicationService.getApplicationById(Number(id)),
    [id]
  );

  const { data: application, loading, error } = useFetch(fetchApplication);
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutAlertOpen(false);
    authService.logout();
    navigate("/login");
  };

  const handleApprove = async () => {
    if (!application) return;

    setIsProcessing(true);
    try {
      await applicationService.approveApplication(application.id);
      setShowApproveAlert(false);
      // Redirect to mentors page or show success message
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Failed to approve application:", err);
      // You can show an error message here
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!application) return;

    setIsProcessing(true);
    try {
      await applicationService.rejectApplication(application.id);
      setShowRejectAlert(false);
      // Redirect to applications page or show success message
      navigate("/admin/mentors?tab=pending");
    } catch (err) {
      console.error("Failed to reject application:", err);
      // You can show an error message here
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStatusBadge = () => {
    if (!application) return null;

    const statusConfig = {
      ACCEPTED: {
        icon: CheckCircle,
        color: "green",
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200",
        label: "Accepted",
      },
      APPROVED: {
        icon: CheckCircle,
        color: "green",
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200",
        label: "Approved",
      },
      REJECTED: {
        icon: XCircle,
        color: "red",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        borderColor: "border-red-200",
        label: "Rejected",
      },
      PENDING: {
        icon: Clock,
        color: "yellow",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
        borderColor: "border-yellow-200",
        label: "Pending Review",
      },
    };

    const config = statusConfig[application.status] || statusConfig.PENDING;
    const IconComponent = config.icon;

    return (
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${config.bgColor} ${config.textColor} border ${config.borderColor}`}
      >
        <IconComponent size={20} className={config.textColor} />
        <span className="font-semibold">{config.label}</span>
      </div>
    );
  };

  const renderDecisionButtons = () => {
    if (!application) return null;

    if (
      application.status === "ACCEPTED" ||
      application.status === "APPROVED" ||
      application.status === "REJECTED"
    ) {
      return (
        <div className="text-center">
          <div className="mb-4">{renderStatusBadge()}</div>
          <p className="text-[var(--dim)] text-sm">
            This application has been {application.status.toLowerCase()}.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <Button
          icon={<Check size={16} />}
          type="button"
          children={isProcessing ? "Processing..." : "Accept Application"}
          size="md"
          color="green"
          onClick={() => setShowApproveAlert(true)}
          disabled={isProcessing}
        />

        <Button
          icon={<X size={16} />}
          type="button"
          children={isProcessing ? "Processing..." : "Reject Application"}
          size="md"
          color="red"
          onClick={() => setShowRejectAlert(true)}
          disabled={isProcessing}
        />
      </div>
    );
  };

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );

  if (!application)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No application found.</p>
      </div>
    );

  return (
    <>
      <div className="bg-[var(--bg)] min-h-screen flex">
        {/* Side Menu - Fixed */}
        <div className="fixed left-0 top-0 h-screen w-[18%]">
          <SideMenu onLogoutClick={() => setIsLogoutAlertOpen(true)} />
        </div>

        {/* Main Content - With left margin for the fixed sidebar */}
        <div className="lg:ml-[18%] flex-1 flex">
          {/* Application Details - Scrollable */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            <Title
              title="Mentor Application Review"
              subtitle="Review and decide on mentor application"
            />

            {/* Application Header Card */}
            <div className="bg-white rounded-lg border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
                  <FileText size={20} className="text-blue-500" />
                  Application Information
                </h2>
                <div className="flex items-center gap-2 text-[var(--dim)]">
                  <Calendar size={16} />
                  <span className="text-sm">
                    Submitted{" "}
                    {new Date(application.submittedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full text-blue-600 font-semibold border border-blue-200">
                    {application.name[0].toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-blue-500" />
                      <p className="text-[var(--main)] font-semibold">
                        {application.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-blue-400" />
                      <p className="text-[var(--dim)] text-sm">
                        {application.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title Card */}
              <div className="bg-white rounded-lg border border-[var(--border)] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Briefcase size={20} className="text-purple-500" />
                  <h3 className="font-semibold text-purple-600">
                    Applied Position
                  </h3>
                </div>
                <p className="text-[var(--dim)] text-lg font-medium">
                  {application.jobTitle}
                </p>
              </div>

              {/* Hourly Rate Card */}
              <div className="bg-white rounded-lg border border-[var(--border)] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign size={20} className="text-green-500" />
                  <h3 className="font-semibold text-green-600">Hourly Rate</h3>
                </div>
                <p className="text-[var(--dim)] text-lg font-medium">
                  ${application.hourRate}/hour
                </p>
              </div>
            </div>

            {/* Skills & Tags Section */}
            <div className="bg-white rounded-lg border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap size={20} className="text-orange-500" />
                <h3 className="font-semibold text-orange-600">
                  Skills & Expertise
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {Array.isArray(application.tags) ? (
                  application.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm border border-orange-200 font-medium"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-[var(--dim)]">No skills specified</span>
                )}
              </div>
            </div>

            {/* CV Preview Section */}
            {application.cvLink && (
              <div className="bg-white rounded-lg border border-[var(--border)] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <File size={20} className="text-red-500" />
                  <h3 className="font-semibold text-red-600">CV / Resume</h3>
                </div>

                <div className="space-y-4">
                  {/* CV Preview Frame */}
                  <div className="border border-[var(--border)] rounded-lg overflow-hidden bg-gray-50">
                    <div className="flex items-center justify-between p-3 bg-gray-100 border-b border-[var(--border)]">
                      <div className="flex items-center gap-2">
                        <File size={16} className="text-red-500" />
                        <span className="text-sm font-medium text-[var(--main)]">
                          CV Preview
                        </span>
                      </div>
                      <a
                        href={application.cvLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                      >
                        <ExternalLink size={12} />
                        Open Full CV
                      </a>
                    </div>

                    <div className="h-96">
                      <iframe
                        src={application.cvLink}
                        className="w-full h-full border-0"
                        title="CV Preview"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Fallback message if iframe doesn't load properly */}
                  <div className="text-center">
                    <p className="text-sm text-[var(--dim)]">
                      Can't view the CV?{" "}
                      <a
                        href={application.cvLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-500 hover:text-red-600 underline"
                      >
                        Open in new tab
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Decision Sidebar - Fixed */}
          <div className="w-[300px] p-6">
            <div className="fixed top-6 w-[264px]">
              <div className="flex flex-col gap-4 p-6 rounded-lg bg-white border border-[var(--border)] shadow-sm">
                <div className="text-center mb-2">
                  <div className="flex justify-center mb-2">
                    <Target size={24} className="text-indigo-500" />
                  </div>
                  <h3 className="font-semibold text-indigo-600 text-lg">
                    Application Decision
                  </h3>
                  <p className="text-[var(--dim)] text-sm mt-1">
                    {application.status === "PENDING"
                      ? "Make your final decision"
                      : "Application status"}
                  </p>
                </div>

                {renderDecisionButtons()}

                {/* Additional Info */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Star size={16} className="text-blue-500" />
                    <h4 className="font-medium text-blue-700 text-sm">
                      Quick Stats
                    </h4>
                  </div>
                  <div className="space-y-1 text-xs text-blue-600">
                    <p>
                      • Submitted{" "}
                      {new Date(application.submittedDate).toLocaleDateString()}
                    </p>
                    <p>• Status: {application.status}</p>
                    <p>• {application.tags?.length || 0} skills listed</p>
                    {application.cvLink && <p>• CV attached</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Confirmation Alert */}
      {showApproveAlert && (
        <Alert
          title="Approve Application"
          description={`Are you sure you want to approve ${application.name}'s application? This action cannot be undone.`}
          onConfirm={handleApprove}
          onCancel={() => setShowApproveAlert(false)}
          confirmText="Yes, Approve"
          cancelText="Cancel"
        />
      )}

      {/* Reject Confirmation Alert */}
      {showRejectAlert && (
        <Alert
          title="Reject Application"
          description={`Are you sure you want to reject ${application.name}'s application? This action cannot be undone.`}
          onReject={handleReject}
          onCancel={() => setShowRejectAlert(false)}
          rejectText="Yes, Reject"
          cancelText="Cancel"
        />
      )}

      {/* Logout Alert */}
      {isLogoutAlertOpen && (
        <Alert
          title="Confirm Logout"
          description="Are you sure you want to log out of your account?"
          confirmText="Logout"
          cancelText="Cancel"
          onCancel={() => setIsLogoutAlertOpen(false)}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
}
