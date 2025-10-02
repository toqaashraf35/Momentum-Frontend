import { Zap } from "lucide-react";

interface SkillsSectionProps {
  tags: string[];
}

const SkillsSection = ({ tags }: SkillsSectionProps) => {
  return (
    <div className="bg-white rounded-lg border border-[var(--border)] p-6">
      <div className="flex items-center gap-3 mb-4">
        <Zap size={20} className="text-orange-500" />
        <h3 className="font-semibold text-orange-600">Skills & Expertise</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.isArray(tags) && tags.length > 0 ? (
          tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm border border-orange-200 font-medium"
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="text-[var(--dim)]">No skills specified</span>
        )}
      </div>
    </div>
  );
};

export default SkillsSection;
