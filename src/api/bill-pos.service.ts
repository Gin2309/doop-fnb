import axiosClient from ".";

export function getBill(params: {
  limit: number;
  page: number;
  sort?: string;
  keyword?: string;
  branchId: number;
  order?: string;
}) {
  return axiosClient.get("pos/bill", {
    params: {
      ...params,
      page: params.page - 1,
    },
  });
}

export function createBillPayment(payload) {
  return axiosClient.post(`pos/bill/payment`, payload);
}

export function getCurrentBill(params: {
  limit: number;
  page: number;
  sort?: string;
  keyword?: string;
  branchId: number;
  status?: string;
}) {
  return axiosClient.get("pos/current-bill", {
    params: {
      ...params,
      page: params.page - 1,
    },
  });
}
