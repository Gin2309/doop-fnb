import axiosClient from ".";

export function createCustomer(payload: any) {
  return axiosClient.post(`pos/customer`, payload);
}

export function getCustomerList(params: {
  limit: number;
  page: number;
  keyword?: string;
  branchId: number;
}) {
  const page = params.page - 1;

  return axiosClient.get("pos/customer", {
    params: {
      ...params,
      page,
    },
  });
}

export function getDetailCustomer(branchId: any, id: any) {
  return axiosClient.get(`pos/customer/${id}?branchId=${branchId}`);
}

export function getProvince() {
  return axiosClient.get(`pos/province`);
}

export function updateCustomer(payload: any, id: any) {
  return axiosClient.patch(`pos/customer/${id}`, payload);
}

export function getDistrict(provinceCode: number | any) {
  return axiosClient.get(`pos/district?provinceCode=${provinceCode}`);
}

export function deleteCustomer(branchId: number, id: any) {
  return axiosClient.delete(`pos/customer/${id}?branchId=${branchId}`);
}

export function getListByGroup(params: {
  limit: number;
  page: number;
  keyword?: string;
  branchId: number;
  groupCustomerId: any;
}) {
  const page = params.page - 1;

  return axiosClient.get("pos/customer/list-by-group", {
    params: {
      ...params,
      page,
    },
  });
}

export function importCustomer(file: File, branchId: any) {
  const formData = new FormData();
  formData.append("file", file);
  return axiosClient.post(
    `pos/customer/import?branchId=${branchId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export const exportCustomer = async (branchId: any) => {
  try {
    const response = await axiosClient.post(
      `/pos/customer/export?branchId=${branchId}`,
      { branchId },
      { responseType: "blob" }
    );

    const blob = response;

    if (!(blob instanceof Blob)) {
      throw new Error("API response is not a Blob");
    }

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Danh_sach_khach_hang.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting Excel:", error);
  }
};
