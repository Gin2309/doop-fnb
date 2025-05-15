import axiosClient from "./index";

export function login(payload: {
  phone: string;
  password: string;
  role: string;
}) {
  return axiosClient.post("auth/login", payload);
}

export function register1(payload: {
  phone: string | number;
  email?: string;
  password: string;
  name: string;
  address?: string;
  sex?: string;
  dob?: string | any;
  identityCardFront?: string;
  identityCardBack?: string;
  interestService?: string[] | any;
}) {
  return axiosClient.post("auth/register", payload);
}

export function register(payload: {
  phone: string;
  email: string;
  password: string;
}) {
  return axiosClient.post("auth/register", payload);
}

export function sentOtp(payload: { phone: string | any }) {
  return axiosClient.post("auth/send-otp", payload);
}

export function verifyOtp(payload: { phone: string | any; otp: string }) {
  return axiosClient.post("auth/verify-otp", payload);
}

export function getOtp(payload: { phone: string }) {
  return axiosClient.post("auth/get-otp", payload);
}

export function checkPhone(payload: { phone: string }) {
  return axiosClient.post("auth/check-phone", payload);
}

export function changePass(payload: { phone: string; password: string }) {
  return axiosClient.patch("auth/forgot-password", payload);
}
