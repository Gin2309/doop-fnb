import { useQuery } from "@tanstack/react-query";
import { isValidFilter } from "@/helpers/helpers";
import { apiGetReportVoucher, ArgsApiGetReportVoucher } from "../report-voucher.api";

const useFilterRange = (formFilter: ArgsApiGetReportVoucher) => {
    const { data, isLoading } = useQuery(
        [`TIME_OVERVIEW`, JSON.stringify(formFilter)],
        async () => {
            const response = await apiGetReportVoucher(formFilter)
            return response;
        },
        {
          enabled: Boolean(isValidFilter(formFilter)),
        }
    );

    return {data: data ?? [], isLoading};
};

export default useFilterRange;