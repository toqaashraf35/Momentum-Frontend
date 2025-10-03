import { useApplicationReview } from "../hooks/useApplicationReview";
import Title from "../components/Title";
import SideMenu from "../components/SideMenu";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import ApplicationHeader from "../components/ApplicationHeader";
import KeyInfoCards from "../components//KeyInfoCards";
import SkillsSection from "../components/SkillsSection";
import CVSection from "../components//CVSection";
import DecisionSidebar from "../components/DecisionSidebar";

export default function ReviewApplicationPage() {
  const {
    application,
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
  } = useApplicationReview();

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No application found.</p>
      </div>
    );
  }

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

            <ApplicationHeader application={application} />
            <KeyInfoCards application={application} />
            <SkillsSection tags={application.tags || []} />

            {application.cvLink && <CVSection cvLink={application.cvLink} />}
          </div>

          {/* Decision Sidebar - Fixed */}
          <div className="w-[300px] p-6">
            <DecisionSidebar
              application={application}
              isProcessing={isProcessing}
              onApprove={() => setShowApproveAlert(true)}
              onReject={() => setShowRejectAlert(true)}
            />
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
