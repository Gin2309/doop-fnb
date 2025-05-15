import { CustomCardItem } from "@/components/CustomCardItem";
import CustomTable from "@/components/CustomTable";
import { DotThreeIcon } from "@/shared/icons/DotThreeIcon";
import { ColumnsType } from "antd/es/table";

import Remove from "@/assets/Remove.svg";
import CheckCircle from "@/assets/CheckCircle.svg";
import Image from "next/image";
import { Dropdown, Menu, MenuProps } from "antd";
import styled from "styled-components";
import { DishPosIcon } from "@/shared/icons/DishPosIcon";
import CustomPagination from "@/components/CustomPagination";
import { useState } from "react";
import CancelTable from "./components/CancelTable";

export default function TablePosContent({ data }) {
  const [openCancelTable, setOpenCancelTable] = useState(false);

  const actionItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <span className="header-menu_item text-[#3355FF]">
          <Image width={24} height={24} src={CheckCircle} alt="" />
          Khách nhận bàn
        </span>
      ),
    },
    {
      key: "2",
      label: (
        <span className="header-menu_item  ">
          <DishPosIcon className="w-[24px] h-[24px]" />
          Chọn món
        </span>
      ),
    },
    {
      key: "3",
      label: (
        <div
          className="header-menu_item text-[#E50000]"
          onClick={() => setOpenCancelTable(true)}
        >
          <Image width={24} height={24} src={Remove} alt="" />
          Hủy đặt bàn
        </div>
      ),
    },
  ];

  const columns: ColumnsType<any> = [
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (customerName, { key }) => (
        <p className="text-[#3355FF]">{customerName}</p>
      ),
      align: "center",
    },
    {
      title: "Thời gian đặt",
      dataIndex: "reservationTime",
      key: "reservationTime",
      align: "center",
    },

    {
      title: "Số người",
      dataIndex: "numberOfPeople",
      key: "numberOfPeople",
      align: "center",
    },
    {
      title: "NV phục vụ",
      dataIndex: "numberOfPeople",
      key: "numberOfPeople",
      align: "center",
    },
    {
      title: "Vị trí bàn",
      dataIndex: "tablePosition",
      key: "tablePosition",
      align: "center",
    },
    {
      title: "VIP",
      dataIndex: "tablePosition",
      key: "tablePosition",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "tablePosition",
      key: "tablePosition",
      align: "center",
    },
    {
      title: "Món ăn",
      dataIndex: "dish",
      key: "dish",
      align: "center",
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_, { key }) => (
        <Dropdown
          overlay={<CustomDropDown items={actionItems} />}
          trigger={["click"]}
        >
          <div className="flex gap-3 cursor-pointer justify-center">
            <DotThreeIcon className="text-[#3355FF]" />
          </div>
        </Dropdown>
      ),
      align: "center",
    },
  ];

  return (
    <>
      <CustomCardItem className="p-5">
        <CustomTable
          rowSelection={{
            type: "checkbox",
          }}
          dataSource={data?.map((item: any, index) => ({
            ...item,
            key: index,
          }))}
          columns={columns}
        />

        <CustomPagination page={1} pageSize={10} total={100} />
      </CustomCardItem>

      <CancelTable
        isOpen={openCancelTable}
        onCancel={() => setOpenCancelTable(false)}
      />
    </>
  );
}

const CustomDropDown = styled(Menu)`
  background: #fff !important;
  padding: 10px 15px !important;
  width: 300px;
  position: relative;

  .ant-dropdown-menu-item {
    border-bottom: 1px solid #e9e9e9;
  }

  .ant-dropdown-menu-item:last-child {
    border-bottom: none;
  }

  &::before {
    content: "";
    position: absolute;
    top: -19px;
    right: 15px;
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent #fff transparent;
    z-index: 1;
  }
`;
