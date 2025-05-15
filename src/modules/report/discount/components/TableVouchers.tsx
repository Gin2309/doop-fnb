import CustomTable from "@/components/CustomTable";
import { ColumnsType } from "antd/es/table";
import { ReportVoucher } from "../report-voucher.api";

type TableVoucherProps = {
    data: Partial<ReportVoucher>[]
};

const TableVouchers = (props: TableVoucherProps) => {
    const { data } = props;
    const columns: ColumnsType<ReportVoucher> = [
        {
            title: "Tên giảm giá",
            dataIndex: "voucherName",
            key: "voucherName",
            align: "left",
        },
        {
            title: "Loại giảm giá",
            dataIndex: "type",
            key: "type",
            align: "center",
        },
        {
            title: "Số lượng",
            dataIndex: "count",
            key: "count",
            align: "center",
        },
        {
            title: "Tổng giảm giá",
            dataIndex: "value",
            key: "value",
            align: "center",
        },
    ]

    return <div>

        <CustomTable
            dataSource={data}
            columns={columns}
        // rowClassName={(record) =>
        //     record.children ? "parent-row hover-row" : "child-row hover-row"
        // }
        // expandedRowKeys={expandedRowKeys}
        // onRow={(record) => ({
        //     onClick: () => toggleExpandRow(record.key),
        // })}
        // expandable={{
        //     expandIcon: () => null,
        // }}
        />
    </div>;
};
export default TableVouchers;