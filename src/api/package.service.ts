import axiosClient from ".";

export function getPackage() {
  return axiosClient.get(`package/active`);
}

export function getPayment(params: {
  branchId?: string;
  limit: number;
  page: number;
  sort?: string;
}) {
  const page = params.page - 1;

  return axiosClient.get("payment", {
    params: {
      ...params,
      page,
    },
  });
}

export function postPayment(payload) {
  return axiosClient.post(`payment`, payload);
}

export function getNotifiPackage({
  phoneNumber,
  limit,
  page,
  sort,
}: {
  phoneNumber: string;
  type?: string;
  limit: number;
  page: number;
  sort?: string;
}) {
  return axiosClient.get(`notification/package`, {
    params: { phoneNumber, limit, page: page - 1, sort },
  });
}
