"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { Row, Flex, Collapse } from "antd";
import { CustomModal, SaveButton } from "./styled";
import { CustomButton } from "@/components/CustomButton";
import CustomTag from "@/components/CustomTag";
import styled from "styled-components";
import { formatMoney } from "@/helpers";
import { formatTime } from "@/utils";

import info from "@/assets/images/info.png";
import logo from "@/public/logo.png";

import coffee from "@/assets/Coffee.svg";
import closeIcon from "@/assets/arrowIcon2.svg";
import openIcon from "@/assets/openIcon.svg";

const { Panel } = Collapse;

interface InvoicesModalProps {
  open: boolean;
  onClose: () => void;
  data: any;
  openCancelModal?: any;
}

const StyledCollapse = styled(Collapse)`
  .ant-collapse-header-text {
    color: #333333;
    font-weight: 400;
    font-size: 14px;
  }

  .ant-collapse-header {
    padding: 0 !important;
    margin-bottom: 2px;
  }

  .ant-collapse-content-box {
    padding: 0px !important;
  }
`;

const StyledPanel = styled(Panel)``;

const InvoicesModal: React.FC<InvoicesModalProps> = ({
  open,
  onClose,
  data,
  openCancelModal,
}) => {
  const { t } = useTranslation();
  const tax = data.taxValue;
  const [activeKey, setActiveKey] = useState<string[] | any>([""]);

  const getTagColor = {
    DONE: "success",
    CANCEL: "error",
    REFUND: "warning",
    CREDIT: "default",
    default: "default",
  };

  const getTagTitle = {
    DONE: "Đã thanh toán",
    CANCEL: "Đã hủy",
    REFUND: "Hoàn tiền",
    CREDIT: "Ghi nợ",
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "TABLE":
        return t("dineIn");
      default:
        return t(type);
    }
  };

  const items: any[] = [
    {
      key: "4",
      label: "Tiền mặt hàng combo:",
      right: (
        <div>
          <p className="text-[#1a1a1a] font-medium">
            {formatMoney(
              data.items.reduce((total, item) => total + item.finalPrice, 0)
            )}
          </p>
        </div>
      ),
      children: (
        <>
          {data?.items?.length > 0
            ? data.items.map((item) => (
                <div
                  key={item.id}
                  className="text-[#333333] p-2 text-[14px] border-b-[1px] border-[#E5E5E5] bg-[#F9FAFC] flex justify-between"
                >
                  <p>{item.productName}</p>
                  <div>
                    <p className="text-[#1a1a1a] font-medium">
                      {formatMoney(item.finalPrice)}
                    </p>
                  </div>
                </div>
              ))
            : ""}
        </>
      ),
      showArrow: false,
    },
    {
      key: "5",
      label: "Thuế + phí:",
      right: (
        <div>
          <p className="text-[#1a1a1a] font-medium">
            {formatMoney(data.taxValue)}
          </p>
        </div>
      ),
      children: (
        <div className="text-[#333333] p-2 text-[14px] border-b-[1px] border-[#E5E5E5] bg-[#F9FAFC] flex justify-between">
          <p>Tiền thuế + phí:</p>
          <div>
            <p className="text-[#1a1a1a] font-medium">
              {formatMoney(data.taxValue)}
            </p>
          </div>
        </div>
      ),
      showArrow: false,
    },
    {
      key: "6",
      label: "Thanh toán:",
      right: (
        <div>
          <p className="text-[#1a1a1a] font-medium">
            {formatMoney(data.totalPrice)}
          </p>
        </div>
      ),
      children: (
        <div>
          <div className="text-[#333333] p-2 text-[14px] border-b-[1px] border-[#E5E5E5] bg-[#F9FAFC] flex justify-between">
            <p>Tiền mặt:</p>
            <div>
              <p className="text-[#1a1a1a] font-medium">
                {formatMoney(data.customerPaid)}
              </p>
            </div>
          </div>
          <div className="text-[#333333] p-2 text-[14px] border-b-[1px] border-[#E5E5E5] bg-[#F9FAFC] flex justify-between">
            <p>Tiền trả khách:</p>
            <div>
              <p className="text-[#1a1a1a] font-medium">
                {formatMoney(data.customerPaid)}
              </p>
            </div>
          </div>
        </div>
      ),
      showArrow: false,
    },
  ];

  const items2: any[] = [
    {
      key: "1",
      label: "Mã tham chiếu",
      right: (
        <div>
          <p className="text-[#1a1a1a] font-medium">{data.code}</p>
        </div>
      ),

      showArrow: false,
    },
    {
      key: "2",
      label: "Trạng thái đơn hàng:",
      right: (
        <div>
          <CustomTag
            title={getTagTitle[data.status]}
            color={getTagColor[data.status] || getTagColor.default}
          />
        </div>
      ),
      children: (
        <div>
          <div className="text-[#333333] p-2 text-[14px] border-b-[1px] border-[#E5E5E5] bg-[#F9FAFC] flex justify-between">
            <p>Thời gian tạo đơn:</p>
            <div>
              <p className="text-[#1a1a1a] font-medium">
                {data.timeCreateCurrentBill
                  ? formatTime(data.timeCreateCurrentBill)
                  : "-"}
              </p>
            </div>
          </div>
          <div className="text-[#333333] p-2 text-[14px] border-b-[1px] border-[#E5E5E5] bg-[#F9FAFC] flex justify-between">
            <p>Thời gian thanh toán:</p>
            <div>
              <p className="text-[#1a1a1a] font-medium">
                {formatTime(data.createdAt)}
              </p>
            </div>
          </div>
        </div>
      ),
      showArrow: false,
    },
    {
      key: "3",
      label: "Hình thức phục vụ:",
      right: (
        <div>
          <div className="small-container">
            <Image src={coffee} alt="coffee" />
            <p className="price expand2">{getTypeLabel(data.type)}</p>
          </div>
        </div>
      ),
      children: (
        <div>
          <div className="text-[#333333] p-2 text-[14px] border-b-[1px] border-[#E5E5E5] bg-[#F9FAFC] flex justify-between">
            <p>Khu vực:</p>
            <div>
              <p className="text-[#1a1a1a] font-medium">{data.positionName}</p>
            </div>
          </div>
          <div className="text-[#333333] p-2 text-[14px] border-b-[1px] border-[#E5E5E5] bg-[#F9FAFC] flex justify-between">
            <p>Thu ngân:</p>
            <div>
              <p className="text-[#1a1a1a] font-medium">
                {data.employeeNameEnd}
              </p>
            </div>
          </div>
        </div>
      ),
      showArrow: false,
    },
  ];

  return (
    <CustomModal
      centered
      title={
        <>
          <Flex justify="space-between">
            <Image src={logo} alt="Logo" width={80} height={32} />
            <div>
              <Image src={info} alt="Info Icon" height={24} width={175} />
            </div>
          </Flex>
          <div>
            <p>
              #{data.code} * {t("revenue")} {formatMoney(data.totalPrice)}
            </p>
          </div>
        </>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <div className="flex justify-between">
          <CustomButton
            key="cancel"
            type="link"
            onClick={openCancelModal}
            className="!h-10"
          >
            {t("Hủy hóa đơn")}
          </CustomButton>

          <SaveButton key="save" onClick={onClose}>
            {t("close")}
          </SaveButton>
        </div>,
      ]}
      closeIcon={null}
    >
      <Row gutter={[16, 16]}>
        <div className="container">
          <div className="header-title">
            <h1>{t("paymentInfo")}</h1>
          </div>
          <div className="body-container">
            <StyledCollapse
              defaultActiveKey={[""]}
              onChange={(key) => setActiveKey(key)}
              ghost
              className="flex flex-col gap-4 w-full"
            >
              {items.map((item) => (
                <StyledPanel
                  header={
                    <div className="flex justify-between items-center">
                      {item.label}

                      <div className="flex items-center gap-1">
                        {item.right}

                        <Image
                          src={
                            activeKey.includes(item.key) ? openIcon : closeIcon
                          }
                          alt="toggle-icon"
                          height={12}
                          width={12}
                          className="collapse-icon"
                        />
                      </div>
                    </div>
                  }
                  key={item.key}
                  showArrow={item.showArrow}
                >
                  <div>{item.children}</div>
                </StyledPanel>
              ))}
            </StyledCollapse>
          </div>
        </div>
        <div className="container">
          <div className="header-title">
            <h1>{t("transactionInfo")}</h1>
          </div>
          <div className="body-container">
            <StyledCollapse
              defaultActiveKey={[""]}
              onChange={(key) => setActiveKey(key)}
              ghost
              className="flex flex-col gap-4 w-full"
            >
              {items2.map((item) => (
                <StyledPanel
                  header={
                    <div className="flex justify-between items-center">
                      {item.label}

                      <div className="flex items-center gap-1">
                        {item.right}

                        {item.children ? (
                          <Image
                            src={
                              activeKey.includes(item.key)
                                ? openIcon
                                : closeIcon
                            }
                            alt="toggle-icon"
                            height={12}
                            width={12}
                            className="collapse-icon"
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  }
                  key={item.key}
                  showArrow={item.showArrow}
                >
                  <div>{item.children}</div>
                </StyledPanel>
              ))}
            </StyledCollapse>
          </div>
        </div>
      </Row>
    </CustomModal>
  );
};

export default InvoicesModal;
