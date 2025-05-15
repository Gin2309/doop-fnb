import axiosClient from ".";

export function getSaleConfig(branchId: any) {
  return axiosClient.get("pos/config", {
    params: {
      branchId,
    },
  });
}

export function updateSaleConfig(data: any) {
  return axiosClient.patch("pos/config", data);
}
