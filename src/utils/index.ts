import { format } from "date-fns";
import Avatars from "@/assets/Avatar.svg";
import { setToken } from "@/helpers/storage";
import { getTimezoneOffset } from "date-fns-tz";

const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const getAdjustedDate = (timestamp: any) => {
  const date = new Date(timestamp);
  const offsetHours = getTimezoneOffset(currentTimeZone, date) / 3600000;
  return new Date(date.getTime() + offsetHours * 3600000);
};

export function formatCurrency(amount: number, replaceText = "đ"): string {
  const formattedAmount = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);

  return formattedAmount.replace("₫", replaceText).replace(/\./g, ",");
}

export function formatCurrencyWithoutSymbol(amount: number): string {
  const formattedAmount = new Intl.NumberFormat("vi-VN", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(amount);

  return formattedAmount.replace(/\./g, ",");
}

export function maskPhoneNumber(phoneNumber: string | any) {
  const maskedNumber =
    phoneNumber.substring(0, 2) + "*****" + phoneNumber.substring(7);
  return maskedNumber;
}

export const formatTime = (timestamp: string | any) => {
  const adjustedDate = getAdjustedDate(timestamp);
  return format(adjustedDate, "dd/MM/yyyy'  'HH:mm");
};

export const formatTime2 = (timestamp: string | any) => {
  if (!timestamp) return "-";

  const adjustedDate = getAdjustedDate(timestamp);

  return adjustedDate ? format(adjustedDate, "HH:mm'  'dd/MM/yyyy") : "-";
};

export const formatDate = (timestamp: string | any) => {
  const adjustedDate = getAdjustedDate(timestamp);
  return format(adjustedDate, "dd/MM/yyyy");
};

export const formatTimeWithSeconds = (timestamp: string | any) => {
  const adjustedDate = getAdjustedDate(timestamp);
  return format(adjustedDate, "dd/MM/yyyy' - 'HH:mm:ss");
};

export function isColorAvatar(str) {
  return str?.startsWith("#");
}

export function isIconAvatar(str) {
  return str?.startsWith("img");
}

export function formatHours(timestamp: string | any) {
  const adjustedDate = getAdjustedDate(timestamp);
  return format(adjustedDate, "HH:mm");
}

export const getValidImageUrl = (
  imageUrl: string | null | undefined
): string => {
  const defaultImage = Avatars;

  if (!imageUrl || typeof imageUrl !== "string" || imageUrl.trim() === "") {
    return defaultImage;
  }

  try {
    const url = new URL(imageUrl);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return imageUrl;
    }
  } catch (error) {
    if (imageUrl.startsWith("/")) {
      return imageUrl;
    }
  }

  return defaultImage;
};

export const setTokenWithExpiry = (token: string, expiryDuration: number) => {
  const expiry = Date.now() + expiryDuration * 1000;
  setToken(token);
  localStorage.setItem("tokenExpiry", expiry.toString());
};

export const getTokenExpiry = () => {
  const expiry = localStorage.getItem("tokenExpiry");
  return expiry ? parseInt(expiry, 10) : null;
};

export function formatTimeCreateAt(isoDate: string): string {
  const date = new Date(isoDate);

  // Add 7 hours
  date.setHours(date.getHours() + 7);

  const day = String(date.getDate()).padStart(2, "0"); // Ensure day is two digits
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure month is two digits
  const hours = String(date.getHours()).padStart(2, "0"); // Ensure hours is two digits
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Ensure minutes is two digits

  return `${day}/${month} ${hours}:${minutes}`;
}

