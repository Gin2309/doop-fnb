import axiosClient from "@/api";

export type ArgsApiGetReportVoucher = {
    branchId: number,
    from?: string, 
    to?: string    
}

export type ReportVoucher = {
    voucherId: number,
    voucherName: string,
    type:string,
    applyType: string,
    value: number,
    count: number
}

export async function apiGetReportVoucher(params: ArgsApiGetReportVoucher): Promise<Array<Partial<ReportVoucher>>> {
    try {
        const { branchId, from, to } = params;
        if(!branchId || !from || !to) return [];
        const { data } = await axiosClient.get("pos/report/overview/revenueByVoucher", {
            params: { 
                branchId,
                from,
                to
            }
        });    
        return data || []
    } catch (error) {
        return [];
    }
}