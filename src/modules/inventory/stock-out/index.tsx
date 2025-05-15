import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";

import Title from "@/components/Title";
import { CustomButton } from "@/components/CustomButton";
import Table from "../InventoryTable";

import NotFound from "@/assets/images/RecieptNotFound.png";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import { useEffect, useState } from "react";

const StockOut = () => {
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
      referenceCode: "XK000124",
      receiptType: "cancelMaterialOrItem",
      receiptName: "Nhập rau 1408",
      quantity: 20,
      stockImportValue: 300000,
      creator: "Chu Dung",
      stockStatus: "stockOut",
      unit: "kg",
    },
    {
      key: 2,
      createdTime: "24/08/2024 19:02",
      referenceCode: "NK000125",
      receiptType: "transferToAnotherLocation",
      receiptName: "Hàng đông lạnh",
      quantity: 30,
      stockImportValue: 2500000,
      creator: "Chu Dung",
      stockStatus: "stockOut",
      unit: "kg",
    },
    {
      key: 3,
      createdTime: "20/08/2024 19:02",
      referenceCode: "XK000126",
      receiptType: "transferToAnotherLocation",
      receiptName: "Nước ngọt",
      quantity: 30,
      stockImportValue: 150000,
      creator: "Chu Dung",
      stockStatus: "stockOut",
      unit: "thùng",
    },
  ];

  const locale = {
    emptyText: (
      <div className="text-center my-12 items-center flex flex-col">
        <Image src={NotFound} alt="No Data" />
        <div className="my-5">
          <p className="text-[#333333] mb-2 font-semibold text-lg">
            {t("noExportInventoryReceipt")}
          </p>
          <p className="text-[#666666]">
            Phiếu xuất kho dùng để theo dõi chi tiết nguyên liệu / mặt hàng đã
            xuất cho <br /> các bên liên quan sử dụng, làm căn cứ để hạch toán
            chi phí và kiểm tra
          </p>
        </div>
        <Link href={"/inventory/stock-out/add-export-reciept"}>
          <CustomButton
            type="primary"
            wrapClassName="mx-2 w-[201px]"
            prefixIcon={<Image src={PlusIcon} />}
          >
            {t("addExportReceipt")}
          </CustomButton>
        </Link>
      </div>
    ),
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <Title>inventoryExportReceiptList</Title>
        <div>
          <Link href={"/inventory/stock-out/add-export-reciept"}>
            <CustomButton
              type="primary"
              wrapClassName="mx-2"
              prefixIcon={<Image src={PlusIcon} />}
              className={`${isSmallScreen ? "no-text" : ""}`}
            >
              {t("addExportReceipt")}
            </CustomButton>
          </Link>
        </div>
      </div>

      <Table locale={locale} dataSource={dataSource} />
    </>
  );
};

export default StockOut;