export function formatTimeCreateAtPOS(isoDate: string): string {
  const date = new Date(isoDate);

  // Add 7 hours
  date.setHours(date.getHours() + 7);

  const day = String(date.getDate()).padStart(2, "0"); // Ensure day is two digits
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure month is two digits
  const hours = String(date.getHours()).padStart(2, "0"); // Ensure hours is two digits
  const year = date.getFullYear(); // Get the full year
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Ensure minutes is two digits

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function calculateMinutesFromCreateAt(createdAt: string): number {
  if (!createdAt) return 0;

  const createdDate = new Date(createdAt);
  if (isNaN(createdDate.getTime())) return 0; // Ensure the createdAt is valid

  // Add 7 hours
  createdDate.setHours(createdDate.getHours() + 7);

  const currentTime = Date.now(); // Thời gian hiện tại
  const timeDifference = currentTime - createdDate.getTime(); // Khoảng thời gian giữa hai mốc thời gian (milliseconds)

  // Chuyển đổi khoảng thời gian từ milliseconds sang phút
  const minutes = Math.floor(timeDifference / 60000);

  return minutes > 0 ? minutes : 0;
}

export function calculateReceptionTime(createdAt: string): string {
  if (!createdAt) return "0H 0p";

  const createdDate = new Date(createdAt);
  if (isNaN(createdDate.getTime())) return "0H 0p"; // Ensure the createdAt is valid

  // Add 7 hours for timezone adjustment
  createdDate.setHours(createdDate.getHours() + 7);

  const currentTime = Date.now(); // Current time in milliseconds
  const timeDifference = currentTime - createdDate.getTime(); // Difference in milliseconds

  // Convert the time difference from milliseconds to minutes
  const totalMinutes = Math.floor(timeDifference / 60000);

  // Calculate hours and remaining minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Return formatted string as "xH yp"
  return `${hours}H ${minutes}p`;
}

export function calculateEndTime(createdAt: string): string {
  if (!createdAt) return "0 giờ 0 phút";

  const createdDate = new Date(createdAt);
  if (isNaN(createdDate.getTime())) return "0 giờ 0 phút"; // Ensure the createdAt is valid

  // Add 7 hours for timezone adjustment
  createdDate.setHours(createdDate.getHours() + 7);

  const currentTime = Date.now(); // Current time in milliseconds
  const timeDifference = currentTime - createdDate.getTime(); // Difference in milliseconds

  // Convert the time difference from milliseconds to minutes
  const totalMinutes = Math.floor(timeDifference / 60000);

  // Calculate hours and remaining minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Return formatted string as "xH yp"
  return `${hours} giờ ${minutes} phút`;
}

export function numberToWords(n: number): string {
  const units = [
    "",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const tens = [
    "",
    "mười",
    "hai mươi",
    "ba mươi",
    "bốn mươi",
    "năm mươi",
    "sáu mươi",
    "bảy mươi",
    "tám mươi",
    "chín mươi",
  ];
  const scales = ["", "nghìn", "triệu", "tỷ"];

  if (n === 0) return "Không đồng chẵn";

  const numberToWordsHelper = (num: number): string => {
    let result = "";
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    const ten = Math.floor(remainder / 10);
    const unit = remainder % 10;

    if (hundred > 0) result += `${units[hundred]} trăm `;
    if (ten > 0 || unit > 0) {
      if (ten > 0) {
        result += `${tens[ten]} `;
      } else if (hundred > 0) {
        result += "lẻ ";
      }
      if (unit > 0) {
        if (unit === 5 && ten > 0) result += "lăm ";
        else result += `${units[unit]} `;
      }
    }

    return result.trim();
  };

  let result = "";
  let scaleIndex = 0;

  while (n > 0) {
    const part = n % 1000;
    if (part > 0) {
      const words = numberToWordsHelper(part);
      result = `${words} ${scales[scaleIndex]} ${result}`.trim();
    }
    n = Math.floor(n / 1000);
    scaleIndex++;
  }

  return `${result} đồng`.trim();
}

export const calculateCreatedTime = (timeCreated: string | Date): string => {
  const periods: { [key: string]: number } = {
    năm: 365 * 24 * 60 * 60 * 1000,
    tháng: 30 * 24 * 60 * 60 * 1000,
    tuần: 7 * 24 * 60 * 60 * 1000,
    ngày: 24 * 60 * 60 * 1000,
    giờ: 60 * 60 * 1000,
    phút: 60 * 1000,
  };

  let createdTime = new Date(timeCreated);
  if (createdTime.getTimezoneOffset() !== 0) {
    createdTime = new Date(timeCreated + "Z");
  }
  const timestampCreatedTime = createdTime.getTime();
  const currentTime = Date.now();
  const diff: number = currentTime - timestampCreatedTime;

  for (const key in periods) {
    const period = periods[key as keyof typeof periods];

    if (period !== undefined && diff >= period) {
      const result = Math.floor(diff / period);
      return `${result} ${key} trước`;
    }
  }

  return "Vừa xong";
};

export const calculateCreatedTimeColor = (
  timeCreated: string | Date
): { color: string; timeText: string } => {
  const periods: { [key: string]: any } = {
    năm: 365 * 24 * 60 * 60 * 1000,
    tháng: 30 * 24 * 60 * 60 * 1000,
    tuần: 7 * 24 * 60 * 60 * 1000,
    ngày: 24 * 60 * 60 * 1000,
    giờ: 60 * 60 * 1000,
    phút: 60 * 1000,
  };

  let createdTime = new Date(timeCreated);
  if (createdTime.getTimezoneOffset() !== 0) {
    createdTime = new Date(timeCreated + "Z");
  }
  const timestampCreatedTime = createdTime.getTime();
  const currentTime = Date.now();
  const diff: number = currentTime - timestampCreatedTime;

  let color = "#009933";
  let timeText = "Vừa xong";

  for (const key in periods) {
    const period = periods[key as keyof typeof periods];

    if (period !== undefined && diff >= period) {
      const result = Math.floor(diff / period);
      timeText = `${result} ${key} trước`;

      if (diff <= 5 * periods.phút) {
        color = "#009933";
      } else if (diff <= 10 * periods.phút) {
        color = "#EDC700";
      } else {
        color = "#E92215";
      }

      break;
    }
  }

  return { color, timeText };
};
