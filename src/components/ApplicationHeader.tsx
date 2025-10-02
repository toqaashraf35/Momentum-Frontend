import { FileText, Calendar, User, Mail } from "lucide-react";
import { formatDate } from "../utils/dateUtils";

interface ApplicationHeaderProps {
  application: {
    name: string;
    email: string;
    submittedDate: Date | string; 
  };
}

const ApplicationHeader = ({ application }: ApplicationHeaderProps) => {
  const submittedDate = formatDate(application.submittedDate);

  return (
    <div className="bg-white rounded-lg border border-[var(--border)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
          <FileText size={20} className="text-blue-500" />
          Application Information
        </h2>
        <div className="flex items-center gap-2 text-[var(--dim)]">
          <Calendar size={16} />
          <span className="text-sm">Submitted {submittedDate}</span>
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
              <p className="text-[var(--dim)] text-sm">{application.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationHeader;
