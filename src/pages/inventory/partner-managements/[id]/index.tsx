import { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";

import ArrowLeftIcon from "@/assets/ArrowLeft.svg";
import DetailPartner from "@/modules/inventory/partner/detail";

interface PageDetailProps {
  id: string;
}

const Index: NextPage<PageDetailProps> = ({ id }) => {
  const { t } = useTranslation();

  return (
    <>
      <Layout
        meta={
          <Meta title="Doop - Web dashboard" description="Thêm phiếu kiểm kê" />
        }
        title={
          <Link href="/inventory/partner-managements">
            <span className="flex cursor-pointer items-center gap-2 text-base font-medium text-[#969696]">
              <Image src={ArrowLeftIcon} /> Quay lại danh sách đối tác
            </span>
          </Link>
        }
      >
        <DetailPartner />
      </Layout>
    </>
  );
};

export default Index;
