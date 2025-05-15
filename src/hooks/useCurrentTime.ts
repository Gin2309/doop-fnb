import { useState, useEffect } from "react";
import { format } from "date-fns";

export function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Cập nhật giờ hiện tại mỗi giây
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Dọn dẹp interval khi component bị hủy
    return () => clearInterval(interval);
  }, []);

  // Định dạng giờ và ngày hiện tại nếu có
  const formattedTime = currentTime ? format(currentTime, "HH:mm:ss") : "Loading...";
  const formattedDate = currentTime ? format(currentTime, "dd/MM/yyyy") : "Loading...";

  return { formattedTime, formattedDate };
}
