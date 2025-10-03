import  {type ReactNode}  from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  count: number;
  icon: ReactNode;
  growthRate: number; 
}

const StatCard = ({ title, count, icon, growthRate }: StatCardProps) => {
  const isPositive = growthRate >= 0;

  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
      {/* Title + Icon */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[var(--dim)] text-sm font-medium">{title}</h3>
        <div className="text-blue-600">{icon}</div>
      </div>

      {/* Count */}
      <div className="text-2xl font-bold text-[var(--main)]">
        {count}{" "}
        <span className="text-sm font-medium text-[var(--dim)]">{title}</span>
      </div>

      {/* Growth Rate */}
      <div
        className={`mt-3 flex items-center text-sm font-medium ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {isPositive ? (
          <ArrowUpRight className="w-4 h-4 mr-1" />
        ) : (
          <ArrowDownRight className="w-4 h-4 mr-1" />
        )}
        {isPositive ? `+${growthRate.toFixed(2)}%` : `${growthRate.toFixed(2)}%`} from last month
      </div>
    </div>
  );
};

export default StatCard;
