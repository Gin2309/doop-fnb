import axiosClient from ".";

export function getAreaPos(branchId: number) {
  return axiosClient.get("pos/area", {
    params: {
      branchId: branchId,
    },
  });
}

export function getAreaPosition(branchId: number, id?: any) {
  const params: { branchId: number; areaId?: number } = { branchId };

  if (id !== undefined) {
    params.areaId = id;
  }

  return axiosClient.get(`pos/position`, { params });
}

export function getDetailAreaPos(id: number, branchId: number) {
  return axiosClient.get(`pos/area/${id}`, {
    params: {
      branchId: branchId,
    },
  });
}

export function createPositonOpen(payload) {
  return axiosClient.post(`pos/position/open`, payload);
}
export function transferPosition(payload) {
  return axiosClient.post(`pos/position/transfer`, payload);
}

export function mergePosition(payload) {
  return axiosClient.post(`pos/position/merge`, payload);
}

export function splitPosition(payload) {
  return axiosClient.post(`pos/position/split`, payload);
}
export function reservePosition(payload) {
  return axiosClient.post(`pos/position/reserve`, payload);
}

export function cancelPosition(id?: any, payload?: any) {
  return axiosClient.patch(`pos/position/cancel-current-bill`, {
    data: payload,
  });
}

export function updateCurrentBill(id, payload) {
  return axiosClient.patch(`pos/position/update-current-bill/${id}`, payload);
}

export function createPositonAddItems(id, payload) {
  return axiosClient.patch(`pos/position/add-items/${id}`, payload);
}

export function updatePositionServing(id: number) {
  return axiosClient.patch(`pos/position/serving/${id}`);
}

export function updatePositionServed(id: number) {
  return axiosClient.patch(`pos/position/served/${id}`);
}

export function getPosPositon(branchId: number, areaId: number) {
  return axiosClient.get("pos/area", {
    params: {
      branchId: branchId,
      areaId: areaId,
    },
  });
}

export function getDetailPosPosition(id: number, branchId: number) {
  return axiosClient.get(`pos/position/${id}`, {
    params: {
      branchId: branchId,
    },
  });
}

export function getPosPositionBarItems(branchId: number, barId: number) {
  return axiosClient.get("pos/position/barItems", {
    params: {
      branchId: branchId,
      barId: barId,
    },
  });
}
