import { CustomButton } from "@/components/CustomButton";
import Label from "@/components/CustomLabel";
import { CustomSelect } from "@/components/CustomSelect";
import Title from "@/components/Title";
import { Button, Col, Divider, Row, Space } from "antd";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import SortingIcon from "@/assets/column-sorting.svg";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import { CustomSwitch } from "@/components/CustomSwitch";
import { CustomInput, CustomTextarea } from "@/components/CustomInput";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import { CustomRadio } from "@/components/CustomRadio";
import NormalUpload from "@/components/CustomUpload/NormalUpload";
import { useState } from "react";

import { CustomCardItem } from "@/components/CustomCardItem";
import { CustomDatePicker } from "@/components/CustomDatePicker";

const groupProduct = {
  data: {
    items: [
      { id: "1", name: "Đơn vị 1" },
      { id: "2", name: "Đơn vị 2" },
      { id: "3", name: "Đơn vị 3" },
    ],
  },
};

const radioOptions = [
  { value: "1", label: "Bán tại nhà hàng" },
  { value: "2", label: "GrabFood" },
];

const AddPayment = () => {
  const { t } = useTranslation();
  const [openDeleteProductModal, setOpenDeleteProductModal] = useState(false);
  return (
    <div className="m-h-[100vh] pb-[50px]">
      <Title>Thêm mới phiếu chi</Title>
      <div className="my-6 flex gap-6">
        <Row gutter={16} className="w-full">
          <Col xs={24} sm={4} md={12} lg={16} xl={16}>
            <CustomCardItem>
              <div className="p-6 mt-5">
                <div className="flex justify-between gap-[20px] mb-4">
                  <div className="flex-1">
                    <Label infoText="" label="Mã phiếu thu" />
                    <CustomInput
                      type="text"
                      placeholder="Mã sinh tự động"
                      className="w-[100%] h-11 flex-1"
                      onChange={() => {}}
                    />
                  </div>
                  <div className="flex-1">
                    <Label infoText="" label="Giá trị thu" required />
                    <CustomInput
                      type="text"
                      placeholder="Nhập giá trị thu"
                      className="w-[100%] h-11 flex-1"
                      onChange={() => {}}
                    />
                  </div>
                </div>

                <div className="flex justify-between gap-[20px] mb-4">
                  <div className="flex-1">
                    <Label infoText="" label="Loại phiếu thu" required />
                    <CustomSelect
                      onChange={(value) => console.log(value)}
                      options={groupProduct?.data?.items?.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                      showSearch={true}
                      className="suffix-icon h-11 !rounded"
                      placeholder="-- Chọn danh mục thu --"
                      suffixIcon={
                        <div className="flex items-center gap-[5px] ">
                          <Image src={SortingIcon} alt="" />
                        </div>
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Label infoText="" label="Nhóm người nộp" required />
                    <CustomSelect
                      onChange={(value) => console.log(value)}
                      options={groupProduct?.data?.items?.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                      showSearch={true}
                      className="suffix-icon h-11 !rounded"
                      placeholder="-- Chọn nhóm người nộp --"
                      suffixIcon={
                        <div className="flex items-center gap-[5px] ">
                          <Image src={SortingIcon} alt="" />
                        </div>
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-between gap-[20px] mb-4">
                  <div className="flex-1">
                    <Label infoText="" label="Tên người nộp" required />
                    <CustomSelect
                      onChange={(value) => console.log(value)}
                      options={groupProduct?.data?.items?.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                      showSearch={true}
                      className="suffix-icon h-11 !rounded"
                      placeholder="-- Chọn người nộp --"
                      suffixIcon={
                        <div className="flex items-center gap-[5px] ">
                          <Image src={SortingIcon} alt="" />
                        </div>
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Label
                      infoText=""
                      label="Phương thưc thanh toán"
                      required
                    />
                    <CustomSelect
                      onChange={(value) => console.log(value)}
                      options={groupProduct?.data?.items?.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                      showSearch={true}
                      className="suffix-icon h-11 !rounded"
                      placeholder="-- Chọn phương thức thanh toán --"
                      suffixIcon={
                        <div className="flex items-center gap-[5px] ">
                          <Image src={SortingIcon} alt="" />
                        </div>
                      }
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <Label infoText="" label="Mô tả" />
                  <CustomTextarea
                    placeholder="Nhập mô tả"
                    onChange={() => {}}
                    rows={7}
                  />
                </div>
              </div>
            </CustomCardItem>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <CustomCardItem className="mb-4">
              <div className="p-6 mt-5">
                <div className="mb-4">
                  <Label infoText="" label="Thời gian ghi nhận" required />
                  <CustomDatePicker
                    onChange={() => {}}
                    bordered={true}
                    picker="date"
                  />
                </div>

                <div className="mb-4">
                  <Label infoText="" label="Chứng từ gốc" required />
                  <CustomInput
                    type="text"
                    placeholder="Nhập chứng từ gốc"
                    className="w-[100%] h-11 flex-1"
                    onChange={() => {}}
                  />
                </div>

                <CustomCheckbox>Hoạch toán kết quả kinh doanh</CustomCheckbox>
              </div>
            </CustomCardItem>

            <CustomCardItem className="mb-4">
              <div className="p-6">
                <CustomCheckbox>Tạo phiếu mẫu</CustomCheckbox>
                <CustomInput
                  type="text"
                  placeholder="Nhập tên phiếu mẫu"
                  className="w-[100%] mt-4 h-11 flex-1"
                  onChange={() => {}}
                />
              </div>
            </CustomCardItem>
          </Col>
        </Row>
      </div>

      <div
        className="bg-white border-t-[1px] h-[72px] fixed right-0 bottom-0 flex justify-between items-center px-[30px]"
        style={{ width: "calc(100% - 230px)" }}
      >
        <CustomButton
          type="danger"
          wrapClassName="w-[100px]"
          onClick={() => setOpenDeleteProductModal(true)}
        >
          Xóa
        </CustomButton>
        <Space>
          <CustomButton type="original" wrapClassName="w-[100px]">
            Hủy
          </CustomButton>
          <CustomButton type="primary" wrapClassName="w-[100px]">
            Lưu
          </CustomButton>
        </Space>
      </div>
    </div>
  );
};

export default AddPayment;
