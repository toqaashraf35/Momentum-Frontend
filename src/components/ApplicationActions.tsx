import { Eye, Check, X } from "lucide-react";
import type { MentorApplicationResponseDto } from "../services/applicationService";

interface ApplicationActionsProps {
  row: MentorApplicationResponseDto;
  onView: (row: MentorApplicationResponseDto) => void;
  onApprove: (row: MentorApplicationResponseDto) => void;
  onReject: (row: MentorApplicationResponseDto) => void;
}

const ApplicationActions = ({
  row,
  onView,
  onApprove,
  onReject,
}: ApplicationActionsProps) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onView(row);
        }}
        title="View"
        className="text-blue-500 hover:bg-blue-100 rounded-full p-2 cursor-pointer"
      >
        <Eye size={16} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onApprove(row);
        }}
        title="Approve"
        className="text-green-600 hover:bg-green-100 rounded-full p-2 cursor-pointer"
      >
        <Check size={16} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onReject(row);
        }}
        title="Reject"
        className="text-red-600 hover:bg-red-100 rounded-full p-2 cursor-pointer"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default ApplicationActions;
