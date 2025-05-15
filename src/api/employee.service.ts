import { EStatusEmployee } from "@/enums";
import axiosClient from ".";

export function getEmployee(params: {
  limit: number;
  page: number;
  branchId?: string;
  status?: EStatusEmployee;
  role?: string;
  keyword?: string;
}) {
  return axiosClient.get("employee", {
    params: {
      ...params,
      page: params.page - 1, // Adjust the page number here
    },
  });
}

export function createEmployee(payload) {
  return axiosClient.post(`employee`, payload);
}

export function getDetailEmployee(id: number) {
  return axiosClient.get(`employee/getEmployeeById/${id}`);
}

export function updateEmployee(id: number, payload) {
  return axiosClient.patch(`employee/${id}`, payload);
}

export function deleteEmployee(id: number) {
  return axiosClient.delete(`employee/${id}`);
}
