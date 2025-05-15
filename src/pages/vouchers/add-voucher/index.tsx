import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import ArrowLeftIcon from "@/assets/ArrowLeft.svg";
import AddVoucher from "@/modules/voucher/add";
import { formatBoolean } from "@/helpers";

export const getServerSideProps = (context) => {
  const { id, copy } = context.query;

  return { props: { id: id || null, copy: formatBoolean(copy) } };
};

const Index = ({ id, copy }: { id?: string; copy?: boolean }) => {
  const { t } = useTranslation();

  return (
    <Layout
      meta={<Meta title="Doop - Web dashboard" description="Thêm voucher" />}
    >
      <AddVoucher id={id} />
    </Layout>
  );
};

export default Index;
