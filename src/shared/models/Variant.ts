export default class Variant {
  id: number;
  code: string;
  barCode: string;
  name: string;
  price: number;
  primePrice: number;
  duration: any;
  durationType: any;
  productId: number;
  productName: string | null;
  isConfigPrice: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<Variant> = {}) {
    this.id = data.id ?? -1;
    this.code = data.code ?? "";
    this.barCode = data.barCode ?? "";
    this.name = data.name ?? "";
    this.price = data.price ?? 0;
    this.primePrice = data.primePrice ?? 0;
    this.duration = data.duration ?? null;
    this.durationType = data.durationType ?? null;
    this.productId = data.productId ?? -1;
    this.productName = data.productName ?? null;
    this.isConfigPrice = data.isConfigPrice ?? false;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}