interface MentorsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MentorsPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: MentorsPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 text-center">
      <div className="flex justify-center space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index)}
            className={`px-3 py-1 rounded-lg border ${
              index === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MentorsPagination;
