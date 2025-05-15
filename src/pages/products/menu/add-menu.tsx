import Image from "next/image";
import Link from "next/link";

import ArrowLeftIcon from "@/assets/ArrowLeft.svg";
import { formatBoolean } from "@/helpers";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import AddProduct from "@/modules/products/list-product/add-product";
import AddMenu from "@/modules/products/menu/add-menu";

export const getServerSideProps = (context) => {
  const { id, copy } = context.query;

  return { props: { id: id || null, copy: formatBoolean(copy) } };
};

const Index = ({ id, copy }: { id?: string; copy?: boolean }) => {
  return (
    <Layout
      meta={
        <Meta title="Doop - Web dashboard" description="Thêm mới thực đơn" />
      }
      title={
        <Link href="/products/menu">
          <span className="flex cursor-pointer items-center gap-2 text-base font-medium text-[#969696]">
            <Image src={ArrowLeftIcon} /> Quay về danh sách thực đơn
          </span>
        </Link>
      }
    >
      <AddMenu />
    </Layout>
  );
};

export default Index;
