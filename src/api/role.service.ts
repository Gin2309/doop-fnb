import axiosClient from "./index";

export function getRole(params: {
  page: number;
  limit: number;
  branchId: number;
  keyword?: string;
}) {
  return axiosClient.get("employee/role", {
    params: {
      ...params,
      page: params.page - 1, // Adjust the page number here
    },
  });
}

export function getPermission() {
  return axiosClient.get(`employee/permission`);
}

export function getRoleDetail(id: number) {
  return axiosClient.get(`employee/role/${id}`);
}

export function updateRole(id: number, payload) {
  return axiosClient.patch(`employee/role/${id}`, payload);
}

export function createRole(payload) {
  return axiosClient.post(`employee/role`, payload);
}

export function deleteRole(id: number) {
  return axiosClient.delete(`employee/role/${id}`);
}
