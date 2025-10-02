import { Briefcase, DollarSign } from "lucide-react";

interface KeyInfoCardsProps {
  application: {
    jobTitle: string;
    hourRate: number;
  };
}

const KeyInfoCards = ({ application }: KeyInfoCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Job Title Card */}
      <div className="bg-white rounded-lg border border-[var(--border)] p-6">
        <div className="flex items-center gap-3 mb-3">
          <Briefcase size={20} className="text-purple-500" />
          <h3 className="font-semibold text-purple-600">Applied Position</h3>
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
  );
};

export default KeyInfoCards;
