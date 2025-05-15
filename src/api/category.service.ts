import { EStatusBranch } from "@/enums";
import axiosClient from ".";

export function getCategory(params: {
  limit: number;
  page: number;
  keyword?: string;
  sort?: string;
  branchId: number;
}) {
  return axiosClient.get("pos/category", {
    params: {
      ...params,
      page: params.page - 1, // Adjust the page number here
    },
  });
}

export function createCategory(payload) {
  return axiosClient.post(`pos/category`, payload);
}

export function getDetailCategory(id: number, branchId: number) {
  return axiosClient.get(`pos/category/getById/${id}`, {
    params: {
      branchId: branchId, // Adding branchId as a query parameter
    },
  });
}

export function updateCategory(id: number, payload) {
  return axiosClient.patch(`pos/category/${id}`, payload);
}

export function deleteCategory(id: number, branchId: number) {
  return axiosClient.delete(`pos/category/${id}`, {
    data: {
      branchId: branchId,
    },
  });
}

export function deleteManyCategory(ids: number[], branchId: number) {
  return axiosClient.delete(`/pos/category`, {
    data: {
      branchId: branchId,
      ids: ids,
    },
  });
}
