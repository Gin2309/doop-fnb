import { EStatusBranch } from "@/enums";
import axiosClient from ".";

export function getBranchChain(params: {
  limit: number;
  page: number;
  keyword?: string;
  sort?: string;
}) {
  return axiosClient.get("branches/chain", {
    params: {
      ...params,
      page: params.page - 1, // Adjust the page number here
    },
  });
}

export function createBranchChain(payload) {
  return axiosClient.post(`branches/chain`, payload);
}

export function getDetailBranchChain(id: number) {
  return axiosClient.get(`branches/chain/${id}`);
}

export function updateBranchChain(id: number, payload) {
  return axiosClient.patch(`branches/chain/${id}`, payload);
}

export function deleteBranchChain(id: number) {
  return axiosClient.delete(`branches/chain/${id}`);
}
