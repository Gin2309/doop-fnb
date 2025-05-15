export type RevenueReportFormFilterData = {
  branchId: number;
  from?: string;
  to?: string;
}

export function isValidRevenueReportFilter(filter: RevenueReportFormFilterData) {
  return !isNaN(+filter.branchId) && !!filter.from && !!filter.to;
}