import OpenSelect from "./OpenSelect";
import Product from "./Product";
import Variant from "./Variant";

export default class KDSItem {
  id: number;
  quantity: number;
  kdsStatus: string;
  paymentStatus: string | null;
  positionName: string;
  areaName: string;
  code: string;
  creatorName: string;
  openSelects: Array<OpenSelect>;
  itemPrice: number;
  finalPrice: number;
  startTime?: Date;
  endTime: Date | null;
  barId: number;
  discountValue: number | null;
  discountPercent: number | null;
  voucherValue: number | null;
  voucherPercent: number | null;
  taxValue: number | null;
  taxPercent: number | null;
  note: string | null;
  cookTime: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;

  product?: Product;
  variant?: Variant;

  constructor(data: Partial<KDSItem> = {}) {
    this.id = data.id ?? -1;
    this.quantity = data.quantity ?? 0;
    this.kdsStatus = data.kdsStatus ?? "";
    this.paymentStatus = data.paymentStatus ?? null;
    this.positionName = data.positionName ?? "";
    this.areaName = data.areaName ?? "";
    this.code = data.code ?? "";
    this.creatorName = data.creatorName ?? "";
    this.openSelects = data.openSelects ?? [];
    this.itemPrice = data.itemPrice ?? 0;
    this.finalPrice = data.finalPrice ?? 0;
    this.startTime = data.startTime;
    this.endTime = data.endTime ?? null;
    this.barId = data.barId ?? -1;
    this.discountValue = data.discountValue ?? null;
    this.discountPercent = data.discountPercent ?? null;
    this.voucherValue = data.voucherValue ?? null;
    this.voucherPercent = data.voucherPercent ?? null;
    this.taxValue = data.taxValue ?? null;
    this.taxPercent = data.taxPercent ?? null;
    this.note = data.note ?? null;
    this.cookTime = data.cookTime ?? new Date();
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();

    this.product = data.product;
    this.variant = data.variant;
  }
}