export default class Bank {
  _id: any
  name: string
  code: string
  bin: string
  shortName: string
  logo: string
  transferSupported: number
  lookupSupported: number
  short_name: string
  support: number
  isTransfer: number
  swift_code: string
  avatar: string
  createdAt: Date
  updatedAt: Date

  constructor(data: Partial<Bank> = {}) {
    this._id = data._id
    this.name = data.name ?? ''
    this.code = data.code ?? ''
    this.bin = data.bin ?? ''
    this.shortName = data.shortName ?? ''
    this.logo = data.logo ?? ''
    this.transferSupported = data.transferSupported ?? 0
    this.lookupSupported = data.lookupSupported ?? 0
    this.short_name = data.short_name ?? ''
    this.support = data.support ?? 0
    this.isTransfer = data.isTransfer ?? 0
    this.swift_code = data.swift_code ?? ''
    this.avatar = data.avatar ?? ''
    this.createdAt = data.createdAt ?? new Date()
    this.updatedAt = data.updatedAt ?? new Date()
  }
}