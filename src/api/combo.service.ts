import axiosClient from ".";

export function createCombo(payload: any) {
  return axiosClient.post(`pos/combo`, payload);
}

export function getAllCombo(params: {
  limit: number;
  page: number;
  keyword?: string;
  branchId: number;
}) {
  const page = params.page - 1;

  return axiosClient.get("pos/combo", {
    params: {
      ...params,
      page,
    },
  });
}

export function getDetailCombo(id: any, branchId: any) {
  return axiosClient.get(`pos/combo/getById/${id}?branchId=${branchId}`);
}

export function updateCombo(payload: any, id: any) {
  return axiosClient.patch(`pos/combo/${id}`, payload);
}

export function deleteCombo(branchId: any, id: any) {
  return axiosClient.delete(`pos/combo/${id}`, {
    data: {
      branchId: branchId,
    },
  });
}

export function deleteMultiple(branchId: number, ids: number[]) {
  return axiosClient.delete(`pos/combo`, {
    data: {
      branchId: branchId,
      ids: ids,
    },
  });
}
