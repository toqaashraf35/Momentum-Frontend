// utils/dateUtils.ts
export const formatDate = (dateTimeStr: string) => {
  // dateTimeStr = "2025-00-19 13:00"
  const [date] = dateTimeStr.split(" "); // ناخد الجزء الأول قبل المسافة
  return date;
};

export const formatTime = (dateTimeStr: string) => {
  const [, time] = dateTimeStr.split(" "); // ناخد الجزء الثاني بعد المسافة
  return time;
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
  };
  return statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
};
