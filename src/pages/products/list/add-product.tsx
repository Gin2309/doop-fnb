import Image from "next/image";
import Link from "next/link";

import ArrowLeftIcon from "@/assets/ArrowLeft.svg";
import { formatBoolean } from "@/helpers";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import AddProduct from "@/modules/products/list-product/add-product";

export const getServerSideProps = (context) => {
  const { id, copy } = context.query;

  return { props: { id: id || null, copy: formatBoolean(copy) } };
};

const Index = ({ id, copy }: { id?: string; copy?: boolean }) => {
  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Thêm mặt hàng" />}
    >
      <AddProduct id={id} />
    </Layout>
  );
};

export default Index;
