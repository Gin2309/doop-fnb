export default class BankAccount {
  _id: any;
  bankName: string;
  accountNo: string;
  accountName: string;
  bankId: string;
  avatar: string;
  code: string;
  branchId: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<BankAccount> = {}) {
    this._id = data._id;
    this.bankName = data.bankName ?? '';
    this.accountNo = data.accountNo ?? '';
    this.accountName = data.accountName ?? '';
    this.bankId = data.bankId ?? '';
    this.avatar = data.avatar ?? '';
    this.code = data.code ?? '';
    this.branchId = data.branchId ?? 0;
    this.isActive = data.isActive ?? true;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}