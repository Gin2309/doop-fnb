import React, { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import Title from "@/components/Title";

import { Space } from "antd";

import { CustomButton } from "@/components/CustomButton";
import { CustomCardItem } from "@/components/CustomCardItem";
import BallotIcon from "@/assets/ballot.svg";
import Label from "@/components/CustomLabel";
import { CustomInput, CustomTextarea } from "@/components/CustomInput";
import FileUpload from "@/components/CustomUpload/FileUpload";
import { ColumnsType } from "antd/es/table";
import { CustomSelect } from "@/components/CustomSelect";
import MagnifyingGlass from "@/assets/MagnifyingGlass.svg";
import SortingIcon from "@/assets/column-sorting.svg";
import CloseIcon from "@/assets/CloseIcon2.svg";
import { formatNumber } from "@/helpers";
import CustomTable from "@/components/CustomTable";
import styled from "styled-components";

interface Record {
  key: number;
  name: string;
  unit: string;
  quantity: number;
}

const DetailStock = () => {
  const { t } = useTranslation();
  const unitGroup = {
    data: {
      items: [
        { id: "1", name: t("Chai") },
        { id: "2", name: t("Lốc") },
      ],
    },
  };

  const columns: ColumnsType<Record> = [
    {
      title: t("itemIngredientName"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("unit"),
      dataIndex: "unit",
      key: "unit",
      width: "200px",
      render: (value: string) => (
        <CustomSelect
          onChange={(value) => console.log(value)}
          options={unitGroup?.data?.items?.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          showSearch={true}
          className="suffix-icon h-11 !rounded"
          placeholder="Chọn chi nhánh"
          value={value}
          suffixIcon={
            <div className="flex items-center">
              <Image src={SortingIcon} alt="" />
            </div>
          }
        />
      ),
      align: "center",
    },
    {
      title: t("quantity"),
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: "200px",
      render: (value: string) => (
        <CustomInput
          onChange={(value: any) => console.log(value)}
          className="suffix-icon h-11 !rounded"
          type="number"
          placeholder="Nhập số lượng"
          value={formatNumber(value)}
        />
      ),
    },
    {
      title: t(""),
      dataIndex: "action",
      key: "action",
      width: "100px",
      align: "center",
      render: () => {
        return (
          <>
            <div>
              <Image src={CloseIcon} />
            </div>
          </>
        );
      },
    },
  ];

  const locale = {
    emptyText: (
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            color: "#666666",
            fontSize: 14,
          }}
        >
          {t("selectItemIngredient")}
        </p>
      </div>
    ),
  };

  const dataSource = [];

  return (
    <>
      <Title>KK123456</Title>

      <CustomCardItem>
        <div className="p-6 mt-5">
          <h1 className="text-[#1a1a1a] font-semibold text-[17px] uppercase ">
            Thông tin phiếu
          </h1>

          <div className="my-6 grid gap-6 grid-cols-1 md:grid-cols-3">
            <div>
              <Label infoText="" label={t("receiptCode")} />
              <CustomInput
                onChange={(value: any) => console.log(value)}
                className="suffix-icon h-11 !rounded"
                disabled
                placeholder="Mã sinh tự động nên để trống"
              />
            </div>

            <div>
              <Label infoText="" label={t("receiptName")} />
              <CustomInput
                onChange={(value: any) => console.log(value)}
                className="suffix-icon h-11 !rounded"
                placeholder="Nhập tên phiếu"
              />
            </div>

            <div>
              <Label infoText="" label={t("documentFile")} />
              <FileUpload placeholder={t("uploadDocumentFile")} />
            </div>
          </div>
        </div>
      </CustomCardItem>
      <CustomCardItem>
        <div className="p-6 mt-5">
          <h1 className="text-[#1a1a1a] font-semibold text-[17px] uppercase ">
            Thông tin mặt hàng, nguyên liệu
          </h1>
          <div className="my-6 gap-6">
            <ComponentStyled>
              <div className="grid grid-cols-12">
                <div className="col-span-10">
                  <CustomInput
                    onChange={(value: any) => console.log(value)}
                    className="suffix-icon h-11 !rounded "
                    placeholder={t("searchItemIngredient")}
                  />
                </div>
                <div className="col-span-2">
                  <CustomButton
                    type="search"
                    prefixIcon={<Image src={MagnifyingGlass} />}
                  >
                    {t("search")}
                  </CustomButton>
                </div>
              </div>
            </ComponentStyled>
          </div>

          <div className="mt-6">
            <CustomTable
              dataSource={dataSource}
              locale={locale}
              columns={columns}
              rowClassName={() => "hover-row"}
            />
          </div>
        </div>
      </CustomCardItem>

      <CustomCardItem>
        <div className="p-6 mt-5">
          <Label infoText="" label="Ghi chú" />
          <CustomTextarea
            placeholder="Nhập mô tả"
            onChange={() => {}}
            rows={7}
          />
        </div>
      </CustomCardItem>

      <div
        className="bg-white border-t-[1px] h-[72px] fixed right-0 bottom-0 flex justify-between items-center px-[30px]"
        style={{ width: "calc(100% - 250px)" }}
      >
        <CustomButton type="danger">Hủy phiếu</CustomButton>
        <Space>
          <CustomButton type="primary" prefixIcon={<Image src={BallotIcon} />}>
            Xuất phiếu
          </CustomButton>
        </Space>
      </div>
    </>
  );
};

export default DetailStock;

export const ComponentStyled = styled.div`
  .ant-btn {
    border-radius: 0 4px 4px 0 !important;
  }

  .ant-input {
    border-radius: 4px 0 0 4px !important;
  }
`;
