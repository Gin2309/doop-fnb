import { EStatusBranch } from "@/enums";
import axiosClient from ".";

export function getUnit(params: {
  limit: number;
  page: number;
  keyword?: string;
  sort?: string;
  branchId: number;
}) {
  return axiosClient.get("pos/unit", {
    params: {
      ...params,
      page: params.page - 1, // Adjust the page number here
    },
  });
}

export function createUnit(payload) {
  return axiosClient.post(`pos/unit`, payload);
}

export function getDetailUnit(id: number, branchId: number) {
  return axiosClient.get(`pos/unit/getById/${id}`, {
    params: {
      branchId: branchId, // Adding branchId as a query parameter
    },
  });
}

export function updateUnit(id: number, payload) {
  return axiosClient.patch(`pos/unit/${id}`, payload);
}

export function deleteUnit(id: number) {
  return axiosClient.delete(`pos/unit/${id}`);
}
