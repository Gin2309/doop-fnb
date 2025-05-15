import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import ArrowLeftIcon from "@/assets/ArrowLeft.svg";
import AddImportReceipt from "@/modules/inventory/stock-in/add";

const Index = () => {
  const { t } = useTranslation();

  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Thêm phiếu nhập" />}
      title={
        <Link href="/inventory/stock-in/">
          <span className="flex cursor-pointer items-center gap-2 text-base font-medium text-[#969696]">
            <Image src={ArrowLeftIcon} /> {t("backToStockIn")}
          </span>
        </Link>
      }
    >
      <AddImportReceipt />
    </Layout>
  );
};

export default Index;
