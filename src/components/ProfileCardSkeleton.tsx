const ProfileCardSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center w-full justify-between bg-white border border-gray-300 rounded-lg p-4 md:p-6 lg:p-8 animate-pulse">
      {/* Avatar + Info */}
      <div className="flex flex-col md:flex-row md:items-center w-full">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 md:mb-0 md:mr-6">
          {/* Avatar skeleton */}
          <div className="w-20 h-20 rounded-full bg-gray-200"></div>

          <div className="text-center sm:text-left space-y-2">
            {/* Name skeleton */}
            <div className="h-5 w-32 bg-gray-200 rounded"></div>

            {/* Username skeleton */}
            <div className="h-4 w-24 bg-gray-200 rounded"></div>

            {/* Job title skeleton */}
            <div className="h-4 w-28 bg-gray-200 rounded"></div>

            {/* Bio skeleton */}
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="h-4 w-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Followers / Following skeleton */}
        <div className="flex justify-center sm:justify-start space-x-6 md:space-x-8 mt-4 md:mt-0 md:ml-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-200">
          <div className="text-center flex flex-col items-center">
            <div className="w-10 h-5 bg-gray-200 rounded mb-1"></div>
            <div className="w-12 h-3 bg-gray-200 rounded"></div>
          </div>

          <div className="text-center flex flex-col items-center">
            <div className="w-10 h-5 bg-gray-200 rounded mb-1"></div>
            <div className="w-12 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Actions skeleton */}
      <div className="mt-4 md:mt-0 md:ml-4 flex justify-center md:justify-end gap-2">
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default ProfileCardSkeleton;
