   import type { Column } from "../components/Table";
import type { MentorApplicationResponseDto } from "../services/applicationService";
import { Eye, Check, X } from "lucide-react";

interface ApplicationColumnsProps {
  status: string;
  onView: (row: MentorApplicationResponseDto) => void;
  onApprove: (row: MentorApplicationResponseDto) => void;
  onReject: (row: MentorApplicationResponseDto) => void;
}

export const getApplicationColumns = ({
  status,
  onView,
  onApprove,
  onReject,
}: ApplicationColumnsProps): Column<MentorApplicationResponseDto>[] => {
  const baseColumns: Column<MentorApplicationResponseDto>[] = [
    {
      key: "id",
      label: "ID",
      render: (row) => <span className="font-medium">#{row.id}</span>,
    },
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <span className="font-semibold text-gray-800">{row.name}</span>
      ),
    },
    {
      key: "username",
      label: "Username",
      render: (row) => <span className="text-gray-600">@{row.username}</span>,
    },
    {
      key: "email",
      label: "Email",
      render: (row) => <span className="text-gray-600">{row.email}</span>,
    },
    {
      key: "country",
      label: "Country",
      render: (row) => <span className="text-gray-600">{row.country}</span>,
    },
    {
      key: "submittedDate",
      label: "Submitted Date",
      render: (row) => (
        <span className="text-gray-600">
          {new Date(row.submittedDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "cvLink",
      label: "CV",
      render: (row) => (
        <a
          href={row.cvLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors border border-blue-200"
          onClick={(e) => e.stopPropagation()}
        >
          View CV
        </a>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const statusColors: Record<string, string> = {
          PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
          APPROVED: "bg-green-100 text-green-800 border-green-200",
          REJECTED: "bg-red-100 text-red-800 border-red-200",
        };

        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full border ${
              statusColors[row.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
  ];

  if (status === "PENDING") {
    baseColumns.push({
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(row);
            }}
            title="View Details"
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          >
            <Eye size={16} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onApprove(row);
            }}
            title="Approve Application"
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
          >
            <Check size={16} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onReject(row);
            }}
            title="Reject Application"
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      ),
    });
  }

  return baseColumns;
};
