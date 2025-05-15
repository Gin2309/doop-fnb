import CustomTable from "@/components/CustomTable";
import { ColumnsType } from "antd/es/table";
import Image from "next/image";
import DeleteIcon from "@/assets/deleteRed.svg";
import EditIcon from "@/assets/editBlue.svg";
import { formatDate } from "@/helpers";
import { useRouter } from "next/router";

const statusColors = {
  PENDING: "orange",
  ACTIVE: "green",
  INACTIVE: "gray",
  RESIGNED: "red",
};

const statusLabels = {
  PENDING: "Đang chờ",
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Không hoạt động",
  RESIGNED: "Đã nghỉ việc",
};

export default function TableList({ data }) {
  const router = useRouter();

  const columns: ColumnsType<any> = [
    {
      title: "Mã nhân viên",
      dataIndex: "code",
      key: "code",
      align: "center",
    },
    {
      title: "Tên nhân viên",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (_, { user }) => <p className="text-[#3355FF]"> {user?.name}</p>, // Implicit return
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      align: "center",
      render: (_, { employeeRole }) => employeeRole?.name,
    },
    {
      title: "Lần cuối truy cập",
      dataIndex: "lastLoginAt",
      align: "center",
      render: (lastLoginAt) => (lastLoginAt ? formatDate(lastLoginAt) : "-"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      render: (status) => (
        <p style={{ color: statusColors[status] }}>{statusLabels[status]}</p>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_, { id }) => (
        <div className="flex gap-3 justify-center">
          <div
            className=" cursor-pointer"
            onClick={() => router.push(`/employees/list/${id}`)}
          >
            <Image src={EditIcon} />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="mt-4">
      <CustomTable
        rowSelection={{
          type: "checkbox",
        }}
        dataSource={data?.map((item: any, index) => ({
          ...item,
          key: item.id,
        }))}
        columns={columns}
      />
    </div>
  );
}
