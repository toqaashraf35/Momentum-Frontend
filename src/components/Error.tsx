interface MentorsErrorProps {
  error: string;
  onRetry: () => void;
}

const MentorsError = ({ error, onRetry }: MentorsErrorProps) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <div className="text-red-600 font-medium mb-2">Error Loading</div>
      <p className="text-red-500 text-sm mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};

export default MentorsError;
