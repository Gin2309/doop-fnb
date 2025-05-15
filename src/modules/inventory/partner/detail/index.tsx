import React from "react";
import { useTranslation } from "react-i18next";
import { Space } from "antd";

import Title from "@/components/Title";
import { CustomButton } from "@/components/CustomButton";
import Label from "@/components/CustomLabel";
import { CustomInput, CustomTextarea } from "@/components/CustomInput";
import CustomTable from "@/components/CustomTable";
import { ColumnsType } from "antd/es/table";
import { formatMoney } from "@/helpers";

const columns: ColumnsType<any> = [
  {
    title: "Mã phiếu",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "Thời gian",
    dataIndex: "created",
    key: "created",
  },
  {
    title: "Người tạo",
    dataIndex: "user",
    key: "user",
  },
  {
    title: "Giá thành",
    dataIndex: "price",
    key: "price",
    render: (value: number) => formatMoney(value),
  },
  {
    title: "Trang thái",
    dataIndex: "status",
    key: "status",
  },
];

const DetailPartner = () => {
  const { t } = useTranslation();
  const selectedList = [
    {
      key: 1,
      code: "NK000024",
      created: "12/10/2023 11:34",
      user: "dung",
      price: 65000,
      status: "Hoàn thành",
    },
    {
      key: 2,
      code: "NK000024",
      created: "12/10/2023 11:34",
      user: "dung",
      price: 65000,
      status: "Hoàn thành",
    },
  ];

  return (
    <>
      <Title>Thịt bò Fuji</Title>
      <div className="2xs:gap-4 md:gap-6 flex flex-col">
        <div className="card">
          <h1 className="text-[#1a1a1a]  font-semibold text-[17px] uppercase ">
            Thông tin đối tác
          </h1>
          <div className="my-6 grid gap-6 grid-cols-1 md:grid-cols-2">
            <div>
              <Label infoText="" label="Mã đối tác" />
              <CustomInput
                onChange={(value: any) => console.log(value)}
                className="suffix-icon h-11 !rounded"
                placeholder=""
              />
            </div>
            <div>
              <Label infoText="" label="Tên đối tác" />
              <CustomInput
                onChange={(value: any) => console.log(value)}
                className="suffix-icon h-11 !rounded"
                placeholder=""
              />
            </div>
            <div>
              <Label infoText="" label="Mã số thuế" />
              <CustomInput
                onChange={(value: any) => console.log(value)}
                className="suffix-icon h-11 !rounded"
                type="number"
                placeholder=""
              />
            </div>
            <div>
              <Label infoText="" label="Số điện thoại" />
              <CustomInput
                onChange={(value: any) => console.log(value)}
                className="suffix-icon h-11 !rounded"
                type="number"
                placeholder=""
              />
            </div>
            <div>
              <Label infoText="" label="Chí nhánh" />
              <CustomInput
                onChange={(value: any) => console.log(value)}
                className="suffix-icon h-11 !rounded"
                type="number"
                placeholder=""
              />
            </div>
            <div>
              <Label infoText="" label="Địa chỉ" />
              <CustomInput
                onChange={(value: any) => console.log(value)}
                className="suffix-icon h-11 !rounded"
                type="number"
                placeholder=""
              />
            </div>
          </div>

          <div className="py-5 mt-5">
            <Label infoText="" label="Mô tả đối tác" />
            <CustomTextarea
              placeholder="Nhập mô tả"
              onChange={() => {}}
              rows={7}
            />
          </div>
        </div>

        <div className="card">
          <h1 className="text-[#1a1a1a] mb-[15px] font-semibold text-[17px] uppercase ">
            Lịch sử nhập/trả hàng
          </h1>

          <CustomTable
            rowSelection={{
              type: "checkbox",
            }}
            dataSource={selectedList?.map((item: any, index) => ({
              ...item,
              key: index,
            }))}
            columns={columns}
          />
        </div>

        <div className="card">
          <h1 className="text-[#1a1a1a] mb-[15px] font-semibold text-[17px] uppercase ">
            Nợ cần trả đối tác
          </h1>

          <CustomTable
            rowSelection={{
              type: "checkbox",
            }}
            dataSource={selectedList?.map((item: any, index) => ({
              ...item,
              key: index,
            }))}
            columns={columns}
          />
        </div>
      </div>

      <div className="card flex justify-between 2xs:my-4 md:my-6">
        <CustomButton type="danger" wrapClassName="2xs:w-[80px] sm:w-[100px]">
          {t("delete")}
        </CustomButton>
        <Space>
          <CustomButton
            type="original"
            wrapClassName="2xs:w-[80px] sm:w-[100px]"
          >
            {t("cancel")}
          </CustomButton>
          <CustomButton
            type="primary"
            wrapClassName="2xs:w-[80px] sm:w-[100px]"
          >
            {t("save")}
          </CustomButton>
        </Space>
      </div>
    </>
  );
};

export default DetailPartner;
