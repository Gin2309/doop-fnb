import BankAccount from "@/shared/models/BankAccount";
import axiosClient from ".";
import Bank from "@/shared/models/Bank";

export async function getBranchBankAccounts(params: {
  page?: number;
  pageSize?: number;
  branchId: number;
}) {
  return axiosClient.get<BankAccount[]>("config/fnb-bank-account/list", {
    params
  })
}

export async function createBranchBankAccount(data: BankAccount) {
  return axiosClient.post("config/fnb-bank-account/create", data);
}

export async function getBankList(params: {
  page?: number;
  pageSize?: number;
}) {
  const {
    page = 1,
    pageSize = 100
  } = params;
  return axiosClient.get<Bank[]>(
    "config/qr-bank/list",
    {
      params: {
        page,
        pageSize
      }
    }
  )
}