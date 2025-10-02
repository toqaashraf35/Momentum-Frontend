import Button from "./Button";

type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

interface StatusFilterProps {
  currentStatus: ApplicationStatus;
  onStatusChange: (status: ApplicationStatus) => void;
}

const StatusFilter = ({  onStatusChange }: StatusFilterProps) => {
  const statusOptions: {
    value: ApplicationStatus;
    label: string;
    color: "yellow" | "green" | "red";
  }[] = [
    { value: "PENDING", label: "PENDING", color: "yellow" },
    { value: "APPROVED", label: "APPROVED", color: "green" },
    { value: "REJECTED", label: "REJECTED", color: "red" },
  ];

  return (
    <div className="flex gap-3 mb-4">
      {statusOptions.map((status) => (
        <Button
          key={status.value}
          onClick={() => onStatusChange(status.value)}
          type="button"
          color={status.color}
          size="sm"
        >
          {status.label}
        </Button>
      ))}
    </div>
  );
};

export default StatusFilter;
