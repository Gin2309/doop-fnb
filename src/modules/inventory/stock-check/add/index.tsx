import { CustomButton } from "@/components/CustomButton";
import { CustomCardItem } from "@/components/CustomCardItem";
import { CustomInput, CustomTextarea } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import FileUpload from "@/components/CustomUpload/FileUpload";
import { Space } from "antd";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import MagnifyingGlass from "@/assets/MagnifyingGlass.svg";
import styled from "styled-components";
import CustomTable from "@/components/CustomTable";
import { formatNumber } from "@/helpers";
import { CustomSelect } from "@/components/CustomSelect";
import { ColumnsType } from "antd/es/table";
import SortingIcon from "@/assets/column-sorting.svg";
import CloseIcon from "@/assets/CloseIcon2.svg";

interface Record {
  key: number;
  name: string;
  unit: string;
  quantity: number;
}

const AddStockCheck = () => {
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
    <div>
      <CustomCardItem>
        <div className="2xs:p-4 md:p-6 mt-5">
          <h1 className="text-[#1a1a1a] font-semibold text-[17px] uppercase ">
            Thông tin phiếu
          </h1>

          <div className="my-6 grid 2xs:gap-4 md:ga2xs:p-4 md:p-6 grid-cols-1 md:grid-cols-3">
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
        <div className="2xs:p-4 md:p-6 mt-5">
          <h1 className="text-[#1a1a1a] font-semibold text-[17px] uppercase ">
            Thông tin mặt hàng, nguyên liệu
          </h1>

          <div className="my-6 2xs:gap-4 md:ga2xs:p-4 md:p-6">
            <ComponentStyled>
              <div className="grid grid-cols-12">
                <div className="md:col-span-10 2xs:col-span-7 xs:col-span-8 sm:col-span-9">
                  <CustomInput
                    onChange={(value: any) => console.log(value)}
                    className="suffix-icon h-11 !rounded "
                    placeholder={t("searchItemIngredient")}
                  />
                </div>
                <div className="md:col-span-2 2xs:col-span-5 xs:col-span-4 sm:col-span-3">
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
        <div className="2xs:p-4 md:p-6 mt-5">
          <Label infoText="" label="Ghi chú" />
          <CustomTextarea
            placeholder="Nhập mô tả"
            onChange={() => {}}
            rows={7}
          />
        </div>
      </CustomCardItem>

      <div className="card flex justify-end 2xs:my-4 md:my-6">
        <Space>
          <CustomButton
            type="original"
            wrapClassName="2xs:w-[75px] sm:w-[85px] md:w-[100px]"
          >
            {t("cancel")}
          </CustomButton>
          <CustomButton
            type="border-color"
            wrapClassName="2xs:w-[75px] sm:w-[85px] md:w-[100px]"
          >
            {t("order")}
          </CustomButton>
          <CustomButton
            type="primary"
            wrapClassName="2xs:w-[170px] md:w-[187px]"
          >
            {t("orderAndStockIn")}
          </CustomButton>
        </Space>
      </div>
    </div>
  );
};

export default AddStockCheck;

export const ComponentStyled = styled.div`
  .ant-btn {
    border-radius: 0 4px 4px 0 !important;
  }

  .ant-input {
    border-radius: 4px 0 0 4px !important;
  }
`;
