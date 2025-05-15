import axiosClient from ".";

export function getAreas(params: {
  limit: number;
  page: number;
  sort?: string;
  branchId: number;
}) {
  return axiosClient.get("pos/config-area", {
    params: {
      ...params,
      page: params.page - 1,
    },
  });
}

export function getCountAreas(params: { branchId: number | any }) {
  return axiosClient.get("pos/config-area/count", {
    params: {
      ...params,
    },
  });
}

export function createArea(payload) {
  return axiosClient.post(`pos/config-area`, payload);
}

export function getDetailArea(id: number, branchId: number) {
  return axiosClient.get(`pos/config-area/${id}`, {
    params: {
      branchId: branchId,
    },
  });
}

export function updateArea(id: number, payload) {
  return axiosClient.patch(`pos/config-area/${id}`, payload);
}

export function deleteArea(id: number, branchId: number) {
  return axiosClient.delete(`pos/config-area/${id}`, {
    data: {
      branchId: branchId,
    },
  });
}

export function deleteManyArea(ids: number[], branchId: number) {
  return axiosClient.delete(`/pos/config-area`, {
    data: {
      branchId: branchId,
      ids: ids,
    },
  });
}

export function UpdateIndexArea(branchId: number, ids: number[]) {
  return axiosClient.patch(`/pos/config-area`, {
    branchId: branchId,
    ids: ids,
  });
}
