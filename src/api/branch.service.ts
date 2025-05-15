import { EStatusBranch } from "@/enums";
import axiosClient from ".";

export function getBranch(params: {
  limit: number;
  page: number;
  keyword?: string;
  status?: EStatusBranch;
  userId?: number;
  sort?: string;
}) {
  return axiosClient.get("branches", {
    params: {
      ...params,
      page: params.page - 1,
    },
  });
}

export function createBranch(payload) {
  return axiosClient.post(`branches`, payload);
}

export function registerTrial(id: number) {
  return axiosClient.post(`branches/registerTrial/${id}`);
}

export function getDetailBranch(id: number) {
  return axiosClient.get(`branches/${id}`);
}

export function updateBranch(id: number, payload) {
  return axiosClient.patch(`branches/${id}`, payload);
}

export function deleteBranch(id: number) {
  return axiosClient.delete(`branches/${id}`);
}

export function leaveBranch(payload) {
  return axiosClient.delete(`employee`, { data: payload });
}
