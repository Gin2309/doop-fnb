import Image from "next/image";
import Link from "next/link";

import ArrowLeftIcon from "@/assets/ArrowLeft.svg";
import { formatBoolean } from "@/helpers";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import AddReceipt from "@/modules/cashbooks/receipt/add-receipt";

export const getServerSideProps = (context) => {
  const { id, copy } = context.query;

  return { props: { id: id || null, copy: formatBoolean(copy) } };
};

const Index = ({ id, copy }: { id?: string; copy?: boolean }) => {
  return (
    <Layout
      meta={
        <Meta title="Doop - Web dashboard" description="Thêm mới phiếu thu" />
      }
      title={
        <Link href="/cashbooks/receipt">
          <span className="flex cursor-pointer items-center gap-2 text-base font-medium text-[#969696]">
            <Image src={ArrowLeftIcon} /> Quay về danh sách phiếu thu
          </span>
        </Link>
      }
    >
      <AddReceipt />
    </Layout>
  );
};

export default Index;
