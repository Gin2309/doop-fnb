import axiosClient from ".";

export function createProduct(payload) {
  return axiosClient.post(`pos/product`, payload);
}

export function getProducts(params: {
  limit: number;
  page: number;
  sort?: string;
  keyword?: string;
  branchId?: number | string;
  categoryId?: number | string;
  type?: any;
  status?: string;
  isProduct?: boolean;
}) {
  return axiosClient.get("pos/product", {
    params: {
      ...params,
      page: params.page - 1,
    },
  });
}

export function getProductByMenu(
  id: number,
  params: {
    keyword?: string;
    branchId?: number | string;
    categoryId?: number | string;
    type?: any;
  }
) {
  return axiosClient.get(`pos/product/getByMenu/${id}`, {
    params: {
      ...params,
    },
  });
}

export function getDetailProduct(id: number, branchId: number) {
  return axiosClient.get(`pos/product/getById/${id}`, {
    params: {
      branchId: branchId,
    },
  });
}

export function updateProduct(id: number, payload) {
  return axiosClient.patch(`pos/product/${id}`, payload);
}

export function deleteProduct(id: number, branchId: number) {
  return axiosClient.delete(`pos/product/${id}`, {
    data: { branchId },
  });
}

export function deleteManyProduct(ids: number[], branchId: number) {
  return axiosClient.delete(`/pos/product`, {
    data: {
      branchId: branchId,
      ids: ids,
    },
  });
}

export function updateStatusProduct(id: number, payload) {
  return axiosClient.patch(`pos/product/update-status/${id}`, payload);
}

export function importProductFile(branchId: number) {
  return axiosClient.get(`/pos/product/import/excel`, {
    data: {
      branchId: branchId,
    },
  });
}

export function exporProducttFile(branchId: number, Ids) {
  return axiosClient.post(`/pos/product/export/excel`, {
    data: {
      branchId: branchId,
      Ids: Ids,
    },
  });
}

export function exportProduct(branchId: number) {
  return axiosClient
    .get(`pos/product/export/excel?branchId=${branchId}`, {
      responseType: "blob",
    })
    .then((response) => {
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `product.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
