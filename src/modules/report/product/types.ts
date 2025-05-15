export type CategoryReportFormFilterData = {
  branchId: number;
  from?: string;
  to?: string;
}

export function isValidCategoryReportFilter(filter: CategoryReportFormFilterData) {
  return !isNaN(+filter.branchId) && !!filter.from && !!filter.to;
}