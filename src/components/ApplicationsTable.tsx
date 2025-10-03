import { useNavigate } from "react-router-dom";
import Table from "./Table";
import { useApplications } from "../hooks/useApplications";
import { getApplicationColumns } from "../utils/applicationColumns";
import Alert from "./Alert";
import Loading from "./Loading";
import StatusFilter from "./StatusFilter";

export default function ApplicationsTable() {
  const navigate = useNavigate();
  const {
    status,
    setStatus,
    applications,
    loading,
    error,
    processing,
    confirmModal,
    openConfirm,
    closeConfirm,
    handleApprove,
    handleReject,
  } = useApplications();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleViewApplication = (row: any) => {
    navigate(`/admin/application/${row.id}`);
  };

  const columns = getApplicationColumns({
    status,
    onView: handleViewApplication,
    onApprove: (row) => openConfirm("approve", row),
    onReject: (row) => openConfirm("reject", row),
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <StatusFilter currentStatus={status} onStatusChange={setStatus} />

      <Table
        data={applications || []}
        columns={columns}
        maxHeight="400px"
        onRowClick={handleViewApplication}
      />

      {/* Confirm Alert */}
      {confirmModal.open && confirmModal.application && (
        <Alert
          title={
            confirmModal.action === "approve"
              ? "Approve Application?"
              : "Reject Application?"
          }
          description={`Are you sure you want to ${
            confirmModal.action === "approve" ? "approve" : "reject"
          } the application of "${confirmModal.application.name}"?`}
          cancelText="Cancel"
          confirmText="Approve"
          rejectText="Reject"
          onCancel={() => {
            if (processing) return;
            closeConfirm();
          }}
          onConfirm={
            confirmModal.action === "approve" ? handleApprove : undefined
          }
          onReject={confirmModal.action === "reject" ? handleReject : undefined}
        />
      )}
    </div>
  );
}
