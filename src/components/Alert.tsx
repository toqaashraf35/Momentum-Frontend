import { X } from "lucide-react";

type AlertProps = {
  title: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onReject?: () => void;
  confirmText?: string;
  cancelText?: string;
  rejectText?: string;
};

export default function Alert({
  title,
  description,
  onConfirm,
  onCancel,
  onReject,
  confirmText = "Confirm",
  cancelText = "Cancel",
  rejectText = "Reject",
}: AlertProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[400px] p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        {description && <p className="text-gray-600 mb-6">{description}</p>}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            {cancelText}
          </button>
          {onReject && (
            <button
              onClick={onReject}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              {rejectText}
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
