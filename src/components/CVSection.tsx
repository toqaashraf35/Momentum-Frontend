import { File, ExternalLink } from "lucide-react";

interface CVSectionProps {
  cvLink: string;
}

const CVSection = ({ cvLink }: CVSectionProps) => {
  return (
    <div className="bg-white rounded-lg border border-[var(--border)] p-6">
      <div className="flex items-center gap-3 mb-4">
        <File size={20} className="text-red-500" />
        <h3 className="font-semibold text-red-600">CV / Resume</h3>
      </div>

      <div className="space-y-4">
        {/* CV Preview Frame */}
        <div className="border border-[var(--border)] rounded-lg overflow-hidden bg-gray-50">
          <div className="flex items-center justify-between p-3 bg-gray-100 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <File size={16} className="text-red-500" />
              <span className="text-sm font-medium text-[var(--main)]">
                CV Preview
              </span>
            </div>
            <a
              href={cvLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
            >
              <ExternalLink size={12} />
              Open Full CV
            </a>
          </div>

          <div className="h-96">
            <iframe
              src={cvLink}
              className="w-full h-full border-0"
              title="CV Preview"
              loading="lazy"
            />
          </div>
        </div>

        {/* Fallback message if iframe doesn't load properly */}
        <div className="text-center">
          <p className="text-sm text-[var(--dim)]">
            Can't view the CV?{" "}
            <a
              href={cvLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:text-red-600 underline"
            >
              Open in new tab
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CVSection;
