export class OpenSelectOption {
  id: number;
  name: string;
  price: number;
  primePrice: number;
  isDefault: boolean;
  selectionGroupId: number;
  constructor (data: Partial<OpenSelectOption> = {}) {
    this.id = data.id ?? -1;
    this.name = data.name ?? "";
    this.price = data.price ?? 0;
    this.primePrice = data.primePrice ?? 0;
    this.isDefault = data.isDefault ?? false;
    this.selectionGroupId = data.selectionGroupId ?? -1;
  }
}
export default class OpenSelect {
  id: number;
  currentBillItemId: number;
  quantity: number;
  selection?: OpenSelectOption;

  constructor(data: Partial<OpenSelect> = {}) {
    this.id = data.id ?? -1;
    this.currentBillItemId = data.currentBillItemId ?? -1;
    this.quantity = data.quantity ?? 0;
    this.selection =  data.selection;
  }
}