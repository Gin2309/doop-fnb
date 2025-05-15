import Bar from "@/shared/models/Bar";
import axiosClient from ".";

export function getBar(params: {
  sort?: string;
  branchId: number;
  keyword?: string;
}) {
  return axiosClient.get<Bar[]>("pos/bar", {
    params,
  });
}

export function createBar(payload) {
  return axiosClient.post("pos/bar", payload);
}

export function getDetailBar(id: any, branchId: number) {
  return axiosClient.get(`pos/bar/getById/${id}`, {
    params: {
      branchId: branchId,
    },
  });
}

export function updateBar(id: any, payload: any) {
  return axiosClient.patch(`pos/bar/${id}`, payload);
}

export function switchBar(payload: any) {
  return axiosClient.patch(`pos/bar`, payload);
}

export function deletBar(id: any, branchId: number) {
  return axiosClient.delete(`pos/bar/${id}`, {
    data: {
      branchId: branchId,
    },
  });
}

export function deleteManyBar(ids: number[], branchId: number) {
  return axiosClient.delete(`/pos/bar`, {
    data: {
      branchId: branchId,
      ids: ids,
    },
  });
}
