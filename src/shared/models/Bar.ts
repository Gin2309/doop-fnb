export default class Bar {
  id: number;
  branchId: number;
  countProduct: number;
  isDefault: boolean;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  constructor(args: Partial<Bar> = {}) {
    this.id = args.id ?? -1;
    this.branchId  = args.branchId ?? -1;
    this.countProduct = args.countProduct ?? 0;
    this.isDefault = args.isDefault ?? false;
    this.name = args.name ?? "";
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }
}