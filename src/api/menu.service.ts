import { EStatusBranch } from "@/enums";
import axiosClient from ".";

export function getMenu(params: {
  keyword?: string;
  sort?: string;
  branchId: number;
}) {
  return axiosClient.get("pos/menu", {
    params: {
      ...params,
    },
  });
}

export function createMenu(payload) {
  return axiosClient.post(`pos/menu`, payload);
}

export function getDetailMenu(id: number, branchId: number) {
  return axiosClient.get(`pos/menu/getById/${id}`, {
    params: {
      branchId: branchId, // Adding branchId as a query parameter
    },
  });
}

export function updateMenu(id: number, payload) {
  return axiosClient.patch(`pos/menu/${id}`, payload);
}

export function deleteMenu(id: number, branchId: number) {
  return axiosClient.delete(`pos/menu/${id}`, {
    data: {
      branchId: branchId,
    },
  });
}

export function updateIndexMenu(branchId: number, ids: number[]) {
  return axiosClient.patch(`/pos/menu`, {
    branchId: branchId,
    ids: ids,
  });
}
