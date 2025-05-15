import axiosClient from ".";

export function createVoucher(payload) {
  return axiosClient.post(`/pos/voucher`, payload);
}

export function getVouchers(params: {
  limit: number;
  page: number;
  sort?: string;
  branchId?: number | string;
  voucherType?: string;
  applyType?: string;
  isActive?: boolean;
  isOnlineChannel?: boolean;
}) {
  return axiosClient.get("/pos/voucher", {
    params: {
      ...params,
      page: params.page - 1,
    },
  });
}

export function deleteVoucher(id: number, branchId: number) {
  return axiosClient.delete(`/pos/voucher/${id}`, {
    data: { branchId },
  });
}

export function updateVoucher(id: number, payload: any) {
  return axiosClient.patch(`/pos/voucher/${id}`, payload);
}

export function getDetailVoucher(id: number, branchId: number) {
  return axiosClient.get(`/pos/voucher/getById/${id}`, {
    params: {
      branchId: branchId,
    },
  });
}

export function InActiveVoucher(id: number, branchId: number) {
  return axiosClient.patch(
    `/pos/voucher/inactiveStatus/${id}?branchId=${branchId}`
  );
}

export function ActiveVoucher(id: number, branchId: number) {
  return axiosClient.patch(
    `/pos/voucher/activeStatus/${id}?branchId=${branchId}`
  );
}
