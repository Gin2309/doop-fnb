import axiosClient from "./index";

export function getProfile() {
  return axiosClient.get(`user/profile`);
}

export function deleteAcc() {
  return axiosClient.delete(`user/delete`);
}

export function updateUser(data: {
  phone?: string;
  email?: string;
  name?: string;
  address?: string;
  sex?: string;
}) {
  return axiosClient.patch(`user/update`, data);
}

export function updatePassword(data: { password: string }) {
  return axiosClient.patch(`user/update-password`, data);
}
