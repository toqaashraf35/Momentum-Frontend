import { CheckCircle, XCircle, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
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

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
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

export default StatusBadge;
