import { Check, X, Target, Star } from "lucide-react";
import Button from "./Button";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../utils/dateUtils";

interface DecisionSidebarProps {
  application: {
    status: string;
    name: string;
    submittedDate: Date | string; 
    tags?: string[];
    cvLink?: string;
  };
  isProcessing: boolean;
  onApprove: () => void;
  onReject: () => void;
}

const DecisionSidebar = ({
  application,
  isProcessing,
  onApprove,
  onReject,
}: DecisionSidebarProps) => {
const submittedDate = formatDate(application.submittedDate);
;

  const renderDecisionButtons = () => {
    if (
      application.status === "ACCEPTED" ||
      application.status === "APPROVED" ||
      application.status === "REJECTED"
    ) {
      return (
        <div className="text-center">
          <div className="mb-4">
            <StatusBadge status={application.status} />
          </div>
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
          onClick={onApprove}
          disabled={isProcessing}
        />

        <Button
          icon={<X size={16} />}
          type="button"
          children={isProcessing ? "Processing..." : "Reject Application"}
          size="md"
          color="red"
          onClick={onReject}
          disabled={isProcessing}
        />
      </div>
    );
  };

  return (
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
            <h4 className="font-medium text-blue-700 text-sm">Quick Stats</h4>
          </div>
          <div className="space-y-1 text-xs text-blue-600">
            <p>• Submitted {submittedDate}</p>
            <p>• Status: {application.status}</p>
            <p>• {application.tags?.length || 0} skills listed</p>
            {application.cvLink && <p>• CV attached</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionSidebar;
