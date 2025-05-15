import axiosClient from ".";

export function updateItemCurrentBill(id, payload) {
  return axiosClient.patch(`pos/position/update-item/${id}`, payload);
}

export type ArgsAddDiscountItemCurrentBill = {
  "currentBillId": number,
  "currentBillItemId"?: number,
  "value"?: number,
  "percent"?: number,
  "type": "VOUCHER" | "DISCOUNT" | "TAX",
  "branchId": number
}
export function addDiscountItemCurrentBill(payload: ArgsAddDiscountItemCurrentBill) {
  return axiosClient.post(`pos/position/add-discount`, payload);
}

export function returnItemCurrentBill(id, payload) {
  return axiosClient.patch(`pos/position/return-item/${id}`, payload);
}

export function sliceTime(id) {
  return axiosClient.patch(`pos/position/slice-time-item/${id}`);
}

export function addSelection(id: any, payload: any) {
  return axiosClient.patch(`pos/position/add-items/${id}`, payload);
}

export function transferItem(id: any, payload: any) {
  return axiosClient.patch(`pos/position/transfer-item/${id}`, payload);
}

export function getDetailTable(id: any, branchId: any) {
  return axiosClient.get(`pos/position/${id}`, {
    params: {
      branchId: branchId,
    },
  });
}

export function cancelCurrentBill(payload: any) {
  return axiosClient.patch(`pos/position/cancel-current-bill`, payload);
}

export type ArgsHandleBill = {
  currentBillId: number,
  branchId: number,
  notificationId: number
}
export function acceptCurrentBill(payload: ArgsHandleBill) {
  return axiosClient.patch(
    `pos/position/accept-cancel-current-bill`,
    payload
  );
}

export function rejectCurrentBill(payload: ArgsHandleBill) {
  return axiosClient.patch(
    `pos/position/reject-cancel-current-bill`,
    payload
  );
}

export function cancelItemCurrentBill(payload: any) {
  return axiosClient.patch(`pos/position/cancel-current-bill-item`, payload);
}

export type ArgsAcceptCurrentBillItem = {
  branchId: number,
  currentBillItemId: number,
  notificationId: number
}
export function acceptCurrentBillItem(args: ArgsAcceptCurrentBillItem) {
  return axiosClient.patch(
    `pos/position/accept-cancel-current-bill-item`,
    args
  );
}

export function rejectCurrentBillItem(args: ArgsAcceptCurrentBillItem) {
  return axiosClient.patch(
    `pos/position/reject-cancel-current-bill-item`,
    args
  );
}
