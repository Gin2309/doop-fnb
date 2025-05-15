import axiosClient from ".";

export function createPosition(payload) {
  return axiosClient.post(`pos/config-position`, payload);
}

export function createVariantPosition(payload: any) {
  return axiosClient.post(`pos/config-default-service`, payload);
}

export function deleteVariantPosition(id: number, branchId: number) {
  return axiosClient.post(`/pos/config-default-service/delete`, {
    branchId: branchId,
    id: id,
  });
}

export function getDetailPosition(id: number, branchId: number) {
  return axiosClient.get(`pos/config-position/${id}`, {
    params: {
      branchId: branchId,
    },
  });
}

export function updatePosition(id: number, payload) {
  return axiosClient.patch(`pos/config-position/${id}`, payload);
}

export function deletePosition(id: number, branchId: number) {
  return axiosClient.post(`pos/config-position/delete/${id}`, {
    branchId: branchId,
  });
}
