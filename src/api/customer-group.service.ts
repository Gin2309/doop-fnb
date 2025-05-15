import axiosClient from ".";

export function createCustomerGroup(payload: any) {
  return axiosClient.post(`pos/group-customer`, payload);
}

export function getCustomerGroupList(params: {
  limit: number;
  page: number;
  keyword?: string;
  branchId: number;
}) {
  const page = params.page - 1;

  return axiosClient.get("pos/group-customer", {
    params: {
      ...params,
      page,
    },
  });
}

export function getDetailCustomerGroup(branchId: any, id: any) {
  return axiosClient.get(`pos/group-customer/${id}?branchId=${branchId}`);
}

export function updateGroup(payload: any, id: any) {
  return axiosClient.patch(`pos/group-customer/${id}`, payload);
}

export function deleteCustomerGroup(branchId: number, id: any) {
  return axiosClient.delete(`pos/group-customer/${id}?branchId=${branchId}`);
}

export function addToGroup(payload: any, id: any) {
  return axiosClient.post(`pos/group-customer/${id}/add-customer`, payload);
}

export function removeFromGroup(payload: any, id: any) {
  return axiosClient.post(`pos/group-customer/${id}/delete-customer`, payload);
}
