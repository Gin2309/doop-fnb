import { EStatusBranch } from "@/enums";
import axiosClient from ".";

export function getSelectionGroup(params: {
  limit: number;
  page: number;
  keyword?: string;
  sort?: string;
  branchId: number;
}) {
  return axiosClient.get("pos/selection-group", {
    params: {
      ...params,
      page: params.page - 1, // Adjust the page number here
    },
  });
}

export function createSelectionGroup(payload) {
  return axiosClient.post(`pos/selection-group`, payload);
}

export function getDetailSelectionGroup(id: number, branchId: number) {
  return axiosClient.get(`pos/selection-group/getById/${id}`, {
    params: {
      branchId: branchId, // Adding branchId as a query parameter
    },
  });
}

export function updateSelectionGroup(id: number, payload) {
  return axiosClient.patch(`pos/selection-group/${id}`, payload);
}

export function deleteSelectionGroup(id: number, branchId: number) {
  return axiosClient.delete(`pos/selection-group/${id}`, {
    data: {
      branchId: branchId,
    },
  });
}

export function deleteManySelectionGroup(ids: number[], branchId: number) {
  return axiosClient.delete(`/pos/selection-group`, {
    data: {
      branchId: branchId,
      ids: ids,
    },
  });
}
