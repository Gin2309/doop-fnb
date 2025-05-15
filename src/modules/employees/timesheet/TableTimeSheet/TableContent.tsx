import CustomPagination from "@/components/CustomPagination";
import CustomTableTimeSheet from "@/components/CustomTableTimeSheet";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import DetailTimeSheet from "./components/DetailTimeSheet";

export default function TableContent({ selectedDate }) {
  const [isOpenDetail, setIsOpenDetail] = useState(false);

  const { t } = useTranslation();

  const dataSource = [
    {
      stt: 1,
      employeeCode: "NV001",
      fullName: "Nguyễn Văn A",
      branch: "Chi nhánh 1",
      position: "Nhân viên",
      date: "2024-08-20",
    },
    {
      stt: 2,
      employeeCode: "NV002",
      fullName: "Trần Thị B",
      branch: "Chi nhánh 2",
      position: "Nhân viên",
      date: "2024-08-21",
    },
    {
      stt: 3,
      employeeCode: "NV003",
      fullName: "Lê Văn C",
      branch: "Chi nhánh 3",
      position: "Trưởng phòng",
      date: "2024-08-22",
    },
    {
      stt: 4,
      employeeCode: "NV004",
      fullName: "Phạm Thị D",
      branch: "Chi nhánh 4",
      position: "Nhân viên",
      date: "2024-08-23",
    },
    {
      stt: 5,
      employeeCode: "NV005",
      fullName: "Hoàng Văn E",
      branch: "Chi nhánh 5",
      position: "Nhân viên",
      date: "2024-08-24",
      day_1: 0.23,
    },
  ];

  const daysInMonth = selectedDate.daysInMonth();

  const dayColumns = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayFormatted = day < 10 ? `0${day}` : day.toString();

    // Tính thứ của ngày
    const dayOfWeek = new Date(
      selectedDate.year(),
      selectedDate.month(),
      day
    ).toLocaleDateString("vi-VN", { weekday: "short" });

    return {
      title: (
        <div className="flex flex-col">
          <p className="p-2">{dayOfWeek}</p> {/* Hiển thị thứ */}
          <p className="border-t border-[#D0D7E7] p-2">{dayFormatted}</p>{" "}
          {/* Hiển thị ngày với số 0 thêm vào */}
        </div>
      ),
      dataIndex: `day_${day}`,
      key: `day_${day}`,
      className: "!p-0",
      render: (value) => (
        <div className="cursor-pointer" onClick={() => setIsOpenDetail(true)}>
          {value}
        </div>
      ),
    };
  });

  const columns: ColumnsType<any> = [
    {
      title: t("STT"),
      dataIndex: "stt",
      key: "stt",
      width: 30,
    },
    {
      title: t("employeeCode"),
      dataIndex: "employeeCode",
      key: "employeeCode",
      width: 30,
    },
    {
      title: t("fullName"),
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
    },
    {
      title: t("branch"),
      dataIndex: "branch",
      key: "branch",
      width: 200,
    },
    {
      title: t("position"),
      dataIndex: "position",
      key: "position",
      width: 200,
    },
    ...dayColumns,
  ];

  return (
    <div className="mb-2">
      <CustomTableTimeSheet dataSource={dataSource} columns={columns} />

      <CustomPagination page={1} pageSize={10} total={20} />

      <DetailTimeSheet
        isOpen={isOpenDetail}
        onCancel={() => setIsOpenDetail(false)}
      />
    </div>
  );
}
