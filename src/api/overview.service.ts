import axiosClient from ".";

export function getOverviewByTime(params: {
  branchId: number;
  from?: string;
  to?: string;
}) {
  return axiosClient.get("pos/report/overview/revenueByTime", {
    params: {
      ...params,
    },
  });
}

export function getOverviewByProduct(params: {
  branchId: number;
  from?: string;
  to?: string;
}) {
  return axiosClient.get("pos/report/overview/revenueByProduct", {
    params: {
      ...params,
    },
  });
}

export function getOverviewByEmployee(params: {
  branchId: number;
  from?: string;
  to?: string;
}) {
  return axiosClient.get("pos/report/overview/revenueByEmployee", {
    params: {
      ...params,
    },
  });
}

export function getOverviewByCategory(params: {
  branchId: number;
  from?: string;
  to?: string;
}) {
  return axiosClient.get("pos/report/overview/revenueByCategory", {
    params: {
      ...params,
    },
  });
}

export function getOverviewBill(params: {
  branchId: number;
  from?: string;
  to?: string;
}) {
  return axiosClient.get("pos/report/overview/bill", {
    params: {
      ...params,
    },
  });
}

export function getOverviewCurrentBill(params: {
  branchId: number;
  from?: string;
  to?: string;
}) {
  return axiosClient.get("pos/report/overview/current-bill", {
    params: {
      ...params,
    },
  });
}
