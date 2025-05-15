import KDSItem from "@/shared/models/KDSItem";
import axiosClient from ".";

export function getAllKdsBar(params: {
  barId?: number;
  branchId?: number | any;
  sort?: string | any;
}) {
  return axiosClient.get<KDSItem[]>("/kds/pending-items", {
    params: {
      ...params,
    },
  });
}

export function getGroupItem(params: {
  barId?: number;
  branchId?: number | any;
}) {
  return axiosClient.get("/kds/group-item", {
    params: {
      ...params,
    },
  });
}

// chờ thanh toán
export function getKdsPaymentPending(params: {
  barId?: number;
  branchId?: number | any;
}) {
  return axiosClient.get<KDSItem[]>("/kds/payment-pending", {
    params: {
      ...params,
    },
  });
}

// đã phục vụ
export function getKdsServedPending(params: {
  barId?: number;
  branchId?: number;
}) {
  return axiosClient.get("/kds/served-pending", {
    params: {
      ...params,
    },
  });
}

// chờ phục vụ
export function getKdsServingItem(params: {
  barId?: number;
  branchId?: number;
}) {
  return axiosClient.get<KDSItem[]>("/kds/serving-item", {
    params: {
      ...params,
    },
  });
}

export function updateKdsPending(id: number) {
  return axiosClient.patch(`/kds/pending/${id}`);
}

export function updateKdsServingVariants(data) {
  return axiosClient.patch(`/kds/serving-variant`, data);
}

export function updateKdsServed(id: number) {
  return axiosClient.patch(`/kds/served/${id}`);
}
export function updateKdsServing(id: number) {
  return axiosClient.patch(`/kds/serving/${id}`);
}

// Hủy món
export function deleteKdsRejected(id: number) {
  return axiosClient.delete(`/kds/rejected/${id}`);
}

export function updateKdsUndo(id: number) {
  return axiosClient.patch(`/kds/undo-status/${id}`);
}
