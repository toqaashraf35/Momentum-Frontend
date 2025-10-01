// layouts/ApplicationsTable.tsx
import { useCallback, useState } from "react";
import Table, { type Column } from "../components/Table";
import { type MentorApplicationResponseDto } from "../services/applicationService";
import { useFetch } from "../hooks/useFetch";
import applicationService from "../services/applicationService";
import { Check, Eye, X } from "lucide-react";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Loading from "../components/Loading";

export default function ApplicationsTable() {
  const [status, setStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">(
    "PENDING"
  );

  const fetchApps = useCallback(
    () => applicationService.getApplicationsByStatus(status),
    [status]
  );

  const { data: applications, loading, error, refetch } = useFetch(fetchApps);

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    action: "approve" | "reject" | null;
    application?: MentorApplicationResponseDto | null;
  }>({ open: false, action: null, application: null });

  const [processing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

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

  const applicationColumns: Column<MentorApplicationResponseDto>[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "country", label: "Country" },
    { key: "submittedDate", label: "Submitted Date" },
    {
      key: "cvLink",
      label: "CV",
      render: (row) => (
        <a
          href={row.cvLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 text-sm bg-[var(--light)] text-[var(--primary)] rounded hover:bg-[var(--secondary)] hover:text-white transition"
          onClick={(e) => e.stopPropagation()}
        >
          View CV
        </a>
      ),
    },
    { key: "status", label: "Status" },
  ];

  if (status === "PENDING") {
    applicationColumns.push({
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/application/${row.id}`);
            }}
            title="View"
            className="text-blue-500 hover:bg-blue-100 rounded-full p-2 cursor-pointer"
          >
            <Eye size={16} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              openConfirm("approve", row);
            }}
            title="Approve"
            className="text-green-600 hover:bg-green-100 rounded-full p-2 cursor-pointer"
          >
            <Check size={16} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              openConfirm("reject", row);
            }}
            title="Reject"
            className="text-red-600 hover:bg-red-100 rounded-full p-2 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      ),
    });
  }

  if (loading) {
    return <Loading />
  }
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <div className="flex gap-3 mb-4">
        {["PENDING", "APPROVED", "REJECTED"].map((s) => (
          <Button
            key={s}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={() => setStatus(s as any)}
            type="button"
            color={s === "PENDING" ? "yellow" : s === "APPROVED" ? "green" : "red"}
            children={s}
            size="sm"
          />
        ))}
      </div>

      {successMessage && (
        <div className="mb-3 text-sm text-green-700 bg-green-50 px-3 py-2 rounded">
          {successMessage}
        </div>
      )}

      {actionError && (
        <div className="mb-3 text-sm text-red-700 bg-red-50 px-3 py-2 rounded">
          {actionError}
        </div>
      )}

      <Table<MentorApplicationResponseDto>
        data={applications || []}
        columns={applicationColumns}
        maxHeight="400px"
        onRowClick={(row) => navigate(`/admin/application/${row.id}`)}
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
