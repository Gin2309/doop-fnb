import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";

import Title from "@/components/Title";
import { CustomButton } from "@/components/CustomButton";
import Table from "../InventoryTable";

import NotFound from "@/assets/images/RecieptNotFound.png";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import { useEffect, useState } from "react";

const StockIn = () => {
  const { t } = useTranslation();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 550);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const dataSource = [
    {
      key: 1,
      createdTime: "14/08/2024 09:02",
      referenceCode: "NK000024",
      receiptType: "import",
      receiptName: "Nhập rau 1408",
      quantity: 20,
      stockImportValue: 300000,
      creator: "Chu Dung",
      stockStatus: "stockIn",
      unit: "kg",
    },
    {
      key: 2,
      createdTime: "24/08/2024 19:02",
      referenceCode: "NK000025",
      receiptType: "export",
      receiptName: "Hàng đông lạnh",
      quantity: 30,
      stockImportValue: 2500000,
      creator: "Chu Dung",
      stockStatus: "order",
      unit: "kg",
    },
    {
      key: 3,
      createdTime: "20/08/2024 19:02",
      referenceCode: "NK000026",
      receiptType: "import",
      receiptName: "Nước ngọt",
      quantity: 30,
      stockImportValue: 150000,
      creator: "Chu Dung",
      stockStatus: "stockIn",
      unit: "thùng",
    },
  ];

  const locale = {
    emptyText: (
      <div className="text-center my-12 items-center flex flex-col">
        <Image src={NotFound} alt="No Data" />
        <div className="my-5">
          <p className="text-[#333333] mb-2 font-semibold text-lg">
            {t("noImportInventoryReceipt")}
          </p>
          <p className="text-[#666666]">
            Phiếu nhập kho là chứng từ ghi lại, theo dõi tình hình tài sản của
            nhà hàng. <br />
            Cung cấp thông tin về nguồn mặt hàng, nguyên vật liệu
          </p>
        </div>
        <Link href={"/inventory/stock-in/add-import-reciept"}>
          <CustomButton
            type="primary"
            wrapClassName="mx-2 w-[201px]"
            prefixIcon={<Image src={PlusIcon} />}
          >
            {t("addImportReceipt")}
          </CustomButton>
        </Link>
      </div>
    ),
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <Title>inventoryImportReceiptList</Title>
        <div>
          <Link href={"/inventory/stock-in/add-import-reciept"}>
            <CustomButton
              type="primary"
              wrapClassName="mx-2"
              prefixIcon={<Image src={PlusIcon} />}
              className={`${isSmallScreen ? "no-text" : ""}`}
            >
              {t("addImportReceipt")}
            </CustomButton>
          </Link>
        </div>
      </div>

      <Table locale={locale} dataSource={dataSource} />
    </>
  );
};

export default StockIn;
