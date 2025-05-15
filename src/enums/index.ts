export function getEnumKeyByValue(enumValue, value) {
  return Object.keys(enumValue).find((key) => enumValue[key] === value) || "";
}

export enum EStorageKey {
  ACCESS_TOKEN = "ACCESS_TOKEN",
  REFRESH_TOKEN = "REFRESH_TOKEN",
  TEMPORARY_TOKEN = "TEMPORARY_TOKEN",
}

export enum EStatusUser {
  ACTIVE = "ACTIVE",
  UNVERIFY = "UNVERIFY",
  BLOCK = "BLOCK",
}

export enum EStatusEmployee {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum EStatusBranch {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum EStatusKdsPos {
  PENDING = "PENDING",
  SERVING = "SERVING",
  SERVED = "SERVED",
}

export enum EPositionAction {
  TRANSFER = "TRANSFER",
  SPLIT = "SPLIT",
  MERGE = "MERGE",
  TRANSFER_ITEMS = "TRANSFER_ITEMS",
}
