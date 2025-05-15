export default class Product {
  id: number;
  name: string;
  variantTypeHours: any[];
  variantHourFirst: any;
  unit: string;
  productType: string;
  
  constructor(data: Partial<Product> = {}) {
    this.id = data.id ?? -1;
    this.name = data.name ?? "";
    this.variantTypeHours = data.variantTypeHours ?? [];
    this.variantHourFirst = data.variantHourFirst ?? null;
    this.unit = data.unit ?? "";
    this.productType = data.productType ?? "";
  }
}